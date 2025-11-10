'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DollarSign, TrendingUp, Users, Award, Calendar } from 'lucide-react';
import { useUser, useFirestore } from '@/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { useState, useEffect } from 'react';

export default function CommissionPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const [commissionData, setCommissionData] = useState({
    totalCommission: 0,
    commissions: [] as any[],
    isLoading: true
  });

  // Fetch commission data
  useEffect(() => {
    const fetchCommissionData = async () => {
      if (!user) return;
      
      try {
        let commissionsData = [];
        
        // Try both commission field formats
        try {
          const commQuery = query(collection(firestore, 'commissions'), where('userId', '==', user.uid));
          const commSnapshot = await getDocs(commQuery);
          commissionsData = commSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
          console.log('No commissions with userId field');
        }
        
        if (commissionsData.length === 0) {
          try {
            const oldCommQuery = query(collection(firestore, 'commissions'), where('toUserId', '==', user.uid));
            const oldCommSnapshot = await getDocs(oldCommQuery);
            commissionsData = oldCommSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          } catch (error) {
            console.log('No commissions with toUserId field');
          }
        }

        const totalCommission = commissionsData.reduce((sum, comm) => sum + (comm.amount || comm.commissionAmount || 0), 0);

        setCommissionData({
          totalCommission,
          commissions: commissionsData,
          isLoading: false
        });
      } catch (error) {
        console.error('Error fetching commissions:', error);
        setCommissionData(prev => ({ ...prev, isLoading: false }));
      }
    };

    if (user) {
      fetchCommissionData();
    }
  }, [user, firestore]);

  // Calculate level-wise earnings
  const levelEarnings: { [key: number]: { total: number; count: number } } = {};
  commissionData.commissions.forEach(commission => {
    const level = commission.level || 1;
    const amount = commission.amount || commission.commissionAmount || 0;
    
    if (!levelEarnings[level]) {
      levelEarnings[level] = { total: 0, count: 0 };
    }
    levelEarnings[level].total += amount;
    levelEarnings[level].count += 1;
  });

  const levelEarningsArray = Object.entries(levelEarnings)
    .map(([level, data]) => ({
      level: parseInt(level),
      earnings: data.total,
      count: data.count
    }))
    .sort((a, b) => a.level - b.level);

  // Calculate monthly earnings
  const monthlyEarnings: { [key: string]: number } = {};
  commissionData.commissions.forEach(commission => {
    const date = commission.timestamp?.toDate ? commission.timestamp.toDate() : new Date();
    const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    const amount = commission.amount || commission.commissionAmount || 0;
    
    if (!monthlyEarnings[monthYear]) {
      monthlyEarnings[monthYear] = 0;
    }
    monthlyEarnings[monthYear] += amount;
  });

  if (isUserLoading || commissionData.isLoading) {
    return (
      <div className="flex flex-col gap-8 p-6">
        <div>
          <h1 className="font-headline text-3xl font-bold">Commission Earnings</h1>
          <p className="text-muted-foreground">Loading your commission data...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Access Commission Dashboard</CardTitle>
            <CardDescription>Please log in to view your commission earnings.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 p-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">Commission Earnings</h1>
        <p className="text-muted-foreground">
          Track your real commission earnings from your team's purchases.
        </p>
      </div>

      {/* Commission Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${commissionData.totalCommission.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Lifetime commissions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {commissionData.commissions.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Total commission events
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Levels</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {levelEarningsArray.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Levels generating income
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Avg</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              ${Object.keys(monthlyEarnings).length > 0 
                ? (commissionData.totalCommission / Object.keys(monthlyEarnings).length).toFixed(2)
                : '0.00'
              }
            </div>
            <p className="text-xs text-muted-foreground">
              Average per month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Level-wise Earnings */}
      <Card>
        <CardHeader>
          <CardTitle>Earnings by Level</CardTitle>
          <CardDescription>
            Commission breakdown across different levels in your team
          </CardDescription>
        </CardHeader>
        <CardContent>
          {levelEarningsArray.length > 0 ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {levelEarningsArray.map((level) => (
                  <div key={level.level} className="text-center p-4 rounded-lg bg-gradient-to-br from-green-50 to-blue-50 border border-green-200">
                    <div className="font-semibold text-lg mb-2">Level {level.level}</div>
                    <div className="text-green-600 font-bold text-2xl">${level.earnings.toFixed(2)}</div>
                    <div className="text-xs text-gray-500 mt-1">{level.count} transactions</div>
                  </div>
                ))}
              </div>
              
              {/* Progress visualization */}
              <div className="mt-6">
                <h4 className="font-semibold mb-3">Commission Distribution Across Levels</h4>
                <div className="space-y-2">
                  {levelEarningsArray.map((level) => {
                    const percentage = commissionData.totalCommission > 0 
                      ? (level.earnings / commissionData.totalCommission) * 100 
                      : 0;
                    return (
                      <div key={level.level} className="flex items-center gap-4">
                        <div className="w-16 text-sm font-medium">Level {level.level}</div>
                        <Progress value={percentage} className="flex-1 h-3" />
                        <div className="w-20 text-right text-sm font-semibold">
                          {percentage.toFixed(1)}%
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <DollarSign className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold mb-2">No Commissions Yet</h3>
              <p className="text-muted-foreground mb-4">
                You haven't earned any commissions yet. Commissions will appear when your team members make purchases.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Commission History */}
      {commissionData.commissions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Commission History</CardTitle>
            <CardDescription>Latest commission transactions from your team</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {commissionData.commissions
                .sort((a, b) => {
                  const dateA = a.timestamp?.toDate ? a.timestamp.toDate() : new Date(a.createdAt?.toDate || 0);
                  const dateB = b.timestamp?.toDate ? b.timestamp.toDate() : new Date(b.createdAt?.toDate || 0);
                  return dateB - dateA;
                })
                .slice(0, 10)
                .map(commission => (
                  <div key={commission.id} className="flex justify-between items-center p-4 border rounded-lg bg-gradient-to-r from-yellow-50 to-green-50 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                        <Award className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">Level {commission.level || 1} Commission</p>
                        <p className="text-sm text-gray-600">
                          From: {commission.fromUserName || 'Team Member'} • 
                          {commission.timestamp?.toDate 
                            ? new Date(commission.timestamp.toDate()).toLocaleDateString()
                            : commission.createdAt?.toDate
                            ? new Date(commission.createdAt.toDate()).toLocaleDateString()
                            : 'Recent'
                          }
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-green-600">
                        +${(commission.amount || commission.commissionAmount || 0).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">Commission</p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Commission Structure Info */}
      <Card>
        <CardHeader>
          <CardTitle>Commission Structure</CardTitle>
          <CardDescription>How your commission earnings are calculated</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-4 rounded-lg border bg-blue-50">
              <h4 className="font-semibold text-blue-800 mb-3">Commission Rates</h4>
              <ul className="text-sm text-blue-700 space-y-2">
                <li className="flex justify-between">
                  <span>Levels 1-5:</span>
                  <span className="font-semibold">0.2% each</span>
                </li>
                <li className="flex justify-between">
                  <span>Levels 6-15:</span>
                  <span className="font-semibold">0.1% each</span>
                </li>
                <li className="flex justify-between border-t pt-2">
                  <span className="font-semibold">Total Pool:</span>
                  <span className="font-semibold">2% distributed</span>
                </li>
              </ul>
            </div>
            <div className="p-4 rounded-lg border bg-green-50">
              <h4 className="font-semibold text-green-800 mb-3">How It Works</h4>
              <ul className="text-sm text-green-700 space-y-2">
                <li>• Commissions are earned when team members make purchases</li>
                <li>• Earnings are calculated based on your level in the referral chain</li>
                <li>• Real-time updates when new commissions are generated</li>
                <li>• Track performance across different levels of your team</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}