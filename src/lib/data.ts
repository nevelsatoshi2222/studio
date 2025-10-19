
import {
  Transaction,
  User,
  ForumPost,
  TradingPair,
  Order,
  Trade,
  StakedPosition,
  LockDuration,
  TokenStage,
  QuizQuestion,
  Cause,
  VotingPoll,
  EcommCategory,
  EcommProduct,
  SocialPost,
  CoinPackage,
  AdminAllocation,
  SportsAndArtsItem,
  CompetitionPhase,
  SportsItem,
  ArtItem,
  TokenSupplyDistribution,
  TeamMember,
} from './types';
import { placeholderImages } from './placeholder-images.json';
import { CircleDollarSign, Users, Leaf, Brain, MessageSquare, Shield, Trophy, Briefcase, Building2, Palette, Handshake, Award, Scale, Settings, UserCog, Vote, Users2, Share2, Landmark, Globe } from 'lucide-react';


export const users: User[] = [
  {
    id: 'usr_admin',
    name: 'Admin',
    email: 'admin@ibc.com',
    country: 'United States',
    balance: 1_000_000_000,
    status: 'Active',
    registeredAt: '2023-01-15',
    avatarId: 'user-avatar-1',
  },
  {
    id: 'usr_002',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    country: 'Canada',
    balance: 10,
    status: 'Active',
    registeredAt: '2023-02-20',
    avatarId: 'user-avatar-2',
  },
  {
    id: 'usr_003',
    name: 'Bob Williams',
    email: 'bob@example.com',
    country: 'United Kingdom',
    balance: 10,
    status: 'Active',
    registeredAt: '2023-03-10',
    avatarId: 'user-avatar-3',
  },
  {
    id: 'usr_004',
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    country: 'Australia',
    balance: 10,
    status: 'Inactive',
    registeredAt: '2023-04-05',
    avatarId: 'user-avatar-4',
  },
    { id: 'usr_005', name: 'Diana Prince', email: 'diana@example.com', country: 'Brazil', balance: 10, status: 'Active', registeredAt: '2023-05-11', avatarId: 'user-avatar-1' },
    { id: 'usr_006', name: 'Ethan Hunt', email: 'ethan@example.com', country: 'Germany', balance: 10, status: 'Active', registeredAt: '2023-06-22', avatarId: 'user-avatar-2' },
    { id: 'usr_007', name: 'Fiona Glenanne', email: 'fiona@example.com', country: 'India', balance: 10, status: 'Banned', registeredAt: '2023-07-30', avatarId: 'user-avatar-3' },
    { id: 'usr_008', name: 'George Costanza', email: 'george@example.com', country: 'USA', balance: 10, status: 'Active', registeredAt: '2023-08-18', avatarId: 'user-avatar-4' },
    { id: 'usr_009', name: 'Hannah Montana', email: 'hannah@example.com', country: 'USA', balance: 10, status: 'Active', registeredAt: '2023-09-01', avatarId: 'user-avatar-1' },
    { id: 'usr_010', name: 'Iris West', email: 'iris@example.com', country: 'South Africa', balance: 10, status: 'Inactive', registeredAt: '2023-10-14', avatarId: 'user-avatar-2' },
    { id: 'usr_011', name: 'Jack Sparrow', email: 'jack@example.com', country: 'United Kingdom', balance: 10, status: 'Active', registeredAt: '2023-11-25', avatarId: 'user-avatar-3' }
];

