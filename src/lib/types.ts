
import { LucideIcon } from 'lucide-react';

export type Transaction = {
  userId: string;
  type: "PURCHASE" | "COMMISSION" | "WITHDRAWAL" | "RANK_REWARD";
  amount: number;
  purchaseRef?: any; // DocumentReference
  level?: number;
  timestamp: any; // Timestamp
  rewardName?: string;
  usdtAmount?: number;
};

export type User = {
  uid: string;
  referredBy?: string;
  referralCode?: string;
  walletPublicKey?: string;
  pgcBalance: number;
  usdtBalance: number;
  isVerified: boolean;
  name: string;
  email: string;
  role: string;
  street: string;
  village: string;
  block?: string;
  taluka: string;
  district: string;
  state: string;
  country: string;
  registeredAt: any; // Timestamp
  avatarId: string;
  status: 'Active' | 'Pending' | 'Rejected' | 'Banned';
  jobTitle?: string;
  totalTeamSize?: number;
  paidTeamSize?: number;
  freeRank?: string;
  paidRank?: string;
  isPaid?: boolean;
};

export type Presale = {
    id: string;
    userId: string;
    amountUSDT: number;
    pgcCredited: number;
    status: 'COMPLETED' | 'PENDING_VERIFICATION';
}

export type TradingPair = {
  from: string;
  to: string;
};

export type Order = {
  price: number;
  amount: number;
};

export type Trade = {
  price: number;
  amount: number;
  time: string;
  type: 'buy' | 'sell';
};

export type StakedPosition = {
  id: string;
  asset: string;
  amount: number;
  startDate: string;
  endDate: string;
  durationMonths: number;
  status: 'Staked' | 'Unstaking' | 'Unstaked';
};

export type LockDuration = {
  value: number;
  unit: 'day' | 'month' | 'year' | 'stage';
  label: string;
};

export type TokenStage = {
  stage: number;
  supplyPercentage: number;
  status: 'Completed' | 'Active' | 'Locked';
  unfreezesIn: string;
};

export type QuizQuestion = {
  id: number;
  level: number;
  question: string;
  options: string[];
  correctAnswer: string;
  prize: number;
};

export type Cause = {
  id: number;
  title: string;
  description: string;
  icon: string;
  buttonText: string;
};

export type VotingPoll = {
  id: string;
  geography: string;
  category: 'Proposal' | 'Issue' | 'Election';
  title: string;
  description: string;
  results: {
    option: string;
    percentage: number;
    color: string;
  }[];
};

export type EcommCategory = {
    title: string;
    subItems: { title: string }[];
};

export type EcommProduct = {
    id: number;
    name: string;
    description: string;
    priceITC: number;
    priceUSD: number;
    imageId: string;
    category: string;
    subcategory: string;
};

export type SocialPost = {
  id: string;
  authorId: string;
  content: string;
  imageUrl?: string;
  imageHint?: string;
  timestamp: string;
  likes: number;
  comments: number;
  mentionsPgc?: boolean;
  mentionsIgc?: boolean;
}

export type CoinPackage = {
    name: string;
    coins: number;
    packagesAvailable: number;
    color: string;
}

export type AdminAllocation = {
  type: 'geographic' | 'voting' | 'fixed';
  category: string;
  percentage: number;
  description: string;
}

export type SportsAndArtsItem = {
  id: number;
  name: string;
  description: string;
}

export type CompetitionPhase = {
  phase: number;
  title: string;
  description: string;
}

export type SportsItem = {
  id: number;
  name: string;
  description: string;
  id_23?: number;
}

export type ArtItem = {
  id: number;
  name: string;
  description: string;
}

export type AirdropReward = {
  name: string;
  percentage: number;
  description: string;
};

export type IndiaIssuePoll = {
  id: string;
  title: string;
  description: string;
  solutions: {
    id: string;
    text: string;
    results: {
      level: string;
      percentage: number;
      color: string;
    }[];
  }[];
};

export type FundAllocation = {
  name: string;
  value: number;
  color: string;
  description?: string;
};

export type PgcSaleStage = {
  stage: number;
  percentOfTs: string;
  coinsSoldB: number;
  priceRange: string;
  bonusRatio: string;
  incomingFund: string;
  pdpReleasePercent: string;
  pdpFundReleased: string;
  status: string;
};

export type PgcPotAllocation = {
  name: string;
  allocation: number;
  coinsB: number;
  valueT?: string;
  use: string;
  color: string;
};

export type AffiliateRewardTier = {
    name: string;
    icon: LucideIcon;
    reward: string;
    limit: string;
    requirement: string;
    goal?: number;
};

export type SubmittedContent = {
  id: string;
  url: string;
  submittedAt: Date;
  status: 'Pending' | 'Approved' | 'Rejected';
  views?: number;
};
