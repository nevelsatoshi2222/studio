// app/influencer-rewards/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/config';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import AppLayout from '@/components/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Coins, Users, Video, TrendingUp, Calculator, Shield, AlertTriangle, CheckCircle, User, LogIn } from 'lucide-react';

// Simple reward calculator (no external dependencies)
const InfluencerRewardCalculator = {
  BASE_REWARDS: { long: 15, overview: 12, short: 8 },
  MINIMUM_REQUIREMENTS: { 
    long: { views: 10000, watchTime: 40 }, 
    overview: { views: 15000, watchTime: 50 }, 
    short: { views: 50000, watchTime: 70 } 
  },
  
  calculateReward(submissionData) {
    const requirements = this.MINIMUM_REQUIREMENTS[submissionData.videoType];
    if (!requirements) return { eligible: false, reason: 'Invalid video type' };
    if (submissionData.viewCount < requirements.views) return { eligible: false, reason: 'Minimum views not met' };
    if (submissionData.watchTimePercentage < requirements.watchTime) return { eligible: false, reason: 'Minimum watch time not met' };

    const baseReward = this.BASE_REWARDS[submissionData.videoType];
    const watchTimeBonus = this.calculateWatchTimeBonus(submissionData.videoType, submissionData.watchTimePercentage);
    const engagementBonus = this.calculateEngagementBonus(submissionData.engagementRate);
    const conversionBonus = this.calculateConversionBonus(submissionData.signUpsDriven);
    const qualityBonus = 2; // Default B grade
    const viralBonus = this.calculateViralBonus(submissionData.viewCount);

    const totalReward = baseReward + watchTimeBonus + engagementBonus + conversionBonus + qualityBonus + viralBonus;

    return {
      eligible: true,
      baseReward, 
      watchTimeBonus, 
      engagementBonus, 
      conversionBonus, 
      qualityBonus, 
      viralBonus, 
      totalReward,
      breakdown: {
        baseReward: { amount: baseReward, description: 'Base reward for video type' },
        watchTimeBonus: { amount: watchTimeBonus, description: 'Watch time performance bonus' },
        engagementBonus: { amount: engagementBonus, description: 'Engagement rate bonus' },
        conversionBonus: { amount: conversionBonus, description: 'Sign-ups driven bonus' },
        qualityBonus: { amount: qualityBonus, description: 'Content quality bonus' },
        viralBonus: { amount: viralBonus, description: 'Viral impact bonus' }
      }
    };
  },

  calculateWatchTimeBonus(videoType, watchTimePercentage) {
    const thresholds = {
      long: [ 
        {min:40,max:49,bonus:0}, 
        {min:50,max:59,bonus:3}, 
        {min:60,max:69,bonus:6}, 
        {min:70,max:79,bonus:9}, 
        {min:80,max:100,bonus:12} 
      ],
      overview: [ 
        {min:50,max:59,bonus:0}, 
        {min:60,max:69,bonus:2.5}, 
        {min:70,max:79,bonus:5}, 
        {min:80,max:89,bonus:7.5}, 
        {min:90,max:100,bonus:10} 
      ],
      short: [ 
        {min:70,max:79,bonus:0}, 
        {min:80,max:84,bonus:1.5}, 
        {min:85,max:89,bonus:3}, 
        {min:90,max:94,bonus:4.5}, 
        {min:95,max:100,bonus:6} 
      ]
    };
    const bracket = thresholds[videoType]?.find(t => watchTimePercentage >= t.min && watchTimePercentage <= t.max);
    return bracket ? bracket.bonus : 0;
  },

  calculateEngagementBonus(engagementRate) {
    if (engagementRate >= 9) return 6;
    if (engagementRate >= 6) return 4;
    if (engagementRate >= 3) return 2;
    return 0;
  },

  calculateConversionBonus(signUps) {
    if (signUps >= 200) return 40;
    if (signUps >= 100) return 20;
    if (signUps >= 50) return 10;
    if (signUps >= 25) return 5;
    if (signUps >= 10) return 2;
    return 0;
  },

  calculateViralBonus(viewCount) {
    if (viewCount >= 1000000) return 150;
    if (viewCount >= 500000) return 75;
    if (viewCount >= 100000) return 25;
    return 0;
  }
};

