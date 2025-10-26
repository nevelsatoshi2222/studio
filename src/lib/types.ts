

import { LucideIcon } from 'lucide-react';

export type Transaction = {
  hash: string;
  block: number;
  from: string;
  to: string;
  value: number;
  age: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  country: string;
  balance: number;
  status: 'Active' | 'Inactive' | 'Banned';
  registeredAt: string;
  avatarId: string;
};

export type ForumPost = {
  id: number;
  title: string;
  author: string;
  authorAvatar: string;
  topic: 'Technology' | 'Economy' | 'Environment' | 'Social';
  geography: 'Global' | 'National' | 'Local';
  upvotes: number;
  comments: number;
};

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
  unit: 'day' | 'month' | 'year';
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

export type TeamMember = {
  id: string;
  name: string;
  avatarId: string;
  level: number;
  joinDate: string;
  earnings: number;
};

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

export type IndiaGeography = {
    name: string; // State name
    districts: {
        name: string; // District name
        talukas: {
            name: string; // Taluka name
            villages: string[]; // Array of village names
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
  action: string;
  reward: string;
  valueAt?: string;
};

export type PgcPotAllocation = {
  name: string;
  allocation: string;
  coinsB: number;
  valueT: string;
  use: string;
  color: string;
};
