
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

// Commission rates
const COMMISSION_RATES = {
    LEVEL_1_TO_5: 0.002, // 0.2%
    LEVEL_6_TO_15: 0.001, // 0.1%
};

/**
 * Cloud Function to process a new presale purchase and pay commissions to the upline.
 * Triggered when a new document is created in the 'presales' collection.
 */
export const distributeCommission = functions.firestore
    .document('presales/{presaleId}')
    .onCreate(async (snap, context) => {
        const presale = snap.data();

        // This function should only run when an admin verifies the purchase.
        // We will simulate this by checking if the status is PENDING_VERIFICATION and then updating it.
        // In a real scenario, an admin would trigger this update.
        if (presale.status !== 'PENDING_VERIFICATION') {
            functions.logger.log(`Presale ${snap.id} is not pending verification. Exiting.`);
            return null;
        }

        // Simulate admin verification by updating the status to 'COMPLETED'
        // This prevents the function from re-triggering on its own writes.
        await snap.ref.update({ status: 'COMPLETED' });

        const buyerId: string = presale.userId;
        const purchaseAmount: number = presale.pgcCredited; // Use PGC credited for commission calculation
        const presaleRef = snap.ref;
        
        // 1. Get the buyer's referrer (Level 1 Upline)
        const buyerDoc = await db.collection('users').doc(buyerId).get();
        const referrerId: string = buyerDoc.data()?.referredBy;

        // If no referrer, exit the function.
        if (!referrerId || referrerId === 'ADMIN_ROOT_USER') {
            functions.logger.log(`Purchase by ${buyerId} has no valid referrer. Exiting commission payout.`);
            return null;
        }

        let currentUplineId = referrerId;
        const maxLevels = 15;
        let batch = db.batch();
        let transactionCount = 0;

        for (let level = 1; level <= maxLevels; level++) {
            if (!currentUplineId) {
                // We've reached the top of the chain before maxLevels
                break;
            }

            const rate = level <= 5 ? COMMISSION_RATES.LEVEL_1_TO_5 : COMMISSION_RATES.LEVEL_6_TO_15;
            const commissionAmount = purchaseAmount * rate;
            
            // 2. Prepare the commission update for the current upline user
            const uplineRef = db.collection('users').doc(currentUplineId);
            
            // Atomically update the balance
            batch.update(uplineRef, {
                pgcBalance: admin.firestore.FieldValue.increment(commissionAmount)
            });
            
            // 3. Prepare the transaction record
            const transactionRef = db.collection('transactions').doc();
            batch.set(transactionRef, {
                userId: currentUplineId,
                type: 'COMMISSION',
                amount: commissionAmount,
                level: level,
                purchaseRef: presaleRef,
                timestamp: admin.firestore.FieldValue.serverTimestamp()
            });
            transactionCount += 1;

            // 4. Find the next upline user (Level + 1)
            const uplineDoc = await uplineRef.get();
            if (!uplineDoc.exists) break; // Stop if an upline user doc doesn't exist
            currentUplineId = uplineDoc.data()?.referredBy;
            
            // Firestore batches have a limit of 500 writes. We're safe here (15 levels * 2 writes = 30).
        }
        
        // 5. Commit all batched updates (all or nothing)
        if (transactionCount > 0) {
            await batch.commit();
            functions.logger.log(`Successfully paid commissions for ${presaleRef.id} up to ${transactionCount} levels.`);
        }

        return null;
    });
