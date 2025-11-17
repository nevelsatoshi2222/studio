

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Ensure admin is initialized only once.
if (!admin.apps.length) {
    admin.initializeApp();
}
const db = admin.firestore();

// Commission rates
const COMMISSION_RATES = {
    LEVEL_1_TO_5: 0.002,    // 0.2%
    LEVEL_6_TO_15: 0.001,   // 0.1%
};

/**
 * Cloud Function to process a new presale purchase and pay commissions up the referral chain.
 * This is now triggered when a presale document is CREATED.
 * This is a secure, server-side operation.
 */
export const distributeCommission = functions.firestore
    .document('presales/{presaleId}')
    .onCreate(async (snapshot, context) => {
        const presaleData = snapshot.data();
        
        // --- Exit if data is missing ---
        if (!presaleData) {
            functions.logger.log(`Presale document ${context.params.presaleId} has no data. Exiting.`);
            return null;
        }
        
        const buyerId: string = presaleData.userId;
        // THE FIX: Use `amountUSDT` for commission calculation, not `pgcCredited`
        const purchaseAmount: number = presaleData.amountUSDT; 
        const presaleRef = snapshot.ref;
        
        functions.logger.log(`Processing commission for new presale ${presaleRef.id} from buyer ${buyerId} for ${purchaseAmount} USDT.`);

        // 1. Get the buyer's referrer (Level 1 Upline)
        const buyerDoc = await db.collection('users').doc(buyerId).get();
        if (!buyerDoc.exists) {
            functions.logger.error(`Buyer document for ${buyerId} not found.`);
            return null;
        }
        const referrerId: string | undefined = buyerDoc.data()?.referredByUserId;

        // If no referrer, there's no commission to pay out.
        if (!referrerId) {
            functions.logger.log(`Purchase by ${buyerId} has no valid referrer. Exiting commission payout.`);
            // Even if no commission, mark presale as completed to avoid reprocessing
            await presaleRef.update({ status: 'COMPLETED' });
            return null;
        }

        // --- Commission Payout Loop ---
        let currentUplineId = referrerId;
        const maxLevels = 15;
        const batch = db.batch();
        let transactionCount = 0;

        for (let level = 1; level <= maxLevels; level++) {
            if (!currentUplineId) {
                functions.logger.log(`Reached top of the referral chain at level ${level-1}.`);
                break;
            }

            // Determine commission rate based on level
            const rate = level <= 5 ? COMMISSION_RATES.LEVEL_1_TO_5 : COMMISSION_RATES.LEVEL_6_TO_15;
            const commissionAmount = purchaseAmount * rate;
            
            // Reference to the current upline user
            const uplineRef = db.collection('users').doc(currentUplineId);
            
            // 2. Add balance update to the batch - Commission is paid in USDT, not PGC
            batch.update(uplineRef, {
                usdBalance: admin.firestore.FieldValue.increment(commissionAmount),
                totalCommission: admin.firestore.FieldValue.increment(commissionAmount)
            });
            
            // 3. Add transaction log to the batch
            const transactionRef = db.collection('transactions').doc();
            batch.set(transactionRef, {
                userId: currentUplineId,
                type: 'COMMISSION',
                amount: commissionAmount,
                currency: 'USDT', // Log currency as USDT
                level: level,
                purchaseRef: presaleRef.path, // Store the path to the presale document
                fromUserId: buyerId,
                timestamp: admin.firestore.FieldValue.serverTimestamp()
            });
            transactionCount += 1;

            // 4. Find the next upline user (the referrer of the current upline)
            const uplineDoc = await uplineRef.get();
            if (!uplineDoc.exists) {
                functions.logger.warn(`Upline user ${currentUplineId} not found at level ${level}. Stopping chain.`);
                break;
            }
            currentUplineId = uplineDoc.data()?.referredByUserId;
        }
        
        // 5. Commit all updates atomically
        if (transactionCount > 0) {
            try {
                await batch.commit();
                functions.logger.log(`Successfully paid commissions for ${presaleRef.id} up to ${transactionCount} levels.`);

            } catch (error) {
                functions.logger.error(`Error committing commission batch for presale ${presaleRef.id}:`, error);
                // In a production system, you might add retry logic or a dead-letter queue here.
            }
        } else {
            functions.logger.log(`No commissions were calculated for presale ${presaleRef.id}.`);
        }
        
        // 6. Update the presale status to 'COMPLETED' after successful commission payout
        await presaleRef.update({ status: 'COMPLETED' });
        
        return null;
    });

    