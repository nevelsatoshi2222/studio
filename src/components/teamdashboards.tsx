'use client';
import { useState, useEffect } from 'react';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';

export default function TeamDashboard() {
  const [userData, setUserData] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [commissions, setCommissions] = useState([]);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const user = auth.currentUser;
    if (user) {
      // Get user data
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      setUserData(userDoc.data());

      // Get team members
      const teamQuery = query(
        collection(db, 'users'), 
        where('referredBy', '==', userDoc.data().affiliateCode)
      );
      const teamSnapshot = await getDocs(teamQuery);
      setTeamMembers(teamSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      // Get commissions
      const commQuery = query(
        collection(db, 'commissions'),
        where('toUserId', '==', user.uid)
      );
      const commSnapshot = await getDocs(commQuery);
      setCommissions(commSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }
  };

  if (!userData) return <div>Loading...</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Your Team & Commissions</h2>
      
      {/* Affiliate Code */}
      <div className="mb-6 p-4 bg-blue-50 rounded">
        <p className="font-semibold">Your Affiliate Code:</p>
        <p className="text-xl text-blue-600">{userData.affiliateCode}</p>
        <p className="text-sm text-gray-600">Share this code to build your team</p>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded text-center">
          <p className="text-2xl font-bold">{teamMembers.length}</p>
          <p className="text-sm">Direct Team</p>
        </div>
        <div className="bg-blue-50 p-4 rounded text-center">
          <p className="text-2xl font-bold">${userData.wallet?.pendingCommission || 0}</p>
          <p className="text-sm">Pending Commission</p>
        </div>
        <div className="bg-purple-50 p-4 rounded text-center">
          <p className="text-2xl font-bold">${userData.wallet?.balance || 0}</p>
          <p className="text-sm">Available Balance</p>
        </div>
      </div>

      {/* Team Members */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-3">Your Team Members</h3>
        {teamMembers.length === 0 ? (
          <p className="text-gray-500">No team members yet. Share your affiliate code!</p>
        ) : (
          <div className="space-y-2">
            {teamMembers.map(member => (
              <div key={member.id} className="flex justify-between p-3 bg-gray-50 rounded">
                <span>{member.email}</span>
                <span className="text-green-600">Level 1</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Commission History */}
      <div>
        <h3 className="text-xl font-semibold mb-3">Commission History</h3>
        {commissions.length === 0 ? (
          <p className="text-gray-500">No commissions yet</p>
        ) : (
          <div className="space-y-2">
            {commissions.map(commission => (
              <div key={commission.id} className="flex justify-between p-3 bg-yellow-50 rounded">
                <div>
                  <p>Level {commission.level} - {commission.type}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(commission.createdAt?.toDate()).toLocaleDateString()}
                  </p>
                </div>
                <span className="text-green-600 font-semibold">+${commission.amount}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}