'use client';
import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUser } from '@/firebase';
import { CommissionCalculator } from '@/lib/commission-calculator';
import { DollarSign, Users, TrendingUp, Calendar, Zap, Target, Award, RefreshCw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

interface CommissionSummary {
  totalCommission: number;
  levelSummary: Record<number, { total: number; count: number; membersCount: number; rate: number }>;
  recentCommissions: any[];
  allCommissions: any[];
}

export default function CommissionPage() {
  const { user } = useUser();
  const [commissionData, setCommissionData] = useState<CommissionSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadCommissionData = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const data = await CommissionCalculator.getUserCommissionSummary(user.uid);
      setCommissionData(data);
    } catch (error) {
      console.error('Error loading commission data:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadCommissionData();
  }, [user]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadCommissionData();
  };

  if (isLoading) {
    return <CommissionLoadingSkeleton />;
  }

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Access Denied</CardTitle>
          <CardDescription>Please log in to view your commissions.</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button asChild>
            <Link href="/login">Login</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-headline text-3xl font-bold">Commission Earnings</h1>
          <p className="text-muted-foreground">
            Track your real USDT commissions from team purchases and activities
          </p>
        </div>
        <Button 
          onClick={handleRefresh} 
          variant="outline" 
          disabled={refreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Commission Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <DollarSign className="h-4 w-4 text-green-500" />
              Total Commission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${commissionData?.totalCommission.toFixed(2) || '0.00'}
            </div>
            <p className="text-xs text-muted-foreground">Lifetime earnings in USDT</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-blue-500" />
              Commission Sources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {commissionData?.allCommissions.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">Total transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-purple-500" />
              Active Levels
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.keys(commissionData?.levelSummary || {}).length}
            </div>
            <p className="text-xs text-muted-foreground">Earning levels</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Zap className="h-4 w-4 text-orange-500" />
              Team Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.values(commissionData?.levelSummary || {}).reduce((total, level) => total + (level.membersCount || 0), 0)}
            </div>
            <p className="text-xs text-muted-foreground">Total earning members</p>
          </CardContent>
        </Card>
      </div>

      {/* Level-wise Earnings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Earnings by Level
          </CardTitle>
          <CardDescription>
            See how much you earn from each level of your team network
          </CardDescription>
        </CardHeader>
        <CardContent>
          {Object.keys(commissionData?.levelSummary || {}).length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {Object.entries(commissionData?.levelSummary || {}).map(([level, data]) => (
                <div key={level} className="text-center p-4 border rounded-lg bg-gradient-to-br from-blue-50 to-purple-50">
                  <div className="font-semibold text-lg mb-1">Level {level}</div>
                  <div className="text-green-600 font-bold text-xl">${data.total.toFixed(2)}</div>
                  <div className="text-xs text-muted-foreground">
                    {data.membersCount || 0} members
                  </div>
                  <div className="text-xs text-blue-600 font-semibold mt-1">
                    {data.rate}% rate
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Award className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No commission earnings yet</p>
              <p className="text-sm">Earnings will appear when your team makes purchases</p>
              <Button asChild className="mt-4">
                <Link href="/team">Build Your Team</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Commissions */}
      {commissionData?.recentCommissions && commissionData.recentCommissions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Commission History
            </CardTitle>
            <CardDescription>Latest commission transactions from your team</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {commissionData.recentCommissions.map((commission, index) => (
                <div key={index} className="flex justify-between items-center p-3 border rounded-lg bg-green-50">
                  <div>
                    <p className="font-medium">Level {commission.level} Commission</p>
                    <p className="text-sm text-gray-600">
                      From: {commission.fromUserName} • 
                      {commission.timestamp?.toDate 
                        ? new Date(commission.timestamp.toDate()).toLocaleDateString()
                        : commission.timestamp 
                        ? new Date(commission.timestamp).toLocaleDateString()
                        : 'Recent'
                      }
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">
                      +${commission.commissionAmount?.toFixed(2) || '0.00'}
                    </p>
                    <p className="text-xs text-gray-500">USDT Commission</p>
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
          <div className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold text-green-600 mb-2">Level 1 (Direct)</h4>
                <p className="text-sm">0.2% of all purchases</p>
                <p className="text-sm font-semibold">$0.20 per $100</p>
                <Badge variant="secondary" className="mt-2">Direct Referrer</Badge>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold text-blue-600 mb-2">Levels 2-5</h4>
                <p className="text-sm">0.2% of all purchases</p>
                <p className="text-sm font-semibold">$0.20 per $100</p>
                <Badge variant="secondary" className="mt-2">Levels 2-5</Badge>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold text-purple-600 mb-2">Levels 6-15</h4>
                <p className="text-sm">0.1% of all purchases</p>
                <p className="text-sm font-semibold">$0.10 per $100</p>
                <Badge variant="secondary" className="mt-2">Levels 6-15</Badge>
              </div>
            </div>
            
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Commission Calculation Example</h4>
              <p className="text-sm text-blue-700">
                For a $100 paid registration: Level 1 earns $0.20, Levels 2-5 earn $0.20 each, 
                Levels 6-15 earn $0.10 each. Total distributed: ~$2.00 across all levels.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button asChild variant="outline">
            <Link href="/affiliate-marketing">View Affiliate Rewards</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

function CommissionLoadingSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-10 w-24" />
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-3">
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-24 mb-2" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}