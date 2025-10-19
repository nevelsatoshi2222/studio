
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
  CompetitionPhase
} from './types';
import { placeholderImages } from './placeholder-images.json';

export const users: User[] = [
  {
    id: 'usr_admin',
    name: 'Admin',
    email: 'admin@ibc.com',
    country: 'United States',
    balance: 8_000_000_000,
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
    { stage: 1, supplyPercentage: 0.1, status: 'Complete', unfreezesIn: '' },
    { stage: 2, supplyPercentage: 0.2, status: 'Active', unfreezesIn: '15 days' },
    { stage: 3, supplyPercentage: 0.4, status: 'Locked', unfreezesIn: '' },
    { stage: 4, supplyPercentage: 1, status: 'Locked', unfreezesIn: '' },
    { stage: 5, supplyPercentage: 2, status: 'Locked', unfreezesIn: '' },
    { stage: 6, supplyPercentage: 4, status: 'Locked', unfreezesIn: '' },
    { stage: 7, supplyPercentage: 10, status: 'Locked', unfreezesIn: '' },
    { stage: 8, supplyPercentage: 20, status: 'Locked', unfreezesIn: '' },
];


export const lockDurations: LockDuration[] = [
    { value: 7, label: '7 Days' },
    { value: 30, label: '30 Days' },
    { value: 60, label: '2 Months' },
    { value: 180, label: '6 Months' },
    { value: 365, label: '12 Months' },
    { value: 545, label: '18 Months' },
    { value: 730, label: '24 Months' },
    { value: 1095, label: '36 Months' },
    { value: 1460, label: '48 Months' },
    { value: 1825, label: '60 Months' },
    { value: 2190, label: '72 Months' },
    { value: 2555, label: '84 Months' },
    { value: 2920, label: '96 Months' },
    { value: 3285, label: '108 Months' },
    { value: 3650, label: '120 Months' },
    { value: 7300, label: '240 Months' },
];

export const stakedPositions: StakedPosition[] = [
  {
    coin: 'IGC',
    amount: 5000,
    stakedAt: '2024-01-10',
    duration: 12,
    status: 'Staked',
  },
  {
    coin: 'ITC',
    amount: 10000,
    stakedAt: '2023-12-01',
    duration: 24,
    status: 'Staked',
  },
  {
    coin: 'ICE',
    amount: 2500,
    stakedAt: '2024-03-15',
    duration: 6,
    status: 'Staked',
  },
  {
    coin: 'LOAN',
    amount: 1200,
    stakedAt: '2023-11-01',
    duration: 36,
    status: 'Staked',
  },
  {
    coin: 'JBC',
    amount: 800,
    stakedAt: '2024-02-20',
    duration: 18,
    status: 'Staked',
  },
  {
    coin: 'COMP',
    amount: 15000,
    stakedAt: '2024-04-01',
    duration: 12,
    status: 'Staked',
  },
  {
    coin: 'FRC',
    amount: 3000,
    stakedAt: '2024-04-10',
    duration: 6,
    status: 'Staked'
  }
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
    id: 1,
    geography: 'Street',
    title: 'Streetlight Repair on Main Street',
    description: 'Proposal to allocate funds from the community development pool to repair 5 broken streetlights on Main Street. Estimated cost: 500 ITC.',
    votes: [
      { option: '0% Agree', count: 2 },
      { option: '25% Agree', count: 5 },
      { option: '50% Agree', count: 10 },
      { option: '75% Agree', count: 35 },
      { option: '100% Agree', count: 48 },
    ],
  },
  {
    id: 2,
    geography: 'Village',
    title: 'New Community Park Development',
    description: 'Should we approve the plan to convert the unused plot of land into a new community park with a playground and benches?',
    votes: [
      { option: '0% Agree', count: 15 },
      { option: '25% Agree', count: 30 },
      { option: '50% Agree', count: 80 },
      { option: '75% Agree', count: 150 },
      { option: '100% Agree', count: 225 },
    ],
  },
  {
    id: 3,
    geography: 'Kasba/Block',
    title: 'Weekly Farmers Market Initiative',
    description: 'Proposal to establish a weekly farmers market in the town square to support local agriculture and provide fresh produce to residents.',
    votes: [
      { option: '0% Agree', count: 5 },
      { option: '25% Agree', count: 10 },
      { option: '50% Agree', count: 40 },
      { option: '75% Agree', count: 90 },
      { option: '100% Agree', count: 150 },
    ],
  },
  {
    id: 4,
    geography: 'Taluka',
    title: 'Upgrade Taluka-wide Public Transport',
    description: 'Should we allocate 100,000 IGC from the development fund to add 5 new electric buses to the public transport fleet?',
    votes: [
      { option: '0% Agree', count: 120 },
      { option: '25% Agree', count: 250 },
      { option: '50% Agree', count: 600 },
      { option: '75% Agree', count: 1200 },
      { option: '100% Agree', count: 830 },
    ],
  },
  {
    id: 5,
    geography: 'District',
    title: 'Fund for District Hospital Modernization',
    description: 'A proposal to create a fund of 1M IGC to upgrade equipment and facilities at the main district hospital.',
    votes: [
      { option: '0% Agree', count: 50 },
      { option: '25% Agree', count: 200 },
      { option: '50% Agree', count: 1200 },
      { option: '75% Agree', count: 4500 },
      { option: '100% Agree', count: 8000 },
    ],
  },
  {
    id: 6,
    geography: 'Area',
    title: 'Area-wide Water Purification Project',
    description: 'A 5M IGC proposal to build three new water purification plants to serve the entire area.',
    votes: [
      { option: '0% Agree', count: 100 },
      { option: '25% Agree', count: 400 },
      { option: '50% Agree', count: 2000 },
      { option: '75% Agree', count: 8000 },
      { option: '100% Agree', count: 15000 },
    ],
  },
  {
    id: 7,
    geography: 'State',
    title: 'High-Speed Rail Network Initiative',
    description: 'Should the state allocate 2B IGC to begin development of a high-speed rail network connecting major cities?',
    votes: [
      { option: '0% Agree', count: 1000 },
      { option: '25% Agree', count: 5000 },
      { option: '50% Agree', count: 25000 },
      { option: '75% Agree', count: 100000 },
      { option: '100% Agree', count: 50000 },
    ],
  },
];

