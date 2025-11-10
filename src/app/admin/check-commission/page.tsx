'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUser, useFirestore } from '@/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

export default function CheckCommissions() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [firestoreData, setFirestoreData] = useState<any>(null);

  const checkFirestore = async () => {
    if (!user || !firestore) {
      console.log('❌ User or Firestore not available');
      return;
    }

    try {
      console.log('🔍 Checking Firestore data...');
      
      // Check if commissions collection exists and has data
      const commissionsSnapshot = await getDocs(collection(firestore, 'commissions'));
      const commissions = commissionsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Check user document
      const userDoc = await getDoc(doc(firestore, 'users', user.uid));
      const userData = userDoc.exists() ? userDoc.data() : null;

      setFirestoreData({
        commissionsCount: commissions.length,
        commissions: commissions,
        userData: userData,
        userId: user.uid
      });

      console.log('📊 Firestore Data:', {
        commissionsCount: commissions.length,
        commissions: commissions,
        userData: userData
      });

    } catch (error) {
      console.error('❌ Error checking Firestore:', error);
    }
  };

  useEffect(() => {
    checkFirestore();
  }, [user, firestore]);

  return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Firestore Commission Data Check</CardTitle>
            <CardDescription>
              Check if commission data exists in your Firestore database
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={checkFirestore} className="mb-4">
              Refresh Data
            </Button>

            {firestoreData && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Commissions Count</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{firestoreData.commissionsCount}</div>
                      <p className="text-xs text-muted-foreground">Total commission records</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Your User ID</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm font-mono break-all">{firestoreData.userId}</div>
                      <p className="text-xs text-muted-foreground">Current user</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Commissions List */}
                <Card>
                  <CardHeader>
                    <CardTitle>Commission Records</CardTitle>
                    <CardDescription>
                      All commission records in Firestore
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {firestoreData.commissions.length > 0 ? (
                      <div className="space-y-2">
                        {firestoreData.commissions.map((commission: any) => (
                          <div key={commission.id} className="p-3 border rounded-lg">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">Commission ID: {commission.id}</p>
                                <p className="text-sm text-muted-foreground">
                                  User: {commission.userId} | Level: {commission.level}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Amount: {commission.commissionAmount} {commission.currency}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className={`font-bold ${commission.commissionAmount > 0 ? 'text-green-600' : 'text-gray-600'}`}>
                                  {commission.commissionAmount} PGC
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  From: {commission.fromUserName}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>No commission records found in Firestore.</p>
                        <p className="text-sm">Commissions collection is empty.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* User Data */}
                <Card>
                  <CardHeader>
                    <CardTitle>Your User Data</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto">
                      {JSON.stringify(firestoreData.userData, null, 2)}
                    </pre>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
  );
}
