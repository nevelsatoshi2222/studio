// lib/influencerRewardCalculator.js - UPDATED VERSION
export class InfluencerRewardCalculator {
  
  static BASE_REWARDS = {
    long: 15,
    overview: 12, 
    short: 8
  };

  static MINIMUM_REQUIREMENTS = {
    long: { views: 10000, watchTime: 40 },
    overview: { views: 15000, watchTime: 50 },
    short: { views: 50000, watchTime: 70 }
  };

  // YOUR DIRECT OFFER TIERS
  static DIRECT_OFFER_TIERS = {
    'tier1': { minFollowers: 10000, baseOffer: 25, targetCount: 500 },      // 10K+ followers
    'tier2': { minFollowers: 50000, baseOffer: 50, targetCount: 200 },      // 50K+ followers  
    'tier3': { minFollowers: 100000, baseOffer: 100, targetCount: 100 },    // 100K+ followers
    'tier4': { minFollowers: 250000, baseOffer: 250, targetCount: 10 },     // 250K+ followers
    'tier5': { minFollowers: 1000000, baseOffer: 500, targetCount: 5 }      // 1M+ followers
  };

  // Approved influencers for direct offers
  static APPROVED_INFLUENCERS = {
    // Tier 1 Examples (10K+ followers)
    'crypto_beginner': { tier: 'tier1', name: 'Crypto Beginner', baseOffer: 25 },
    'tech_enthusiast': { tier: 'tier1', name: 'Tech Enthusiast', baseOffer: 25 },
    
    // Tier 2 Examples (50K+ followers)  
    'blockchain_explained': { tier: 'tier2', name: 'Blockchain Explained', baseOffer: 50 },
    'crypto_news_daily': { tier: 'tier2', name: 'Crypto News Daily', baseOffer: 50 },
    
    // Tier 3 Examples (100K+ followers)
    'web3_creator': { tier: 'tier3', name: 'Web3 Creator', baseOffer: 100 },
    'defi_analyst': { tier: 'tier3', name: 'DeFi Analyst', baseOffer: 100 },
    
    // Tier 4 Examples (250K+ followers)
    'crypto_influencer': { tier: 'tier4', name: 'Crypto Influencer', baseOffer: 250 },
    
    // Tier 5 Examples (1M+ followers)
    'viral_crypto': { tier: 'tier5', name: 'Viral Crypto', baseOffer: 500 }
  };

  static calculateReward(submissionData) {
    const {
      videoType,
      viewCount,
      watchTimePercentage,
      engagementRate,
      signUpsDriven,
      qualityScore,
      videoDuration,
      influencerId // For direct offers
    } = submissionData;

    // Step 1: Check minimum requirements
    if (!this.passesMinimumRequirements(submissionData)) {
      return { eligible: false, reason: 'Minimum requirements not met' };
    }

    // Step 2: Calculate base reward
    const baseReward = this.BASE_REWARDS[videoType];
    
    // Step 3: Calculate all bonuses
    const watchTimeBonus = this.calculateWatchTimeBonus(videoType, watchTimePercentage);
    const engagementBonus = this.calculateEngagementBonus(engagementRate);
    const conversionBonus = this.calculateConversionBonus(signUpsDriven);
    const qualityBonus = this.calculateQualityBonus(qualityScore);
    const viralBonus = this.calculateViralBonus(viewCount);

    // Step 4: Check for direct offer bonus
    const directOfferBonus = this.calculateDirectOfferBonus(influencerId, viewCount);

    // Step 5: Calculate total
    const totalReward = baseReward + watchTimeBonus + engagementBonus + 
                       conversionBonus + qualityBonus + viralBonus + directOfferBonus;

    return {
      eligible: true,
      baseReward,
      watchTimeBonus,
      engagementBonus, 
      conversionBonus,
      qualityBonus,
      viralBonus,
      directOfferBonus,
      totalReward,
      isDirectOffer: directOfferBonus > 0,
      breakdown: this.getBreakdown(
        baseReward, watchTimeBonus, engagementBonus, 
        conversionBonus, qualityBonus, viralBonus, directOfferBonus
      )
    };
  }