export const transactions: Transaction[] = [
  {
    hash: '0xabcde12345...',
    block: 123456,
    from: '0xSenderAddress...',
    to: '0xReceiverAddress...',
    value: 100,
    age: '2 mins ago',
  },
  {
    hash: '0xfghij67890...',
    block: 123455,
    from: '0xAnotherSender...',
    to: '0x1a2B3c4d5E6f7A8b9C0d1E2f3A4b5C6d7E8f9A0B',
    value: 50,
    age: '5 mins ago',
  },
  {
    hash: '0xklmno13579...',
    block: 123454,
    from: '0x1a2B3c4d5E6f7A8b9C0d1E2f3A4b5C6d7E8f9A0B',
    to: '0xThirdAddress...',
    value: 25,
    age: '10 mins ago',
  },
  {
    hash: '0xpqrst24680...',
    block: 123453,
    from: '0xFourthAddress...',
    to: '0x1a2B3c4d5E6f7A8b9C0d1E2f3A4b5C6d7E8f9A0B',
    value: 75,
    age: '12 mins ago',
  },
];

export const forumPosts: ForumPost[] = [
  {
    id: 1,
    title: 'Proposal: Increase transaction speed',
    author: 'Admin',
    authorAvatar: 'user-avatar-1',
    topic: 'Technology',
    geography: 'Global',
    upvotes: 128,
    comments: 42,
  },
  {
    id: 2,
    title: 'Discussion: Environmental impact of blockchain',
    author: 'Alice Johnson',
    authorAvatar: 'user-avatar-2',
    topic: 'Environment',
    geography: 'National',
    upvotes: 75,
    comments: 18,
  },
  {
    id: 3,
    title: 'Project: Local marketplace integration',
    author: 'Bob Williams',
    authorAvatar: 'user-avatar-3',
    topic: 'Economy',
    geography: 'Local',
    upvotes: 210,
    comments: 65,
  },
];

export const tradingPairs: TradingPair[] = [
  { from: 'ITC', to: 'USDT' },
  { from: 'ITC', to: 'ETH' },
  { from: 'ITC', to: 'BTC' },
  { from: 'ITC', to: 'SOL' },
  { from: 'ITC', to: 'BNB' },
  { from: 'ITC', to: 'XRP' },
  { from: 'ITC', to: 'USDC' },
  { from: 'ITC', to: 'ADA' },
  { from: 'ITC', to: 'DOGE' },
  { from: 'ITC', to: 'AVAX' },
  { from: 'ITC', to: 'USD' },
  { from: 'ITC', to: 'EUR' },
  { from: 'ITC', to: 'INR' },
  { from: 'ITC', to: 'PKR' },
  { from: 'ITC', to: 'BDT' },
  { from: 'ITC', to: 'LKR' },
  { from: 'ITC', to: 'NPR' },
  { from: 'ICE', to: 'USDT' },
  { from: 'ICE', to: 'ETH' },
  { from: 'ICE', to: 'BTC' },
  { from: 'ICE', to: 'SOL' },
  { from: 'ICE', to: 'BNB' },
  { from: 'ICE', to: 'XRP' },
  { from: 'ICE', to: 'USDC' },
  { from: 'ICE', to: 'ADA' },
  { from: 'ICE', to: 'DOGE' },
  { from: 'ICE', to: 'AVAX' },
  { from: 'IGC', to: 'USDT' },
  { from: 'IGC', to: 'ETH' },
  { from: 'IGC', to: 'BTC' },
  { from: 'IGC', to: 'SOL' },
  { from: 'IGC', to: 'BNB' },
  { from: 'IGC', to: 'XRP' },
  { from: 'IGC', to: 'USDC' },
  { from: 'IGC', to: 'ADA' },
  { from: 'IGC', to: 'DOGE' },
  { from: 'IGC', to: 'AVAX' },
  { from: 'COMP', to: 'USDT' },
  { from: 'COMP', to: 'ETH' },
  { from: 'COMP', to: 'BTC' },
  { from: 'COMP', to: 'SOL' },
  { from: 'COMP', to: 'BNB' },
  { from: 'COMP', to: 'XRP' },
  { from: 'COMP', to: 'USDC' },
  { from: 'COMP', to: 'ADA' },
  { from: 'COMP', to: 'DOGE' },
  { from: 'COMP', to: 'AVAX' },
  { from: 'FRC', to: 'USDT' },
  { from: 'FRC', to: 'ETH' },
  { from: 'FRC', to: 'BTC' },
  { from: 'FRC', to: 'SOL' },
  { from: 'FRC', to: 'BNB' },
  { from: 'FRC', to: 'XRP' },
  { from: 'FRC', to: 'USDC' },
  { from: 'FRC', to: 'ADA' },
  { from: 'FRC', to: 'DOGE' },
  { from: 'FRC', to: 'AVAX' },
  { from: 'LOAN', to: 'USDT' },
  { from: 'LOAN', to: 'ETH' },
  { from: 'LOAN', to: 'BTC' },
  { from: 'LOAN', to: 'SOL' },
  { from: 'LOAN', to: 'BNB' },
  { from: 'LOAN', to: 'XRP' },
  { from: 'LOAN', to: 'USDC' },
  { from: 'LOAN', to: 'ADA' },
  { from: 'LOAN', to: 'DOGE' },
  { from: 'LOAN', to: 'AVAX' },
  { from: 'JBC', to: 'USDT' },
  { from: 'JBC', to: 'ETH' },
  { from: 'JBC', to: 'BTC' },
  { from: 'JBC', to: 'SOL' },
  { from: 'JBC', to: 'BNB' },
  { from: 'JBC', to: 'XRP' },
  { from: 'JBC', to: 'USDC' },
  { from: 'JBC', to: 'ADA' },
  { from: 'JBC', to: 'DOGE' },
  { from: 'JBC', to: 'AVAX' },
  { from: 'JOB', to: 'USDT' },
  { from: 'JOB', to: 'ETH' },
  { from: 'JOB', to: 'BTC' },
  { from: 'FRN', to: 'USDT' },
  { from: 'FRN', to: 'ETH' },
  { from: 'FRN', to: 'BTC' },
  { from: 'WORK', to: 'USDT' },
  { from: 'WORK', to: 'ETH' },
  { from: 'WORK', to: 'BTC' },
];