// Simple fraud detector
const FraudDetector = {
  analyzeSubmission(submissionData) {
    const redFlags = [];
    let fraudScore = 0;

    if (submissionData.viewCount > 50000 && submissionData.watchTimePercentage < 30) {
      redFlags.push('High views with low watch time');
      fraudScore += 25;
    }

    if (submissionData.engagementRate > 20) {
      redFlags.push('Suspicious engagement patterns');
      fraudScore += 20;
    }

    return {
      fraudScore: Math.min(fraudScore, 100),
      redFlags,
      riskLevel: fraudScore >= 70 ? 'HIGH' : fraudScore >= 40 ? 'MEDIUM' : fraudScore >= 20 ? 'LOW' : 'MINIMAL',
      recommendedAction: fraudScore >= 70 ? 'AUTO_REJECT' : fraudScore >= 40 ? 'MANUAL_REVIEW' : fraudScore >= 20 ? 'COMMUNITY_VOTE' : 'AUTO_APPROVE'
    };
  }
};

// Main Form Component
function InfluencerSubmissionForm() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    videoUrl: '', 
    videoType: '', 
    videoTitle: '', 
    videoDuration: '', 
    platform: '',
    viewCount: '', 
    watchTimePercentage: '', 
    engagementRate: '', 
    signUpsDriven: '', 
    referralCode: 'PGCINFLUENCER'
  });
  const [calculation, setCalculation] = useState(null);
  const [fraudAnalysis, setFraudAnalysis] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check authentication status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        try {
          // Load user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          }
        } catch (error) {
          console.error('Error loading user data:', error);
        }
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleCalculate = async () => {
    const submissionData = {
      videoType: formData.videoType,
      viewCount: parseInt(formData.viewCount) || 0,
      watchTimePercentage: parseInt(formData.watchTimePercentage) || 0,
      engagementRate: parseFloat(formData.engagementRate) || 0,
      signUpsDriven: parseInt(formData.signUpsDriven) || 0,
      qualityScore: 'B',
      videoDuration: parseInt(formData.videoDuration) || 0
    };

    const rewardCalculation = InfluencerRewardCalculator.calculateReward(submissionData);
    setCalculation(rewardCalculation);
    const fraudResult = FraudDetector.analyzeSubmission(submissionData);
    setFraudAnalysis(fraudResult);
  };

  const handleSubmit = async () => {
    if (!user) { 
      alert('Please log in to submit your application.'); 
      return; 
    }

    setIsSubmitting(true);
    try {
      const currentUser = {
        uid: user.uid,
        displayName: user.displayName || userData?.name || 'Influencer',
        email: user.email || '',
        walletAddress: userData?.walletAddress || ''
      };

      // For now, just show success message
      alert('🎉 Submission received! We will review your application within 7 days.');
      
      // Reset form
      setFormData({ 
        videoUrl: '', 
        videoType: '', 
        videoTitle: '', 
        videoDuration: '', 
        platform: '',
        viewCount: '', 
        watchTimePercentage: '', 
        engagementRate: '', 
        signUpsDriven: '', 
        referralCode: 'PGCINFLUENCER' 
      });
      setCalculation(null);
      setFraudAnalysis(null);
    } catch (error) {
      alert('❌ Error submitting. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show login prompt if user is not authenticated
  if (!user && !loading) {
    return (
      <Card>
        <CardHeader className="text-center">
          <LogIn className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <CardTitle>Login Required</CardTitle>
          <CardDescription>
            Please log in to submit your influencer application and earn PGC rewards.
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-center">
          <Button asChild size="lg">
            <a href="/login">Log In to Continue</a>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Show loading while checking authentication
  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* User Info Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="font-semibold">
                {user.displayName || userData?.name || 'Influencer'}
              </div>
              <div className="text-sm text-gray-500">{user.email}</div>
              {userData?.walletAddress && (
                <div className="text-xs text-gray-400">
                  Wallet: {userData.walletAddress.substring(0, 8)}...{userData.walletAddress.substring(userData.walletAddress.length - 6)}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-6 w-6" />
            Submit Your Content for PGC Rewards
          </CardTitle>
          <CardDescription>
            Complete the form below to get your video verified and earn PGC tokens
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Video URL */}
          <div className="space-y-4">
            <Label htmlFor="videoUrl">Video URL *</Label>
            <Input
              id="videoUrl"
              placeholder="https://youtube.com/watch?v=..."
              value={formData.videoUrl}
              onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
            />
          </div>

          {/* Platform & Video Type */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Label htmlFor="platform">Platform *</Label>
              <Select onValueChange={(value) => setFormData({...formData, platform: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <Label htmlFor="videoType">Video Type *</Label>
              <Select onValueChange={(value) => setFormData({...formData, videoType: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select video type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="long">Long Form (5+ minutes) - 10,000+ views</SelectItem>
                  <SelectItem value="overview">Overview (2-5 minutes) - 15,000+ views</SelectItem>
                  <SelectItem value="short">Short Form (15-60 seconds) - 50,000+ views</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Video Details */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Label htmlFor="videoDuration">Video Duration (seconds) *</Label>
              <Input
                id="videoDuration"
                type="number"
                placeholder="300"
                value={formData.videoDuration}
                onChange={(e) => setFormData({...formData, videoDuration: e.target.value})}
              />
            </div>

            <div className="space-y-4">
              <Label htmlFor="viewCount">View Count *</Label>
              <Input
                id="viewCount"
                type="number"
                placeholder="10000"
                value={formData.viewCount}
                onChange={(e) => setFormData({...formData, viewCount: e.target.value})}
              />
            </div>
          </div>

          {/* Analytics */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <Label htmlFor="watchTimePercentage">Watch Time Percentage *</Label>
              <Input
                id="watchTimePercentage"
                type="number"
                placeholder="60"
                value={formData.watchTimePercentage}
                onChange={(e) => setFormData({...formData, watchTimePercentage: e.target.value})}
              />
            </div>

            <div className="space-y-4">
              <Label htmlFor="engagementRate">Engagement Rate (%)</Label>
              <Input
                id="engagementRate"
                type="number"
                step="0.1"
                placeholder="5.0"
                value={formData.engagementRate}
                onChange={(e) => setFormData({...formData, engagementRate: e.target.value})}
              />
            </div>

            <div className="space-y-4">
              <Label htmlFor="signUpsDriven">Sign-ups Driven</Label>
              <Input
                id="signUpsDriven"
                type="number"
                placeholder="25"
                value={formData.signUpsDriven}
                onChange={(e) => setFormData({...formData, signUpsDriven: e.target.value})}
              />
            </div>
          </div>

          {/* Referral Code */}
          <div className="space-y-4">
            <Label htmlFor="referralCode">Your Referral Code</Label>
            <Input
              id="referralCode"
              value={formData.referralCode}
              onChange={(e) => setFormData({...formData, referralCode: e.target.value})}
            />
            <p className="text-sm text-gray-500">
              Use this code in your video description to track sign-ups
            </p>
          </div>

          <Button onClick={handleCalculate} className="w-full" size="lg">
            <Calculator className="h-4 w-4 mr-2" />
            Calculate Potential Reward
          </Button>
        </CardContent>
      </Card>

      {/* Results Display */}
      {calculation && (
        <Card>
          <CardHeader>
            <CardTitle>Reward Calculation</CardTitle>
          </CardHeader>
          <CardContent>
            <RewardBreakdown calculation={calculation} />
          </CardContent>
        </Card>
      )}

      {/* Fraud Analysis */}
      {fraudAnalysis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-6 w-6" />
              Security Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FraudAnalysisDisplay analysis={fraudAnalysis} />
          </CardContent>
        </Card>
      )}

      {/* Submit Button */}
      {calculation?.eligible && fraudAnalysis?.riskLevel !== 'HIGH' && (
        <Card>
          <CardFooter>
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting}
              className="w-full"
              size="lg"
            >
              {isSubmitting ? 'Submitting...' : 'Submit for Verification'}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}

// Helper Components
function RewardBreakdown({ calculation }) {
  if (!calculation.eligible) {
    return (
      <div className="text-center text-red-600">
        <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
        <p>This submission does not meet minimum requirements.</p>
        <p className="text-sm">{calculation.reason}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="text-3xl font-bold text-green-600">
          {calculation.totalReward} PGC
        </div>
        <p className="text-gray-500">Total Estimated Reward</p>
      </div>

      <div className="grid gap-3">
        {Object.entries(calculation.breakdown).map(([key, value]) => (
          <div key={key} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium capitalize">
                {key.replace(/([A-Z])/g, ' $1').replace('Bonus', ' Bonus')}
              </div>
              <div className="text-sm text-gray-500">{value.description}</div>
            </div>
            <div className="text-lg font-semibold">+{value.amount} PGC</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FraudAnalysisDisplay({ analysis }) {
  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'HIGH': return 'bg-red-100 text-red-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'LOW': return 'bg-blue-100 text-blue-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span>Risk Level:</span>
        <Badge className={getRiskColor(analysis.riskLevel)}>
          {analysis.riskLevel}
        </Badge>
      </div>

      <div className="flex justify-between items-center">
        <span>Fraud Score:</span>
        <span className="font-semibold">{analysis.fraudScore}/100</span>
      </div>

      <Progress value={analysis.fraudScore} className="w-full" />

      {analysis.redFlags.length > 0 && (
        <div>
          <div className="font-medium mb-2">Red Flags:</div>
          <ul className="list-disc list-inside space-y-1 text-sm text-red-600">
            {analysis.redFlags.map((flag, index) => (
              <li key={index}>{flag}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="text-sm text-gray-500">
        Recommended: {analysis.recommendedAction.replace('_', ' ')}
      </div>
    </div>
  );
}

// Main Page Component
export default function InfluencerRewardsPage() {
  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold">PGC Influencer Rewards Program</h1>
          <p className="text-xl text-gray-600 mt-4">
            Create content about Public Governance Coin and earn PGC tokens for your impact
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Coins className="h-8 w-8 text-yellow-500" />
                <div>
                  <div className="text-2xl font-bold">50,000+</div>
                  <div className="text-gray-500">PGC Rewarded</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-blue-500" />
                <div>
                  <div className="text-2xl font-bold">500+</div>
                  <div className="text-gray-500">Influencers</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Video className="h-8 w-8 text-green-500" />
                <div>
                  <div className="text-2xl font-bold">1,200+</div>
                  <div className="text-gray-500">Videos</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-purple-500" />
                <div>
                  <div className="text-2xl font-bold">25,000+</div>
                  <div className="text-gray-500">Sign-ups Driven</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <Card>
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
            <CardDescription>
              Simple 3-step process to earn PGC tokens
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <h3 className="font-semibold mb-2">Create Content</h3>
                <p className="text-gray-600">Make videos about PGC on YouTube, TikTok, or Instagram</p>
              </div>

              <div className="text-center">
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 font-bold">2</span>
                </div>
                <h3 className="font-semibold mb-2">Submit Analytics</h3>
                <p className="text-gray-600">Fill out the form with your video performance data</p>
              </div>

              <div className="text-center">
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-purple-600 font-bold">3</span>
                </div>
                <h3 className="font-semibold mb-2">Get Rewarded</h3>
                <p className="text-gray-600">Receive PGC tokens based on your impact and quality</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reward Tiers */}
        <Card>
          <CardHeader>
            <CardTitle>Reward Tiers</CardTitle>
            <CardDescription>
              Earn more based on your content quality and impact
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 border rounded-lg">
                <h3 className="font-bold text-lg mb-2">Long Form</h3>
                <div className="text-2xl font-bold text-blue-600 mb-2">15 PGC Base</div>
                <p className="text-sm text-gray-600 mb-4">5+ minute videos</p>
                <ul className="text-sm text-left space-y-1">
                  <li>✓ 10,000+ views required</li>
                  <li>✓ 40%+ watch time</li>
                  <li>✓ Up to 12 PGC watch bonus</li>
                </ul>
              </div>

              <div className="text-center p-6 border rounded-lg">
                <h3 className="font-bold text-lg mb-2">Overview</h3>
                <div className="text-2xl font-bold text-green-600 mb-2">12 PGC Base</div>
                <p className="text-sm text-gray-600 mb-4">2-5 minute videos</p>
                <ul className="text-sm text-left space-y-1">
                  <li>✓ 15,000+ views required</li>
                  <li>✓ 50%+ watch time</li>
                  <li>✓ Up to 10 PGC watch bonus</li>
                </ul>
              </div>

              <div className="text-center p-6 border rounded-lg">
                <h3 className="font-bold text-lg mb-2">Short Form</h3>
                <div className="text-2xl font-bold text-purple-600 mb-2">8 PGC Base</div>
                <p className="text-sm text-gray-600 mb-4">15-60 second videos</p>
                <ul className="text-sm text-left space-y-1">
                  <li>✓ 50,000+ views required</li>
                  <li>✓ 70%+ watch time</li>
                  <li>✓ Up to 6 PGC watch bonus</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submission Form */}
        <InfluencerSubmissionForm />
      </div>
    </AppLayout>
  );
}