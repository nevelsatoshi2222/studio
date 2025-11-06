
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
export const distributeCommission = admin.firestore
    .document('presales/{presaleId}')
    .onCreate(async (snapshot, context) => {
        const presaleData = snapshot.data();
        
        // --- Exit if data is missing ---
        if (!presaleData) {
            console.log(`Presale document ${context.params.presaleId} has no data. Exiting.`);
            return null;
        }
        
        const buyerId: string = presaleData.userId;
        // **FIX**: Commission is now calculated on the USDT amount of the purchase.
        const purchaseAmountUSDT: number = presaleData.amountUSDT; 
        const presaleRef = snapshot.ref;
        
        console.log(`Processing commission for new presale ${presaleRef.id} from buyer ${buyerId} for ${purchaseAmountUSDT} USDT.`);

        // 1. Get the buyer's referrer (Level 1 Upline)
        const buyerDoc = await db.collection('users').doc(buyerId).get();
        if (!buyerDoc.exists) {
            console.error(`Buyer document for ${buyerId} not found.`);
            return null;
        }
        const referrerId: string | undefined = buyerDoc.data()?.referredBy;

        // If no referrer or the referrer is the root admin, there's no commission to pay out.
        if (!referrerId || referrerId === 'ADMIN_ROOT_USER') {
            console.log(`Purchase by ${buyerId} has no valid referrer. Exiting commission payout.`);
            return null;
        }

        // --- Commission Payout Loop ---
        let currentUplineId = referrerId;
        const maxLevels = 15;
        const batch = db.batch();
        let transactionCount = 0;

        for (let level = 1; level <= maxLevels; level++) {
            if (!currentUplineId || currentUplineId === 'ADMIN_ROOT_USER') {
                console.log(`Reached top of the referral chain at level ${level-1}.`);
                break;
            }

            // Determine commission rate based on level
            const rate = level <= 5 ? COMMISSION_RATES.LEVEL_1_TO_5 : COMMISSION_RATES.LEVEL_6_TO_15;
            const commissionAmount = purchaseAmountUSDT * rate;
            
            // Reference to the current upline user
            const uplineRef = db.collection('users').doc(currentUplineId);
            
            // 2. **FIX**: Add USDT balance update to the batch.
            batch.update(uplineRef, {
                usdtBalance: admin.firestore.FieldValue.increment(commissionAmount)
            });
            
            // 3. **FIX**: Add USDT transaction log to the batch.
            const transactionRef = db.collection('transactions').doc();
            batch.set(transactionRef, {
                userId: currentUplineId,
                type: 'COMMISSION',
                amount: commissionAmount,
                currency: 'USDT', // Specify currency
                level: level,
                purchaseRef: presaleRef.path, // Store the path to the presale document
                timestamp: admin.firestore.FieldValue.serverTimestamp()
            });
            transactionCount += 1;

            // 4. Find the next upline user (the referrer of the current upline)
            const uplineDoc = await uplineRef.get();
            if (!uplineDoc.exists) {
                console.warn(`Upline user ${currentUplineId} not found at level ${level}. Stopping chain.`);
                break;
            }
            currentUplineId = uplineDoc.data()?.referredBy;
        }
        
        // 5. Commit all updates atomically
        if (transactionCount > 0) {
            try {
                await batch.commit();
                console.log(`Successfully paid USDT commissions for ${presaleRef.id} up to ${transactionCount} levels.`);

                // 6. Update the presale status to 'COMPLETED' after successful commission payout
                await presaleRef.update({ status: 'COMPLETED' });

            } catch (error) {
                console.error(`Error committing commission batch for presale ${presaleRef.id}:`, error);
                // In a production system, you might add retry logic or a dead-letter queue here.
            }
        } else {
            console.log(`No commissions were batched for presale ${presaleRef.id}.`);
        }

        return null;
    });