export const orderBook: { buys: Order[]; sells: Order[] } = {
  buys: [
    { price: 3.09, amount: 150.5 },
    { price: 3.08, amount: 200.0 },
    { price: 3.07, amount: 120.2 },
    { price: 3.06, amount: 300.1 },
    { price: 3.05, amount: 50.0 },
    { price: 3.04, amount: 80.8 },
  ],
  sells: [
    { price: 3.11, amount: 180.0 },
    { price: 3.12, amount: 90.5 },
    { price: 3.13, amount: 250.0 },
    { price: 3.14, amount: 110.7 },
    { price: 3.15, amount: 60.0 },
    { price: 3.16, amount: 140.3 },
  ],
};

export const tradeHistory: Trade[] = [
  { price: 3.10, amount: 50.0, time: '14:30:15', type: 'buy' },
  { price: 3.11, amount: 30.2, time: '14:30:10', type: 'sell' },
  { price: 3.10, amount: 20.8, time: '14:30:05', type: 'buy' },
  { price: 3.12, amount: 70.0, time: '14:29:59', type: 'sell' },
  { price: 3.11, amount: 45.5, time: '14:29:55', type: 'sell' },
];

export const tokenStages: TokenStage[] = [
    { stage: 1, supplyPercentage: 0.1, status: 'Completed', unfreezesIn: '' },
    { stage: 2, supplyPercentage: 0.2, status: 'Active', unfreezesIn: '15 days' },
    { stage: 3, supplyPercentage: 0.4, status: 'Locked', unfreezesIn: '' },
    { stage: 4, supplyPercentage: 1, status: 'Locked', unfreezesIn: '' },
    { stage: 5, supplyPercentage: 2, status: 'Locked', unfreezesIn: '' },
    { stage: 6, supplyPercentage: 4, status: 'Locked', unfreezesIn: '' },
    { stage: 7, supplyPercentage: 10, status: 'Locked', unfreezesIn: '' },
    { stage: 8, supplyPercentage: 20, status: 'Locked', unfreezesIn: '' },
];


