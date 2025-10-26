
import { PgcSaleStage, PgcPotAllocation } from './types';

export const pgcSaleStages: PgcSaleStage[] = [
  // Phase 1: Split & 1:1 Bonus
  {
    stage: 1,
    percentOfTs: '0.01%',
    coinsSoldB: 0.08,
    priceRange: '$1.00 -> $2.00',
    action: 'Split + Price Reset',
    reward: '1:1 Bonus',
    incomingFund: '$120M',
  },
  {
    stage: 2,
    percentOfTs: '0.02%',
    coinsSoldB: 0.16,
    priceRange: '$1.00 -> $2.00',
    action: 'Split + Price Reset',
    reward: '1:1 Bonus',
    incomingFund: '$240M',
  },
  {
    stage: 3,
    percentOfTs: '0.05%',
    coinsSoldB: 0.4,
    priceRange: '$1.00 -> $2.00',
    action: 'Split + Price Reset',
    reward: '1:1 Bonus',
    incomingFund: '$600M',
  },
  // Phase 2: Price Climb & Decreasing Reward
  {
    stage: 4,
    percentOfTs: '0.10%',
    coinsSoldB: 0.8,
    priceRange: '$1.00 -> $2.50',
    action: '---',
    reward: '1:0.6 Reward',
    incomingFund: '$1.4B',
  },
  {
    stage: 5,
    percentOfTs: '0.20%',
    coinsSoldB: 1.6,
    priceRange: '$2.50 -> $5.00',
    action: '---',
    reward: '1:0.5 Reward',
    incomingFund: '$6B',
  },
  {
    stage: 6,
    percentOfTs: '0.50%',
    coinsSoldB: 4.0,
    priceRange: '$5.00 -> $10.00',
    action: '---',
    reward: '1:0.4 Reward',
    incomingFund: '$30B',
  },
  {
    stage: 7,
    percentOfTs: '1.00%',
    coinsSoldB: 8.0,
    priceRange: '$10.00 -> $20.00',
    action: 'Unlocks WGCP',
    reward: '1:0.35 Reward',
    valueAt: '$300B @ $37.5',
    incomingFund: '$120B',
  },
  // Phase 3: Final Ascent
  {
    stage: 8,
    percentOfTs: '2.00%',
    coinsSoldB: 16.0,
    priceRange: '$20.00 -> $50.00',
    action: '---',
    reward: '1:0.30 Reward',
    valueAt: '$1.2T @ $75',
    incomingFund: '$560B',
  },
  {
    stage: 9,
    percentOfTs: '5.00%',
    coinsSoldB: 40.0,
    priceRange: '$50.00 -> $100.00',
    action: 'Sale Ends',
    reward: '1:0.25 Reward',
    incomingFund: '$3T',
  },
];

export const pgcPotAllocations: PgcPotAllocation[] = [
    {
      name: 'Public Demand Pot (PDP)',
      allocation: '63.8995',
      coinsB: 511.196,
      use: 'Decided by Public Governance voting.',
      color: '#3b82f6', // blue-500
    },
    {
      name: 'Quiz & Competition Rewards',
      allocation: '7.50',
      coinsB: 60,
      valueT: '6.0',
      use: 'A dedicated reserve for rewards from the Financial Awareness Quiz and other future competitions.',
      color: '#14b8a6', // teal-500
    },
    {
      name: 'Creator Pot (CP)',
      allocation: '11.00',
      coinsB: 88,
      valueT: '8.8',
      use: '10% for Public Use, 1% for Creator Self-Use.',
      color: '#ef4444', // red-500
    },
    {
      name: 'Country Wise Pot (CWP)',
      allocation: '10.00',
      coinsB: 80,
      valueT: '8.0',
      use: 'Decided by country-specific public voting.',
      color: '#22c55e', // green-500
    },
    {
      name: "World's Good Cause Pot (WGCP)",
      allocation: '5.00',
      coinsB: 40,
      valueT: '4.0',
      use: 'Unlocks after Stage 7 for global initiatives.',
      color: '#f97316', // orange-500
    },
    {
      name: 'Reward Pot (RP)',
      allocation: '2.58',
      coinsB: 20.64,
      valueT: '2.06',
      use: 'A dedicated reserve for all bonus distributions during the 9-stage sale, including compounding split rewards.',
      color: '#a855f7', // purple-500
    },
     {
      name: 'India Anti-Corruption Reward Pot',
      allocation: '0.01',
      coinsB: 0.08,
      valueT: '0.008',
      use: 'A donation-based fund for rewarding anti-corruption efforts in India. The public and organizations can contribute in USDT and other top 10 cryptocurrencies.',
      color: '#64748b', // slate-500
    },
    {
      name: 'Presale Fund',
      allocation: '0.0005',
      coinsB: 0.004, // 4 Million PGC (2M for sale, 2M for bonus)
      use: 'A micro-allocation for the exclusive presale (0.00025% for sale, 0.00025% for 1:1 bonus). Proceeds go to the Creator.',
      color: '#fde047', // yellow-300
    },
    {
      name: 'Presale Affiliate Reward Pot',
      allocation: '0.0000275',
      coinsB: 0.00022, // 220,000 PGC
      use: '11% of the 2M presale coins, reserved for the presale affiliate reward program.',
      color: '#ec4899', // pink-500
    },
    {
      name: 'Presale Influencer Reward Pot',
      allocation: '0.0000125',
      coinsB: 0.0001, // 100,000 PGC
      use: '5% of the 2M presale coins, reserved for the presale influencer reward program.',
      color: '#d946ef', // fuchsia-500
    },
    {
      name: 'Presale Financial Quiz Pot',
      allocation: '0.00001',
      coinsB: 0.00008, // 80,000 PGC
      use: '4% of the 2M presale coins, reserved for the presale financial quiz rewards.',
      color: '#84cc16', // lime-500
    }
  ];
