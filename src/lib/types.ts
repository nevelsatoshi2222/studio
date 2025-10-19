
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
  coin: string;
  amount: number;
  stakedAt: string;
  duration: number; // in months/days
  status: 'Staked' | 'Unstaking' | 'Unstaked';
};

export type LockDuration = {
  value: number;
  label: string;
};

export type TokenStage = {
  stage: number;
  supplyPercentage: number;
  status: 'Complete' | 'Active' | 'Locked';
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
    available: number;
    color: string;
    description?: string;
}

export type AdminAllocation = {
  name: string;
  value: number;
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
}
