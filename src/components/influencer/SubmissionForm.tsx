// components/influencer/SubmissionForm.tsx
'use client';
import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/config';
import { doc, getDoc } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Video, Calculator, Shield, AlertTriangle, CheckCircle, User, LogIn } from 'lucide-react';
import { InfluencerRewardCalculator } from '@/lib/influencerRewardCalculator';
import { FraudDetector } from '@/lib/fraudDetector';
import { InfluencerService } from '@/lib/firebase/influencerService';

export default function InfluencerSubmissionForm() {
  const [user, loading, error] = useAuthState(auth);
  const [userData, setUserData] = useState(null);
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

  // Load user data from Firestore when user is authenticated
  useEffect(() => {
    const loadUserData = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          }
        } catch (error) {
          console.error('Error loading user data:', error);
        }
      }
    };

    loadUserData();
  }, [user]);

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

    if (!userData) {
      alert('User data not loaded. Please try again.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Use actual user data from Firebase Auth and Firestore
      const currentUser = {
        uid: user.uid,
        displayName: user.displayName || userData.name || 'Influencer',
        email: user.email || '',
        walletAddress: userData.walletAddress || '' // Get from user's Firestore document
      };

      const submissionData = {
        userId: currentUser.uid,
        userName: currentUser.displayName,
        userEmail: currentUser.email,
        walletAddress: currentUser.walletAddress,
        ...formData,
        calculation,
        fraudAnalysis
      };

      // Submit to Firebase
      const result = await InfluencerService.submitInfluencerApplication(submissionData);
      
      if (result.success) {
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
      } else {
        alert(`❌ Submission failed: ${result.error}`);
      }
      
    } catch (error) {
      console.error('Submission error:', error);
      alert('❌ Error submitting. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show login prompt if user is not authenticated
  if (!user) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 p-4">
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
      </div>
    );
  }

  // Show loading while user data is being fetched
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 p-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">Loading user data...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4">
      {/* User Info Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="font-semibold">{user.displayName || userData?.name || 'Influencer'}</div>
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