export const lockDurations: LockDuration[] = [
  { value: 1, unit: 'month', label: '1 Month' },
  { value: 3, unit: 'month', label: '3 Months' },
  { value: 6, unit: 'month', label: '6 Months' },
  { value: 12, unit: 'month', label: '1 Year' },
  { value: 24, unit: 'month', label: '2 Years' },
  { value: 36, unit: 'month', label: '3 Years' },
];


export const stakedPositions: StakedPosition[] = [
  { id: 'stake1', asset: 'IGC', amount: 5000, startDate: '2024-01-10', endDate: '2025-01-10', durationMonths: 12, status: 'Staked' },
  { id: 'stake2', asset: 'ITC', amount: 10000, startDate: '2023-12-01', endDate: '2025-12-01', durationMonths: 24, status: 'Staked' },
  { id: 'stake3', asset: 'ICE', amount: 2500, startDate: '2024-03-15', endDate: '2024-09-15', durationMonths: 6, status: 'Staked' },
  { id: 'stake4', asset: 'GenZ', amount: 800, startDate: '2023-11-20', endDate: '2024-05-20', durationMonths: 6, status: 'Unstaked' },
];

export const countries = [
    { value: 'USA', label: 'United States' },
    { value: 'CAN', label: 'Canada' },
    { value: 'GBR', label: 'United Kingdom' },
    { value: 'AUS', label: 'Australia' },
    { value: 'IND', label: 'India' },
    { value: 'BRA', label: 'Brazil' },
    { value: 'ZAF', label: 'South Africa' },
    { value: 'DEU', label: 'Germany'},
    { value: 'PAK', label: 'Pakistan'},
    { value: 'BGD', label: 'Bangladesh'},
    { value: 'SLV', label: 'El Salvador'},
    { value: 'MEX', label: 'Mexico'},
    { value: 'MDV', label: 'Maldives'},
    { value: 'UKR', label: 'Ukraine'},
];

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    level: 1,
    question: 'What does ITC stand for?',
    options: ['International Trade Coin', 'Internal Transfer Coin', 'Instant Transaction Coin', 'International Technology Coin'],
    correctAnswer: 'International Trade Coin',
    prize: 1
  },
  {
    id: 2,
    level: 1,
    question: 'What is the total supply of ICE?',
    options: ['1 Billion', '8 Billion', '21 Million', '100 Billion'],
    correctAnswer: '8 Billion',
    prize: 1
  },
  {
    id: 3,
    level: 2,
    question: 'What is the primary purpose of the Admin Panel?',
    options: ['Trading coins', 'Managing users and transactions', 'Staking tokens', 'Writing forum posts'],
    correctAnswer: 'Managing users and transactions',
    prize: 5
  }
];

export const causes: Cause[] = [
  {
    id: 1,
    title: 'The Anti-Corruption Initiative',
    description: "Submit verifiable video evidence of bribery to earn a bounty of 200 ITC + $1,250 USD. Successful reporters are designated 'International Anti-Corruption Officers.' 50% of revenue from the first two token stages in each country is reserved for their respective anti-corruption budget.",
    icon: 'ShieldCheck',
    buttonText: 'Apply / Submit Evidence',
  },
  {
    id: 2,
    title: 'No War and Global Peace',
    description: 'Join a global civilian corps dedicated to peacekeeping, conflict resolution, and humanitarian aid. 10% of country-specific revenue is allocated to this cause.',
    icon: 'Heart',
    buttonText: 'Apply to Join'
  },
  {
    id: 3,
    title: 'Plant 2 Trees, Get 1 ITC',
    description: 'Participate in our reforestation program. For every two trees you plant and verify, you earn 1 ITC. 10% of country-specific revenue is allocated to this environmental cause.',
    icon: 'Sprout',
    buttonText: 'Apply to Plant'
  },
  {
    id: 4,
    title: 'Influencer Earning Based on Views',
    description: "Promote our vision on social media. 5% of country-specific revenue forms a prize pool. Your share is determined by the views your content generates.",
    icon: 'Megaphone',
    buttonText: 'Apply to be an Influencer'
  },
];

