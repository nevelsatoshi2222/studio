// lib/rewardConfig.ts - UNIFIED REWARD SYSTEM
export const REWARD_TIERS = {
    BRONZE_STAR: { level: 'Bronze Star', pgc: 1, requirement: '5 direct paid users', color: 'bg-amber-500', icon: '⭐', users: 5 },
    SILVER: { level: 'Silver', pgc: 2.5, requirement: '5 Bronze Star in team', color: 'bg-gray-400', icon: '🔹', users: 25 },
    GOLD: { level: 'Gold', pgc: 10, requirement: '5 Silver in team', color: 'bg-yellow-500', icon: '🔶', users: 125 },
    EMERALD: { level: 'Emerald', pgc: 20, requirement: '5 Gold in team', color: 'bg-emerald-500', icon: '💚', users: 625 },
    PLATINUM: { level: 'Platinum', pgc: 50, requirement: '5 Emerald in team', color: 'bg-blue-400', icon: '🔷', users: 3125 },
    DIAMOND: { level: 'Diamond', pgc: 250, requirement: '5 Platinum in team', color: 'bg-cyan-400', icon: '💎', users: 15625 },
    CROWN: { level: 'Crown', pgc: 1000, requirement: '5 Diamond in team', color: 'bg-purple-500', icon: '👑', users: 78125 }
  };
  
  export const QUIZ_REWARDS = {
    PERFECT_SCORE: 5,
    EXCELLENT_SCORE: 3,
    GOOD_SCORE: 2,
    BASIC_SCORE: 1
  };
  
  export const INFLUENCER_TIERS = {
    TIER1: { followers: 10000, reward: 25, name: 'Starter' },
    TIER2: { followers: 50000, reward: 50, name: 'Creator' },
    TIER3: { followers: 100000, reward: 100, name: 'Influencer' },
    TIER4: { followers: 250000, reward: 250, name: 'Star' },
    TIER5: { followers: 1000000, reward: 500, name: 'Elite' }
  };
  
  export const AFFILIATE_COMMISSION = {
    DIRECT_SIGNUP: 5, // PGC per paid user
    TEAM_BONUS: 0.1 // 10% of team members' earnings
  };
