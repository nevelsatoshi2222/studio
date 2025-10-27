
import { NextResponse } from 'next/server';
import { CREATOR_TREASURY_WALLET_ADDRESS } from '@/lib/config';

// This is a mock API endpoint. In a real-world scenario, this endpoint would:
// 1. Receive the purchase request.
// 2. Validate the payment of USDT from the buyer's wallet to the CREATOR_TREASURY_WALLET_ADDRESS.
// 3. Upon confirmation, trigger a transfer of PGC tokens from the CREATOR_TREASURY_WALLET_ADDRESS to the buyer's wallet.
// 4. Record the transaction details in a database.

// For this prototype, we will simulate a successful transaction and log the details.

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { packageAmountUSD, buyerWalletAddress } = body;

    if (!packageAmountUSD || !buyerWalletAddress) {
      return NextResponse.json({ error: 'Missing package amount or buyer wallet address' }, { status: 400 });
    }

    const presalePackages = [
        { amountUSD: 10, pgcAmount: 10, bonus: 10 },
        { amountUSD: 100, pgcAmount: 100, bonus: 100 },
        { amountUSD: 1000, pgcAmount: 1000, bonus: 1000 },
        { amountUSD: 10000, pgcAmount: 10000, bonus: 10000 },
    ];

    const selectedPkg = presalePackages.find(p => p.amountUSD === packageAmountUSD);

    if (!selectedPkg) {
         return NextResponse.json({ error: 'Invalid package selected' }, { status: 400 });
    }

    // Simulate creating a transaction signature
    const transactionSignature = `sim_txn_${Buffer.from(Date.now().toString() + buyerWalletAddress).toString('hex').slice(0, 64)}`;
    const totalPgcToSend = selectedPkg.pgcAmount + selectedPkg.bonus;

    // Log the intended transaction for the admin to process manually
    console.log('--- PRESALE PURCHASE INITIATED ---');
    console.log(`Buyer: ${buyerWalletAddress}`);
    console.log(`Package: $${selectedPkg.amountUSD}`);
    console.log('Action: User pays with USDT.');
    console.log('------------------------------------');
    console.log('Action: Send PGC from Treasury to Buyer.');
    console.log(`   From (Treasury): ${CREATOR_TREASURY_WALLET_ADDRESS}`);
    console.log(`   To (Buyer): ${buyerWalletAddress}`);
    console.log(`   Amount: ${totalPgcToSend.toLocaleString()} PGC (${selectedPkg.pgcAmount} + ${selectedPkg.bonus} bonus)`);
    console.log(`Simulated Signature: ${transactionSignature}`);
    console.log('--- END OF LOG ---');
    

    // Simulate a successful response
    const response = {
      message: 'Purchase successful! Your PGC is being sent.',
      transactionId: transactionSignature,
      pgcAmount: selectedPkg.pgcAmount,
      bonusPgc: selectedPkg.bonus,
      totalPgc: totalPgcToSend,
      buyer: buyerWalletAddress,
      seller: CREATOR_TREASURY_WALLET_ADDRESS,
    };

    // Simulate a delay for processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error('Presale API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