export const votingPolls: VotingPoll[] = [
  {
    id: 'poll-world-1',
    geography: 'World',
    category: 'Proposal',
    title: 'Standardize Global Crypto Regulations',
    description: 'A proposal to establish a framework for international crypto regulations to foster innovation and security.',
    results: [
      { option: '100% Agree', percentage: 45, color: 'bg-green-500' },
      { option: '75% Agree', percentage: 25, color: 'bg-yellow-500' },
      { option: '50% Agree', percentage: 15, color: 'bg-orange-500' },
      { option: '25% Agree', percentage: 10, color: 'bg-red-500' },
      { option: '0% Agree', percentage: 5, color: 'bg-gray-500' },
    ],
  },
  {
    id: 'poll-nation-1',
    geography: 'Nation',
    category: 'Election',
    title: 'National Blockchain Advisory Board Election',
    description: 'Elect three members to the new National Blockchain Advisory Board for a two-year term.',
    results: [
      { option: 'Candidate A: Dr. Eva Rostova', percentage: 38, color: 'bg-blue-500' },
      { option: 'Candidate B: Kenji Tanaka', percentage: 32, color: 'bg-green-500' },
      { option: 'Candidate C: Maria Rodriguez', percentage: 21, color: 'bg-purple-500' },
      { option: 'Candidate D: Ahmed Khan', percentage: 9, color: 'bg-yellow-500' },
    ],
  },
  {
    id: 'poll-street-1',
    geography: 'Street',
    category: 'Issue',
    title: 'Streetlight Repair on Elm Street',
    description: 'Several streetlights on Elm Street are broken. Should we allocate 500 IGC from the community fund for immediate repairs?',
    results: [
      { option: '100% Agree', percentage: 88, color: 'bg-green-500' },
      { option: '75% Agree', percentage: 8, color: 'bg-yellow-500' },
      { option: '50% Agree', percentage: 2, color: 'bg-orange-500' },
      { option: '25% Agree', percentage: 1, color: 'bg-red-500' },
      { option: '0% Agree', percentage: 1, color: 'bg-gray-500' },
    ],
  },
];

export const socialPosts: SocialPost[] = [
  { id: 'post1', authorId: 'usr_002', content: 'Loving the new features on the IBC platform! Staking is so smooth. #crypto #ibc', timestamp: '2h ago', likes: 15, comments: 4 },
  { id: 'post2', authorId: 'usr_003', content: 'Just submitted my evidence for the anti-corruption initiative. Feels good to be part of the change.', timestamp: '5h ago', likes: 45, comments: 12 },
  { id: 'post3', authorId: 'usr_005', content: 'Check out this awesome digital art I bought on the marketplace!', imageUrl: `https://picsum.photos/seed/social-art-1/600/400`, imageHint: 'digital art', timestamp: '1d ago', likes: 102, comments: 23 },
  { id: 'post4', authorId: 'usr_006', content: 'The community governance proposals are getting really interesting. Time to vote!', timestamp: '2d ago', likes: 33, comments: 8 },
];

export const coinPackages: CoinPackage[] = [
    { name: 'Diamond', coins: 100000, packagesAvailable: 8000, color: 'bg-cyan-300' },
    { name: 'Platinum', coins: 50000, packagesAvailable: 16000, color: 'bg-slate-400' },
    { name: 'Gold', coins: 25000, packagesAvailable: 32000, color: 'bg-amber-400' },
    { name: 'Silver', coins: 12500, packagesAvailable: 64000, color: 'bg-zinc-400' },
    { name: 'Bronze', coins: 6250, packagesAvailable: 128000, color: 'bg-orange-400' },
];

