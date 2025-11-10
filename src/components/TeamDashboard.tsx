'use client';
import { useState, useEffect } from 'react';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { useUser, useFirestore } from '@/firebase';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Users, Wallet, Target, CheckCircle, Award, Star } from 'lucide-react';

export default function TeamDashboard() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [userData, setUserData] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [commissions, setCommissions] = useState([]);
  const [activeTab, setActiveTab] = useState('team');

  useEffect(() => {
    if (user && firestore) {
      fetchUserData();
    }
  }, [user, firestore]);

  const fetchUserData = async () => {
    if (!user || !firestore) return;

    try {
      // Get user data
      const userDoc = await getDoc(doc(firestore, 'users', user.uid));
      const userData = userDoc.data();
      setUserData(userData);

      if (userData?.affiliateCode) {
        // Get team members
        const teamQuery = query(
          collection(firestore, 'users'), 
          where('referredBy', '==', userData.affiliateCode)
        );
        const teamSnapshot = await getDocs(teamQuery);
        setTeamMembers(teamSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        // Get commissions
        const commQuery = query(
          collection(firestore, 'commissions'),
          where('userId', '==', user.uid)
        );
        const commSnapshot = await getDocs(commQuery);
        setCommissions(commSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  if (!userData) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading team dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <Badge variant="secondary" className="mb-2">
          <Users className="h-3 w-3 mr-1" />
          Team Dashboard
        </Badge>
        <h1 className="text-3xl font-bold">Your Team & Commissions</h1>
        <p className="text-muted-foreground mt-2">
          Manage your team and track your earnings
        </p>
      </div>

      {/* Quick Actions Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Quiz Card */}
        <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Trophy className="h-5 w-5 text-purple-600" />
                Team Quiz
              </CardTitle>
              <Badge variant="default" className="bg-purple-500">
                Exclusive
              </Badge>
            </div>
            <CardDescription>
              Test your financial knowledge and earn PGC rewards
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full" size="sm">
              <Link href="/quiz-opinion">
                <Trophy className="h-4 w-4 mr-2" />
                Take Quiz
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Team Stats Cards */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-blue-500" />
              Team Size
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamMembers.length}</div>
            <p className="text-xs text-muted-foreground">Direct Members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Wallet className="h-4 w-4 text-green-500" />
              Pending Commission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${userData.wallet?.pendingCommission || 0}</div>
            <p className="text-xs text-muted-foreground">Available Soon</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Award className="h-4 w-4 text-purple-500" />
              Total Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${userData.wallet?.balance || 0}</div>
            <p className="text-xs text-muted-foreground">Current Balance</p>
          </CardContent>
        </Card>
      </div>

      {/* Rest of your TeamDashboard content... */}
      {/* You can add the tabs and other sections from your previous TeamDashboard here */}
      
      {/* Quick Access Section */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Access</CardTitle>
          <CardDescription>
            Frequently used team resources
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button asChild variant="outline">
              <Link href="/quiz-opinion" className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                Take Financial Quiz
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/commission" className="flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                View Commission
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/team" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Team Members
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}