
import { NextRequest, NextResponse } from 'next/server';
import { Connection, PublicKey, Transaction, Keypair } from '@solana/web3.js';
import { getOrCreateAssociatedTokenAccount, createTransferInstruction } from '@solana/spl-token';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { PGC_TOKEN_MINT_ADDRESS, USDT_MINT_ADDRESS, CREATOR_TREASURY_SOLANA_USDT } from '@/lib/config';

// Initialize Firebase Admin SDK
// Make sure to have your service account key in the environment variables
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string);

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount)
  });
}
const db = getFirestore();


const PRESALE_TIERS = [
  { amountUSD: 10, instantPgc: 20, totalPgc: 160 },
  { amountUSD: 25, instantPgc: 50, totalPgc: 400 },
  { amountUSD: 50, instantPgc: 100, totalPgc: 800 },
  { amountUSD: 100, instantPgc: 200, totalPgc: 1600 },
  { amountUSD: 250, instantPgc: 500, totalPgc: 4000 },
  { amountUSD: 500, instantPgc: 1000, totalPgc: 8000 },
  { amountUSD: 1000, instantPgc: 2000, totalPgc: 16000 },
];

export async function POST(request: NextRequest) {
  const { usdtTransactionSignature, userId, packageAmountUSD } = await request.json();

  if (!usdtTransactionSignature || !userId || !packageAmountUSD) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const connection = new Connection(process.env.SOLANA_RPC_URL!, 'confirmed');
  const treasurySecretKey = Uint8Array.from(JSON.parse(process.env.TREASURY_WALLET_SECRET_KEY as string));
  const treasuryKeypair = Keypair.fromSecretKey(treasurySecretKey);

  try {
    // 1. Verify the USDT transaction
    const tx = await connection.getTransaction(usdtTransactionSignature, {
      maxSupportedTransactionVersion: 0,
    });

    if (!tx) {
      throw new Error('USDT transaction not found.');
    }

    // Basic verification logic (in a real app, this would be much more robust)
    const treasuryAddress = new PublicKey(CREATOR_TREASURY_SOLANA_USDT);
    const usdtMintAddress = new PublicKey(USDT_MINT_ADDRESS);
    let paymentVerified = false;

    for(const instruction of tx.transaction.message.instructions) {
      // You'd need to parse the instruction data to confirm amounts, source, and destination
      // This is a simplified check
      const programId = tx.transaction.message.accountKeys[instruction.programIdIndex];
      if (programId.toString() === 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA') {
         paymentVerified = true;
         break;
      }
    }

    if (!paymentVerified) {
       throw new Error('USDT payment could not be verified.');
    }

    // 2. Transfer PGC from treasury to user
    const selectedPkg = PRESALE_TIERS.find(p => p.amountUSD === packageAmountUSD);
    if (!selectedPkg) throw new Error('Invalid package.');

    const pgcAmount = selectedPkg.instantPgc * (10 ** 9); // PGC has 9 decimals
    const pgcMint = new PublicKey(PGC_TOKEN_MINT_ADDRESS);
    const userPublicKey = new PublicKey(tx.meta?.preTokenBalances?.[0]?.owner!);
    
    // Get or create token accounts for PGC
    const fromPgcAta = await getOrCreateAssociatedTokenAccount(connection, treasuryKeypair, pgcMint, treasuryKeypair.publicKey);
    const toPgcAta = await getOrCreateAssociatedTokenAccount(connection, treasuryKeypair, pgcMint, userPublicKey);
    
    const pgcTransaction = new Transaction().add(
      createTransferInstruction(
        fromPgcAta.address,
        toPgcAta.address,
        treasuryKeypair.publicKey,
        pgcAmount
      )
    );
    
    const pgcSignature = await connection.sendTransaction(pgcTransaction, [treasuryKeypair]);
    await connection.confirmTransaction(pgcSignature, 'confirmed');

    // 3. Record the presale in Firestore, which will trigger commissions
    const presaleCollection = db.collection('presales');
    await presaleCollection.add({
      userId,
      amountUSDT: packageAmountUSD,
      pgcCredited: selectedPkg.instantPgc,
      potentialPgc: selectedPkg.totalPgc,
      status: 'PENDING_VERIFICATION', // The commission function will change this to COMPLETED
      purchaseDate: new Date(),
      usdtTx: usdtTransactionSignature,
      pgcTx: pgcSignature,
    });

    return NextResponse.json({
      message: 'Purchase successful!',
      pgcAmount: selectedPkg.instantPgc,
      pgcTransactionSignature: pgcSignature,
    });

  } catch (error: any) {
    console.error('Presale Purchase API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

    