export const adminAllocations: AdminAllocation[] = [
  // 40% Geographic
  { type: 'geographic', category: 'Society/Street Development', percentage: 15, description: 'Funding for hyper-local community projects.', icon: Building2 },
  { type: 'geographic', category: 'Village/Ward Development', percentage: 10, description: 'Funding for village and ward level initiatives.', icon: Building2 },
  { type: 'geographic', category: 'Block/Kasbah Development', percentage: 5, description: 'Development funds for blocks and kasbahs.', icon: Building2 },
  { type: 'geographic', category: 'Taluka Development', percentage: 2.5, description: 'Funds allocated for development at the Taluka level.', icon: Building2 },
  { type: 'geographic', category: 'District Development', percentage: 2.5, description: 'Development funds for entire districts.', icon: Building2 },
  { type: 'geographic', category: 'State Development', percentage: 5, description: 'Funding for state-wide projects and infrastructure.', icon: Landmark },
  { type: 'geographic', category: 'Country Development', percentage: 5, description: 'National level development funds.', icon: Globe },
  
  // 40% Voting
  { type: 'voting', category: 'Public Demand (Voting)', percentage: 40, description: 'Decided by public voting for issues, events, and projects.', icon: Vote },

  // 20% Fixed (World Initiative)
  { type: 'fixed', category: 'Creator', percentage: 0.1, description: 'Ongoing rewards for the original architects of the system.', icon: UserCog },
  { type: 'fixed', category: 'System Management', percentage: 0.4, description: 'Covers operational costs, servers, team, and staff.', icon: Settings },
  { type: 'fixed', category: 'Global Peace & Development', percentage: 1.5, description: 'Funds for global peacekeeping and humanitarian aid.', icon: Handshake },
  { type: 'fixed', category: 'Anti-Corruption', percentage: 5.0, description: 'Bounties and resources for fighting corruption.', icon: Shield },
  { type: 'fixed', category: 'AI Education', percentage: 1.5, description: 'Providing free AI education and tools.', icon: Brain },
  { type: 'fixed', category: 'Plant a Tree Initiative', percentage: 1.5, description: 'Global reforestation and environmental projects.', icon: Leaf },
  { type: 'fixed', category: 'International Issues', percentage: 1.0, description: 'Funding for tackling global challenges voted on by the community.', icon: Globe },
  { type: 'fixed', category: 'National Issues', percentage: 1.0, description: 'Country-specific projects and initiatives.', icon: Landmark },
  { type: 'fixed', category: 'Niche Job Creation', percentage: 1.0, description: 'Developing and funding specialized job markets.', icon: Briefcase },
  { type: 'fixed', category: 'Influencer Prize Pool', percentage: 1.0, description: 'Rewards for content creators promoting the platform.', icon: Share2 },
  { type: 'fixed', category: 'Sports Development', percentage: 1.0, description: 'Sponsoring athletes and developing sports infrastructure.', icon: Trophy },
  { type: 'fixed', category: 'Arts Development', percentage: 1.0, description: 'Grants and platforms for artists and cultural projects.', icon: Palette },
  { type: 'fixed', category: 'Affiliate Marketing', percentage: 2.0, description: 'Rewards for bringing new users to the platform.', icon: Share2 },
];

export const tokenSupplyDistribution: TokenSupplyDistribution[] = [
    { name: 'Public Sale', value: 35.0 },
    { name: 'Coin Split Bonus', value: 5.1 },
    { name: 'Global Causes & Development', value: 20.0 },
    { name: 'Public Demand Fund', value: 39.9 }
];

export const sportsAndArtsItems: SportsAndArtsItem[] = [
    { id: 1, name: "Women's Cricket", description: 'Promoting and funding women\'s cricket leagues and teams.'},
    { id: 2, name: "Men's Cricket", description: 'Supporting grassroots and professional men\'s cricket.'},
    { id: 3, name: "Women's Football", description: 'Developing women\'s football from local clubs to national teams.'},
    { id: 4, name: "Men's Football", description: 'Investing in football academies and tournaments for men.'},
    { id: 5, name: "Painting", description: 'Grants and platforms for painters to showcase and sell their work.'},
    { id: 6, name: "Sculpture", description: 'Funding for public art projects and sculpture exhibitions.'},
    { id: 7, name: "Digital Art", description: 'Supporting digital artists with tools, education, and NFT marketplace integration.'},
];


