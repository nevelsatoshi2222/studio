'use client';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore } from '@/firebase';
import { collection, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore';

export default function CreateTestCommissions() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);

  const createTestCommissions = async () => {
    if (!user || !firestore) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please login first"
      });
      return;
    }

    setIsCreating(true);

    try {
      // Create test commission records
      const testCommissions = [
        {
          userId: user.uid,
          fromUserId: 'test_user_1',
          fromUserName: 'Test User 1',
          purchaseAmount: 5000,
          currency: 'PGC',
          level: 1,
          commissionAmount: 10, // 5000 * 0.2%
          commissionRate: 0.2,
          timestamp: new Date(),
          status: 'completed'
        },
        {
          userId: user.uid,
          fromUserId: 'test_user_2', 
          fromUserName: 'Test User 2',
          purchaseAmount: 3000,
          currency: 'PGC',
          level: 2,
          commissionAmount: 6, // 3000 * 0.2%
          commissionRate: 0.2,
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          status: 'completed'
        },
        {
          userId: user.uid,
          fromUserId: 'test_user_3',
          fromUserName: 'Test User 3', 
          purchaseAmount: 8000,
          currency: 'PGC',
          level: 6,
          commissionAmount: 8, // 8000 * 0.1%
          commissionRate: 0.1,
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
          status: 'completed'
        }
      ];

      // Add test commissions to Firestore
      for (const commission of testCommissions) {
        await addDoc(collection(firestore, 'commissions'), commission);
      }

      // Update user's total commission
      const userDoc = await getDoc(doc(firestore, 'users', user.uid));
      if (userDoc.exists()) {
        const currentCommission = userDoc.data().totalCommission || 0;
        await updateDoc(doc(firestore, 'users', user.uid), {
          totalCommission: currentCommission + 24, // 10 + 6 + 8
          pgcBalance: (userDoc.data().pgcBalance || 0) + 24
        });
      }

      toast({
        title: "Test Commissions Created!",
        description: "3 test commission records added to your account. Check the Commission page."
      });

    } catch (error) {
      console.error('Error creating test commissions:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create test commissions"
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Create Test Commission Data</CardTitle>
            <CardDescription>
              This will create real commission records in your Firestore database so you can test the commission display
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={createTestCommissions} 
              disabled={isCreating || !user}
              className="w-full"
              size="lg"
            >
              {isCreating ? "Creating Test Data..." : "Create Test Commission Records"}
            </Button>
            
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h4 className="font-semibold text-yellow-800 mb-2">What this does:</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Creates 3 real commission records in Firestore</li>
                <li>• Adds 24 PGC to your total commission balance</li>
                <li>• Updates your PGC balance</li>
                <li>• Creates data for Level 1, 2, and 6 commissions</li>
              </ul>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">After creating test data:</h4>
              <p className="text-sm text-blue-700">
                Go to the <strong>Commission Earnings</strong> page to see your real commission data displayed.
                You should see actual earned amounts instead of just commission structure.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
  );
}
