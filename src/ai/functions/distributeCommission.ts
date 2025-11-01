
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
 * This is triggered when a presale document's status is updated to 'COMPLETED'.
 * This is a secure, server-side operation.
 */
export const distributeCommission = functions.firestore
    .document('presales/{presaleId}')
    .onUpdate(async (change, context) => {
        const presaleAfter = change.after.data();
        const presaleBefore = change.before.data();

        // --- Trigger Condition ---
        // Only run if the status was NOT 'COMPLETED' before, and IS 'COMPLETED' now.
        // This ensures it runs exactly once when an admin verifies a purchase.
        if (presaleBefore.status === 'COMPLETED' || presaleAfter.status !== 'COMPLETED') {
            functions.logger.log(`Presale ${context.params.presaleId} status not newly completed. Exiting.`);
            return null;
        }

        const buyerId: string = presaleAfter.userId;
        const purchaseAmount: number = presaleAfter.pgcCredited; // Commission is on total PGC credited
        const presaleRef = change.after.ref;
        
        functions.logger.log(`Processing commission for presale ${presaleRef.id} from buyer ${buyerId} for ${purchaseAmount} PGC.`);

        // 1. Get the buyer's referrer (Level 1 Upline)
        const buyerDoc = await db.collection('users').doc(buyerId).get();
        if (!buyerDoc.exists) {
            functions.logger.error(`Buyer document for ${buyerId} not found.`);
            return null;
        }
        const referrerId: string | undefined = buyerDoc.data()?.referredBy;

        // If no referrer or the referrer is the root admin, there's no commission to pay out.
        if (!referrerId || referrerId === 'ADMIN_ROOT_USER') {
            functions.logger.log(`Purchase by ${buyerId} has no valid referrer. Exiting commission payout.`);
            return null;
        }

        // --- Commission Payout Loop ---
        let currentUplineId = referrerId;
        const maxLevels = 15;
        const batch = db.batch();
        let transactionCount = 0;

        for (let level = 1; level <= maxLevels; level++) {
            if (!currentUplineId || currentUplineId === 'ADMIN_ROOT_USER') {
                functions.logger.log(`Reached top of the referral chain at level ${level-1}.`);
                break;
            }

            // Determine commission rate based on level
            const rate = level <= 5 ? COMMISSION_RATES.LEVEL_1_TO_5 : COMMISSION_RATES.LEVEL_6_TO_15;
            const commissionAmount = purchaseAmount * rate;
            
            // Reference to the current upline user
            const uplineRef = db.collection('users').doc(currentUplineId);
            
            // 2. Add balance update to the batch
            batch.update(uplineRef, {
                pgcBalance: admin.firestore.FieldValue.increment(commissionAmount)
            });
            
            // 3. Add transaction log to the batch
            const transactionRef = db.collection('transactions').doc();
            batch.set(transactionRef, {
                userId: currentUplineId,
                type: 'COMMISSION',
                amount: commissionAmount,
                level: level,
                purchaseRef: presaleRef.path, // Store the path to the presale document
                timestamp: admin.firestore.FieldValue.serverTimestamp()
            });
            transactionCount += 1;

            // 4. Find the next upline user (the referrer of the current upline)
            const uplineDoc = await uplineRef.get();
            if (!uplineDoc.exists) {
                functions.logger.warn(`Upline user ${currentUplineId} not found at level ${level}. Stopping chain.`);
                break;
            }
            currentUplineId = uplineDoc.data()?.referredBy;
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
            functions.logger.log(`No commissions were batched for presale ${presaleRef.id}.`);
        }

        return null;
    });