  // Calculate direct offer bonus
  static calculateDirectOfferBonus(influencerId, viewCount) {
    if (!influencerId) return 0;
    
    const influencer = this.APPROVED_INFLUENCERS[influencerId];
    if (!influencer) return 0;

    const tier = this.DIRECT_OFFER_TIERS[influencer.tier];
    if (!tier) return 0;

    // Check if views meet minimum for the tier
    const minViews = tier.minFollowers / 10; // Rough estimate: 10% of followers as min views
    if (viewCount >= minViews) {
      return influencer.baseOffer;
    }

    return 0;
  }

  // Rest of the methods remain the same...
  static passesMinimumRequirements(data) {
    const requirements = this.MINIMUM_REQUIREMENTS[data.videoType];
    if (data.viewCount < requirements.views) return false;
    if (data.watchTimePercentage < requirements.watchTime) return false;
    return true;
  }

  static calculateWatchTimeBonus(videoType, watchTimePercentage) {
    const thresholds = {
      long: [ {min:40,max:49,bonus:0}, {min:50,max:59,bonus:3}, {min:60,max:69,bonus:6}, {min:70,max:79,bonus:9}, {min:80,max:100,bonus:12} ],
      overview: [ {min:50,max:59,bonus:0}, {min:60,max:69,bonus:2.5}, {min:70,max:79,bonus:5}, {min:80,max:89,bonus:7.5}, {min:90,max:100,bonus:10} ],
      short: [ {min:70,max:79,bonus:0}, {min:80,max:84,bonus:1.5}, {min:85,max:89,bonus:3}, {min:90,max:94,bonus:4.5}, {min:95,max:100,bonus:6} ]
    };

    const bracket = thresholds[videoType].find(t => watchTimePercentage >= t.min && watchTimePercentage <= t.max);
    return bracket ? bracket.bonus : 0;
  }

  static calculateEngagementBonus(engagementRate) {
    if (engagementRate >= 9) return 6;
    if (engagementRate >= 6) return 4;
    if (engagementRate >= 3) return 2;
    return 0;
  }

  static calculateConversionBonus(signUps) {
    if (signUps >= 200) return 40;
    if (signUps >= 100) return 20;
    if (signUps >= 50) return 10;
    if (signUps >= 25) return 5;
    if (signUps >= 10) return 2;
    return 0;
  }

  static calculateQualityBonus(qualityScore) {
    const bonuses = { 'A+': 10, 'A': 5, 'B': 2, 'C': 0, 'D': 0 };
    return bonuses[qualityScore] || 0;
  }

  static calculateViralBonus(viewCount) {
    if (viewCount >= 1000000) return 150;
    if (viewCount >= 500000) return 75;
    if (viewCount >= 100000) return 25;
    return 0;
  }

  static getBreakdown(base, watchTime, engagement, conversion, quality, viral, directOffer = 0) {
    const breakdown = {
      baseReward: { amount: base, description: 'Base reward for video type' },
      watchTimeBonus: { amount: watchTime, description: 'Watch time performance bonus' },
      engagementBonus: { amount: engagement, description: 'Engagement rate bonus' },
      conversionBonus: { amount: conversion, description: 'Sign-ups driven bonus' },
      qualityBonus: { amount: quality, description: 'Content quality bonus' },
      viralBonus: { amount: viral, description: 'Viral impact bonus' }
    };

    if (directOffer > 0) {
      breakdown.directOfferBonus = { amount: directOffer, description: 'Special direct offer bonus' };
    }

    return breakdown;
  }

  // Method to add new influencers to direct offer program
  static addInfluencerToDirectOffer(influencerId, influencerData) {
    this.APPROVED_INFLUENCERS[influencerId] = influencerData;
  }

  // Method to get all direct offer influencers
  static getDirectOfferInfluencers() {
    return this.APPROVED_INFLUENCERS;
  }

  // Method to get tier statistics
  static getTierStatistics() {
    const stats = {};
    
    Object.entries(this.DIRECT_OFFER_TIERS).forEach(([tierId, tier]) => {
      const influencers = Object.values(this.APPROVED_INFLUENCERS).filter(
        inf => inf.tier === tierId
      );
      
      stats[tierId] = {
        ...tier,
        currentCount: influencers.length,
        remainingSpots: tier.targetCount - influencers.length,
        filledPercentage: Math.round((influencers.length / tier.targetCount) * 100)
      };
    });
    
    return stats;
  }
}