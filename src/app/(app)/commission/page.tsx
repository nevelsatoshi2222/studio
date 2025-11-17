
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
import { useTranslation } from '@/hooks/useTranslation';

interface CommissionSummary {
  totalCommission: number;
  levelSummary: Record<number, { total: number; count: number; membersCount: number; rate: number }>;
  recentCommissions: any[];
  allCommissions: any[];
}

export default function CommissionPage() {
  const { t } = useTranslation();
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
          <h1 className="font-headline text-3xl font-bold">{t('commission.title')}</h1>
          <p className="text-muted-foreground">
            {t('commission.description')}
          </p>
        </div>
        <Button 
          onClick={handleRefresh} 
          variant="outline" 
          disabled={refreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          {t('commission.refresh')}
        </Button>
      </div>

      {/* Commission Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <DollarSign className="h-4 w-4 text-green-500" />
              {t('commission.total_commission')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${commissionData?.totalCommission.toFixed(2) || '0.00'}
            </div>
            <p className="text-xs text-muted-foreground">{t('commission.lifetime_earnings')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-blue-500" />
              {t('commission.commission_sources')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {commissionData?.allCommissions.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">{t('commission.total_transactions')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-purple-500" />
              {t('commission.active_levels')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.keys(commissionData?.levelSummary || {}).length}
            </div>
            <p className="text-xs text-muted-foreground">{t('commission.earning_levels')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Zap className="h-4 w-4 text-orange-500" />
              {t('commission.team_members')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.values(commissionData?.levelSummary || {}).reduce((total, level) => total + (level.membersCount || 0), 0)}
            </div>
            <p className="text-xs text-muted-foreground">{t('commission.total_earning_members')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Level-wise Earnings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            {t('commission.earnings_by_level')}
          </CardTitle>
          <CardDescription>
            {t('commission.earnings_by_level_desc')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {Object.keys(commissionData?.levelSummary || {}).length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {Object.entries(commissionData?.levelSummary || {}).map(([level, data]) => (
                <div key={level} className="text-center p-4 border rounded-lg bg-gradient-to-br from-blue-50 to-purple-50">
                  <div className="font-semibold text-lg">Level {level}</div>
                  <div className="text-green-600 font-bold text-xl">${data.total.toFixed(2)}</div>
                  <div className="text-xs text-muted-foreground">
                    {data.membersCount || 0} {t('commission.members')}
                  </div>
                  <div className="text-xs text-blue-600 font-semibold mt-1">
                    {data.rate}% {t('commission.rate')}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Award className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>{t('commission.no_commission_yet')}</p>
              <p className="text-sm">{t('commission.no_commission_desc')}</p>
              <Button asChild className="mt-4">
                <Link href="/team">{t('commission.build_your_team')}</Link>
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
              {t('commission.recent_history')}
            </CardTitle>
            <CardDescription>{t('commission.recent_history_desc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {commissionData.recentCommissions.map((commission, index) => (
                <div key={index} className="flex justify-between items-center p-3 border rounded-lg bg-green-50">
                  <div>
                    <p className="font-medium">Level {commission.level} Commission</p>
                    <p className="text-sm text-gray-600">
                      {t('commission.from')}: {commission.fromUserName} • 
                      {commission.timestamp?.toDate 
                        ? new Date(commission.timestamp.toDate()).toLocaleDateString()
                        : commission.timestamp 
                        ? new Date(commission.timestamp).toLocaleDateString()
                        : t('commission.recent')
                      }
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">
                      +${commission.commissionAmount?.toFixed(2) || '0.00'}
                    </p>
                    <p className="text-xs text-gray-500">{t('commission.usdt_commission')}</p>
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
          <CardTitle>{t('commission.commission_structure')}</CardTitle>
          <CardDescription>{t('commission.commission_structure_desc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold text-green-600 mb-2">{t('commission.level_1_direct')}</h4>
                <p className="text-sm">{t('commission.purchase_rate_1')}</p>
                <p className="text-sm font-semibold">{t('commission.purchase_example_1')}</p>
                <Badge variant="secondary" className="mt-2">{t('commission.badge_direct')}</Badge>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold text-blue-600 mb-2">{t('commission.levels_2_5')}</h4>
                <p className="text-sm">{t('commission.purchase_rate_1')}</p>
                <p className="text-sm font-semibold">{t('commission.purchase_example_1')}</p>
                <Badge variant="secondary" className="mt-2">{t('commission.badge_2_5')}</Badge>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold text-purple-600 mb-2">{t('commission.levels_6_15')}</h4>
                <p className="text-sm">{t('commission.purchase_rate_2')}</p>
                <p className="text-sm font-semibold">{t('commission.purchase_example_2')}</p>
                <Badge variant="secondary" className="mt-2">{t('commission.badge_6_15')}</Badge>
              </div>
            </div>
            
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">{t('commission.calculation_example_title')}</h4>
              <p className="text-sm text-blue-700">
                {t('commission.calculation_example_desc')}
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button asChild variant="outline">
            <Link href="/affiliate-marketing">{t('commission.view_affiliate_rewards')}</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

function CommissionLoadingSkeleton() {
  const { t } = useTranslation();
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

    