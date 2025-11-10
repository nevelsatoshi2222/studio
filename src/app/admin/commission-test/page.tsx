'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Coins, Users, TrendingUp, Calculator, Play } from 'lucide-react';
import { useUser, useFirestore } from '@/firebase';
import { CommissionCalculator } from '@/lib/commission-calculator';

export default function CommissionTestPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [purchaseAmount, setPurchaseAmount] = useState('1000');
  const [isTesting, setIsTesting] = useState(false);
  const [commissionData, setCommissionData] = useState<any>(null);
  const [teamStats, setTeamStats] = useState({
    totalMembers: 0,
    paidMembers: 0,
    levels: {} as Record<number, number>
  });

  useEffect(() => {
    if (user && firestore) {
      loadTeamData();
    }
  }, [user, firestore]);

  const loadTeamData = async () => {
    if (!user) return;
    
    try {
      const teamStructure = await CommissionCalculator.getUserTeamStructure(user.uid);
      setTeamStats({
        totalMembers: teamStructure.stats.totalMembers,
        paidMembers: teamStructure.stats.paidMembers,
        levels: teamStructure.stats.levelCounts
      });
    } catch (error) {
      console.error('Error loading team data:', error);
    }
  };

  const simulatePurchase = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please login to test commissions"
      });
      return;
    }

    if (!purchaseAmount || parseFloat(purchaseAmount) <= 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a valid purchase amount"
      });
      return;
    }

    setIsTesting(true);
    
    try {
      const amount = parseFloat(purchaseAmount);
      const result = await CommissionCalculator.simulatePurchase(user.uid, amount);
      
      if (result.success) {
        toast({
          title: "Purchase Simulated!",
          description: `Commissions distributed for ${amount} PGC purchase`
        });
        
        // Reload commission data
        const commissionSummary = await CommissionCalculator.getUserCommissionSummary(user.uid);
        setCommissionData(commissionSummary);
        await loadTeamData();
      } else {
        toast({
          variant: "destructive",
          title: "Simulation Failed",
          description: result.message
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to simulate purchase"
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
      <div className="flex flex-col gap-8 max-w-4xl mx-auto">
        <div>
          <h1 className="font-headline text-3xl font-bold">Commission System Test</h1>
          <p className="text-muted-foreground">
            Test the real commission distribution system
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-blue-500" />
                Total Team
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{teamStats.totalMembers}</div>
              <p className="text-xs text-muted-foreground">Across all levels</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <TrendingUp className="h-4 w-4 text-green-500" />
                Paid Members
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{teamStats.paidMembers}</div>
              <p className="text-xs text-muted-foreground">Can generate commissions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Coins className="h-4 w-4 text-yellow-500" />
                Active Levels
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Object.keys(teamStats.levels).length}</div>
              <p className="text-xs text-muted-foreground">With team members</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Simulate Purchase</CardTitle>
            <CardDescription>
              Test commission distribution by simulating a team member purchase
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="purchaseAmount">Purchase Amount (PGC)</Label>
              <Input
                id="purchaseAmount"
                type="number"
                placeholder="1000"
                value={purchaseAmount}
                onChange={(e) => setPurchaseAmount(e.target.value)}
              />
            </div>

            <Button 
              onClick={simulatePurchase} 
              disabled={isTesting || !user}
              className="w-full"
              size="lg"
            >
              {isTesting ? (
                <>
                  <Calculator className="mr-2 h-4 w-4 animate-spin" />
                  Distributing Commissions...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Simulate Purchase & Distribute Commissions
                </>
              )}
            </Button>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">How it works:</h4>
              <p className="text-sm text-blue-700">
                When you simulate a purchase, the system will calculate and distribute commissions 
                to your upline through 15 levels (0.2% for levels 1-5, 0.1% for levels 6-15).
                Check your dashboard to see the real commission earnings.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Commission Results */}
        {commissionData && (
          <Card>
            <CardHeader>
              <CardTitle>Commission Distribution Results</CardTitle>
              <CardDescription>
                Results from the latest commission distribution test
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 rounded-lg bg-green-50 border border-green-200">
                    <div className="text-2xl font-bold text-green-600">
                      {commissionData.totalCommission.toFixed(2)} PGC
                    </div>
                    <div className="text-sm text-green-800">Total Commission Earned</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-blue-50 border border-blue-200">
                    <div className="text-2xl font-bold text-blue-600">
                      {Object.keys(commissionData.levelSummary).length}
                    </div>
                    <div className="text-sm text-blue-800">Active Levels</div>
                  </div>
                </div>

                {Object.keys(commissionData.levelSummary).length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3">Commission by Level:</h4>
                    <div className="grid gap-2">
                      {Object.entries(commissionData.levelSummary)
                        .sort(([a], [b]) => parseInt(a) - parseInt(b))
                        .map(([level, data]: [string, any]) => (
                          <div key={level} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <Badge variant="outline">Level {level}</Badge>
                              <span className="text-sm text-muted-foreground">
                                {data.membersCount} members • {data.rate}% rate
                              </span>
                            </div>
                            <span className="font-semibold text-green-600">
                              {data.total.toFixed(2)} PGC
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
  );
}