export const competitionPhases: CompetitionPhase[] = [
  { phase: 1, title: 'Creator Fund', description: 'Earn based on social media views. 5% of country-based revenue is pooled for creators. Your earnings are your view count divided by total views, multiplied by the prize pool.' },
  { phase: 2, title: 'Global/National Development', description: 'Revenue is split: 50% to Anti-Corruption, 10% to Peace Initiatives, 10% to Reforestation, 30% to issue-based development funds.' },
  { phase: 3, title: 'Idea-Based Competition', description: 'Pitch an idea. If it wins a 75% majority vote at any governance level (from street to state), you become the project head. 0.5% of revenue from that jurisdiction funds your project.' },
  { phase: 4, title: 'Niche Job Creation', description: 'Compete to create jobs in specific niches. The most effective job creators are rewarded.' }
];

export const sportsList: SportsItem[] = [
  { id: 1, name: 'Football (Soccer)', description: 'The world\'s most popular sport.' },
  { id: 2, name: 'Cricket', description: 'A bat-and-ball game with a huge following.' },
  { id: 3, name: 'Basketball', description: 'A fast-paced court game of skill and agility.' },
  { id: 4, name: 'Tennis', description: 'A global racket sport for individuals or pairs.' },
  { id: 5, name: 'Athletics (Track & Field)', description: 'Competitions including running, jumping, and throwing.' },
  { id: 6, name: 'Hockey', description: 'Includes both field hockey and ice hockey.' },
  { id: 7, name: 'Swimming', description: 'Competitive swimming across various distances and strokes.' },
  { id: 8, name: 'Badminton', description: 'A fast-paced indoor racket sport.' },
  { id: 9, name: 'Volleyball', description: 'A team sport played with a ball over a net.' },
  { id: 10, name: 'Table Tennis', description: 'A high-speed racket sport played on a tabletop.' },
  { id: 11, name: 'Baseball', description: 'A classic American bat-and-ball sport.' },
  { id: 12, name: 'Golf', description: 'A precision club-and-ball sport.' },
  { id: 13, name: 'Martial Arts', description: 'Includes Karate, Judo, Taekwondo, and more.' },
  { id: 14, name: 'Boxing', description: 'A combat sport of strength, speed, and reflexes.' },
  { id: 15, name: 'Cycling', description: 'Road racing, track cycling, and mountain biking.' },
  { id: 16, name: 'Rugby', description: 'A full-contact team sport.' },
  { id: 17, name: 'American Football', description: 'A strategic and physical team sport.' },
  { id: 18, name: 'Esports', description: 'Competitive video gaming at a professional level.' },
  { id: 19, 'name': 'Archery', 'description': 'The sport of using a bow to shoot arrows.' },
  { id: 20, name: 'Gymnastics', description: 'A sport requiring balance, strength, and flexibility.' },
  { id: 21, name: 'Fencing', description: 'The martial art of fighting with blades.' },
  { id: 22, name: 'Sailing', description: 'Competitive racing on water using wind power.' },
  { id_23: 23, name: 'Equestrian', description: 'The art and sport of horsemanship.' },
  { id: 24, name: 'Wrestling', description: 'A combat sport involving grappling techniques.' },
  { id: 25, name: 'Snooker & Billiards', description: 'Cue sports requiring precision and strategy.' },
];