export const ecommCategories: EcommCategory[] = [
  {
    title: 'Art',
    subItems: [{ title: 'Paintings' }, { title: 'Sculptures' }, { title: 'Digital Art' }],
  },
  {
    title: 'Sports',
    subItems: [{ title: 'Cricket' }, { title: 'Football' }, { title: 'Tennis' }],
  },
  {
    title: 'Niche-based Job Creation',
    subItems: [{ title: 'Graphic Design' }, { title: 'Content Writing' }, { title: 'Web Development' }],
  },
];

export const ecommProducts: EcommProduct[] = [
  { id: 1, name: 'Sunset Over the Ocean', description: 'A beautiful oil painting capturing a serene sunset.', priceITC: 500, priceUSD: 50, imageId: 'ecomm-art-1', category: 'Art', subcategory: 'Paintings' },
  { id: 2, name: 'Bronze Stag', description: 'A majestic bronze sculpture of a stag.', priceITC: 1500, priceUSD: 150, imageId: 'ecomm-art-2', category: 'Art', subcategory: 'Sculptures' },
  { id: 3, name: 'Signed Cricket Bat', description: 'A cricket bat signed by the 2023 championship team.', priceITC: 1000, priceUSD: 100, imageId: 'ecomm-sports-1', category: 'Sports', subcategory: 'Cricket' },
  { id: 4, name: 'Custom Logo Design', description: 'A professional logo design for your brand.', priceITC: 250, priceUSD: 25, imageId: 'ecomm-job-1', category: 'Niche-based Job Creation', subcategory: 'Graphic Design' },
];

export const socialPosts: SocialPost[] = [
  { id: 'post1', authorId: 'usr_002', content: 'Loving the new features on the IBC platform! Staking is so smooth. #crypto #ibc', timestamp: '2h ago', likes: 15, comments: 4 },
  { id: 'post2', authorId: 'usr_003', content: 'Just submitted my evidence for the anti-corruption initiative. Feels good to be part of the change.', timestamp: '5h ago', likes: 45, comments: 12 },
  { id: 'post3', authorId: 'usr_005', content: 'Check out this awesome digital art I bought on the marketplace!', imageUrl: `https://picsum.photos/seed/social-art-1/600/400`, imageHint: 'digital art', timestamp: '1d ago', likes: 102, comments: 23 },
  { id: 'post4', authorId: 'usr_006', content: 'The community governance proposals are getting really interesting. Time to vote!', timestamp: '2d ago', likes: 33, comments: 8 },
];

export const coinPackages: CoinPackage[] = [
    { name: 'Red', coins: 8_000, available: 1_000, color: '#ef4444' },
    { name: 'Orange', coins: 4_000, available: 2_000, color: '#f97316' },
    { name: 'Yellow', coins: 2_000, available: 4_000, color: '#eab308' },
    { name: 'Green', coins: 1_000, available: 8_000, color: '#22c55e' },
    { name: 'Blue', coins: 500, available: 16_000, color: '#3b82f6' },
    { name: 'Indigo', coins: 250, available: 32_000, color: '#6366f1' },
    { name: 'Violet', coins: 125, available: 64_000, color: '#8b5cf6' },
];

export const adminAllocations: AdminAllocation[] = [
    { name: 'Global Peace & Development', value: 10, description: 'Peacekeeping & humanitarian aid' },
    { name: 'Anti-Corruption Initiative', value: 50, description: 'Funding anti-corruption efforts' },
    { name: 'AI Education', value: 5, description: 'Free AI education programs' },
    { name: 'Plant a Tree Initiative', value: 10, description: 'Reforestation projects' },
    { name: 'International Issues', value: 5, description: 'Addressing global challenges' },
    { name: 'National Issues', value: 5, description: 'Supporting country-specific projects' },
    { name: 'Sports Development', value: 5, description: 'Promoting sports and athletes' },
    { name: 'Arts Development', value: 5, description: 'Supporting artists and creators' },
    { name: 'Niche-Based Job Creation', value: 5, description: 'Creating specialized job markets' }
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
  { phase_3: 'Idea-Based Competition', description: 'Pitch an idea. If it wins a 75% majority vote at any governance level (from street to state), you become the project head. 0.5% of revenue from that jurisdiction funds your project.' },
  { phase: 4, title: 'Niche Job Creation', description: 'Compete to create jobs in specific niches. The most effective job creators are rewarded.' }
];

