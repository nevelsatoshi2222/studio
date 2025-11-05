const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Automatic reward system - triggers when user team changes
exports.autoAwardRewards = functions.firestore
  .document('users/{userId}')
  .onUpdate(async (change, context) => {
    const after = change.after.data();
    const userId = context.params.userId;
    
    const directTeamCount = after.direct_team?.length || 0;
    
    console.log(`🔍 Checking rewards for user ${userId}: ${directTeamCount} team members`);

    // Check Bronze reward (5 free members)
    if (directTeamCount >= 5 && (!after.currentFreeRank || after.currentFreeRank === 'None')) {
      console.log(`🎉 Awarding Bronze to user: ${userId}`);
      
      try {
        await change.after.ref.update({
          currentFreeRank: 'Bronze',
          coins: admin.firestore.FieldValue.increment(1),
          usdBalance: admin.firestore.FieldValue.increment(10),
          'freeAchievements.bronze': true
        });
        console.log(`✅ Successfully awarded Bronze to ${userId}`);
      } catch (error) {
        console.error(`❌ Failed to award Bronze to ${userId}:`, error);
      }
    }
    
    return null;
  });

// Level commission distribution - triggers on purchases
exports.distributeLevelCommissions = functions.firestore
  .document('purchases/{purchaseId}')
  .onCreate(async (snapshot, context) => {
    const purchase = snapshot.data();
    const buyerId = purchase.userId;
    const amount = purchase.amount;
    
    console.log(`💰 Processing commission for purchase: $${amount} by user: ${buyerId}`);
    
    let currentUserId = buyerId;
    let totalCommissionDistributed = 0;
    
    // Distribute commissions through 15 levels
    for (let level = 1; level <= 15; level++) {
      // Get referrer of current user
      const userDoc = await admin.firestore().collection('users').doc(currentUserId).get();
      
      if (!userDoc.exists) break;
      
      const userData = userDoc.data();
      const referrerId = userData.referredByUserId;
      
      if (!referrerId) break;
      
      // Calculate commission for this level
      const commissionRate = level <= 5 ? 0.002 : 0.001; // 0.2% or 0.1%
      const commissionAmount = amount * commissionRate;
      
      if (commissionAmount > 0) {
        try {
          // Update referrer's commission and balance
          await admin.firestore().collection('users').doc(referrerId).update({
            totalCommission: admin.firestore.FieldValue.increment(commissionAmount),
            usdBalance: admin.firestore.FieldValue.increment(commissionAmount)
          });
          
          totalCommissionDistributed += commissionAmount;
          console.log(`🎯 Level ${level}: $${commissionAmount} commission to ${referrerId}`);
        } catch (error) {
          console.error(`❌ Failed to distribute level ${level} commission:`, error);
        }
      }
      
      // Move to next level
      currentUserId = referrerId;
    }
    
    console.log(`✅ Total commissions distributed: $${totalCommissionDistributed}`);
    return null;
  });

// Update team stats when new user registers
exports.updateTeamStats = functions.firestore
  .document('users/{userId}')
  .onCreate(async (snapshot, context) => {
    const newUser = snapshot.data();
    const referrerId = newUser.referredByUserId;
    
    if (!referrerId) return null;
    
    console.log(`🔄 Updating team stats for referrer: ${referrerId}`);
    
    try {
      // Update referrer's direct team count
      await admin.firestore().collection('users').doc(referrerId).update({
        direct_team: admin.firestore.FieldValue.arrayUnion(context.params.userId)
      });
      
      console.log(`✅ Updated direct team for ${referrerId}`);
    } catch (error) {
      console.error(`❌ Failed to update team stats:`, error);
    }
    
    return null;
  });