export const artsList: ArtItem[] = [
  { id: 1, name: 'Painting', description: 'Covering oil, acrylic, watercolor, and more.' },
  { id: 2, name: 'Sculpture', description: 'From traditional clay and stone to modern installations.' },
  { id: 3, name: 'Digital Art', description: 'Includes 2D, 3D, animation, and generative art.' },
  { id: 4, name: 'Photography', description: 'Fine art, photojournalism, and commercial photography.' },
  { id: 5, name: 'Music', description: 'Composition, performance, and production across all genres.' },
  { id: 6, name: 'Filmmaking', description: 'From short films to feature-length documentaries.' },
  { id: 7, name: 'Dance', description: 'Classical, contemporary, and cultural dance forms.' },
  { id: 8, 'name': 'Theatre', 'description': 'Acting, directing, and stage design.' },
  { id: 9, name: 'Literature', description: 'Poetry, prose, and creative non-fiction.' },
  { id: 10, name: 'Architecture', description: 'Innovative and sustainable building design.' },
  { id: 11, name: 'Fashion Design', description: 'Creating clothing and accessories.' },
  { id: 12, name: 'Graphic Design', description: 'Visual communication and problem-solving.' },
  { id: 13, name: 'Illustration', description: 'Creating images for books, magazines, and more.' },
  { id: 14, name: 'Calligraphy', description: 'The art of beautiful handwriting.' },
  { id: 15, name: 'Ceramics', description: 'Creating objects from clay and other ceramic materials.' },
  { id: 16, name: 'Jewelry Design', description: 'Designing and creating wearable art.' },
  { id: 17, name: 'Street Art', description: 'Murals, graffiti, and public installations.' },
  { id: 18, name: 'Stand-up Comedy', description: 'The art of making people laugh.' },
  { id: 19, name: 'Magic & Illusion', description: 'The art of creating illusions and performing magic.' },
  { id: 20, name: 'Culinary Arts', description: 'The art of preparing, cooking, and presenting food.' },
  { id: 21, name: 'Tattoo Art', description: 'The art of decorating the skin with permanent ink.' },
  { id: 22, name: 'Origami', description: 'The Japanese art of paper folding.' },
  { id: 23, name: 'Glassblowing', description: 'Creating glass objects by inflating molten glass.' },
  { id: 24, 'name': 'Puppetry', 'description': 'The art of manipulating puppets.' },
  { id: 25, name: 'Ventriloquism', description: 'The art of "throwing" one\'s voice.' },
];

export const teamMembers: TeamMember[] = [
    { id: 'tm001', name: 'Liam Garcia', avatarId: 'user-avatar-1', level: 1, joinDate: '2024-05-10', earnings: 150.75 },
    { id: 'tm002', name: 'Olivia Martinez', avatarId: 'user-avatar-2', level: 1, joinDate: '2024-05-12', earnings: 220.50 },
    { id: 'tm003', name: 'Noah Rodriguez', avatarId: 'user-avatar-3', level: 2, joinDate: '2024-05-15', earnings: 75.20 },
    { id: 'tm004', name: 'Emma Hernandez', avatarId: 'user-avatar-4', level: 2, joinDate: '2024-05-18', earnings: 95.40 },
    { id: 'tm005', name: 'Oliver Lopez', avatarId: 'user-avatar-1', level: 3, joinDate: '2024-05-20', earnings: 40.10 },
    { id: 'tm006', name: 'Ava Gonzalez', avatarId: 'user-avatar-2', level: 4, joinDate: '2024-05-22', earnings: 25.00 },
    { id: 'tm007', name: 'Elijah Wilson', avatarId: 'user-avatar-3', level: 5, joinDate: '2024-05-25', earnings: 15.50 },
    { id: 'tm008', name: 'Charlotte Anderson', avatarId: 'user-avatar-4', level: 6, joinDate: '2024-05-28', earnings: 10.00 },
    { id: 'tm009', name: 'James Thomas', avatarId: 'user-avatar-1', level: 7, joinDate: '2024-06-01', earnings: 5.80 },
    { id: 'tm010', name: 'Sophia Taylor', avatarId: 'user-avatar-2', level: 8, joinDate: '2024-06-02', earnings: 4.20 },
];
