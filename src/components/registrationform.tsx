'use client';
import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, collection, query, where, getDocs, updateDoc, arrayUnion, addDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    affiliateCode: '',
    walletAddress: ''
  });

  const generateAffiliateCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // 1. Create auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      
      const user = userCredential.user;
      const userAffiliateCode = generateAffiliateCode();

      // 2. Check if referred by someone
      let referredBy = null;
      if (formData.affiliateCode) {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('affiliateCode', '==', formData.affiliateCode));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          referredBy = formData.affiliateCode;
          
          // Update referrer's team
          const referrerDoc = querySnapshot.docs[0];
          await updateDoc(doc(db, 'users', referrerDoc.id), {
            'team.directReferrals': arrayUnion(user.uid)
          });
        }
      }

      // 3. Create user document
      await setDoc(doc(db, 'users', user.uid), {
        email: formData.email,
        fullName: formData.fullName,
        role: 'user',
        affiliateCode: userAffiliateCode,
        referredBy: referredBy,
        team: {
          directReferrals: [],
          totalTeam: 0
        },
        wallet: {
          address: formData.walletAddress,
          balance: 1000, // Starting balance
          pendingCommission: 0
        },
        kycStatus: 'pending',
        levelCommission: {
          level1: 10,
          level2: 5,
          level3: 2
        },
        joinedAt: new Date()
      });

      // 4. Create welcome commission for referrer
      if (referredBy) {
        await addDoc(collection(db, 'commissions'), {
          fromUserId: user.uid,
          toUserId: querySnapshot.docs[0].id,
          amount: 10, // $10 welcome bonus
          level: 1,
          type: 'registration',
          status: 'pending',
          createdAt: new Date()
        });
      }

      alert('Registration successful! Your affiliate code: ' + userAffiliateCode);
      
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed: ' + error.message);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Join Public Governance</h2>
      
      <form onSubmit={handleRegistration}>
        <div className="mb-4">
          <label className="block text-gray-700">Full Name</label>
          <input
            type="text"
            required
            className="w-full p-2 border rounded"
            value={formData.fullName}
            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            required
            className="w-full p-2 border rounded"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            required
            className="w-full p-2 border rounded"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Wallet Address</label>
          <input
            type="text"
            required
            className="w-full p-2 border rounded"
            value={formData.walletAddress}
            onChange={(e) => setFormData({...formData, walletAddress: e.target.value})}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Affiliate Code (Optional)</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="Enter if referred by someone"
            value={formData.affiliateCode}
            onChange={(e) => setFormData({...formData, affiliateCode: e.target.value})}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Register Now
        </button>
      </form>
    </div>
  );
}