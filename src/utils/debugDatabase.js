import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, query, where } from 'firebase/firestore';

export async function checkUserData(userId) {
  try {
    console.log('🔍 Checking user data for:', userId);
    
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      console.log('📊 User Data:', {
        id: userId,
        email: userData.email,
        referral_code: userData.referral_code,
        referred_by: userData.referred_by,
        direct_team: userData.direct_team || [],
        createdAt: userData.createdAt
      });
      return userData;
    } else {
      console.log('❌ User not found:', userId);
      return null;
    }
  } catch (error) {
    console.error('Error checking user data:', error);
  }
}

export async function checkAllUsers() {
  try {
    console.log('🔍 Checking ALL users in database...');
    
    const usersSnapshot = await getDocs(collection(db, 'users'));
    const allUsers = [];
    
    usersSnapshot.forEach((doc) => {
      const userData = doc.data();
      allUsers.push({
        id: doc.id,
        email: userData.email,
        referral_code: userData.referral_code,
        referred_by: userData.referred_by,
        direct_team: userData.direct_team || []
      });
    });
    
    console.log('📋 ALL USERS:', allUsers);
    return allUsers;
  } catch (error) {
    console.error('Error checking all users:', error);
  }
}

export async function checkReferralRelationships() {
  try {
    console.log('🔗 Checking referral relationships...');
    
    const users = await checkAllUsers();
    
    const relationships = users.map(user => ({
      user: user.email,
      user_id: user.id,
      has_referral_code: !!user.referral_code,
      referred_by: user.referred_by,
      referred_by_user: users.find(u => u.id === user.referred_by)?.email || 'None'
    }));
    
    console.log('🔄 REFERRAL RELATIONSHIPS:', relationships);
    return relationships;
  } catch (error) {
    console.error('Error checking relationships:', error);
  }
}