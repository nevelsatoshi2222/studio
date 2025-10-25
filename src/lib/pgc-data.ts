
import { PgcSaleStage, PgcPotAllocation } from './types';

export const pgcSaleStages: PgcSaleStage[] = [
  // Phase 1: Split & 1:1 Bonus
  {
    stage: 1,
    percentOfTs: '0.01%',
    coinsSoldB: 0.08,
    priceRange: '$1.00 -> $2.00',
    action: 'Split + Price Reset',
    reward: '1:1 Bonus. Stage 1 revenue allocates: 75% to India Anti-Corruption, 20% to World Initiatives, 5% to Discretionary Fund.',
  },
  {
    stage: 2,
    percentOfTs: '0.02%',
    coinsSoldB: 0.16,
    priceRange: '$1.00 -> $2.00',
    action: 'Split + Price Reset',
    reward: '1:1 Bonus',
  },
  {
    stage: 3,
    percentOfTs: '0.05%',
    coinsSoldB: 0.4,
    priceRange: '$1.00 -> $2.00',
    action: 'Split + Price Reset',
    reward: '1:1 Bonus',
  },
  // Phase 2: Price Climb & Decreasing Reward
  {
    stage: 4,
    percentOfTs: '0.10%',
    coinsSoldB: 0.8,
    priceRange: '$1.00 -> $2.50',
    action: '---',
    reward: '1:0.6 Reward',
  },
  {
    stage: 5,
    percentOfTs: '0.20%',
    coinsSoldB: 1.6,
    priceRange: '$2.50 -> $5.00',
    action: '---',
    reward: '1:0.5 Reward',
  },
  {
    stage: 6,
    percentOfTs: '0.50%',
    coinsSoldB: 4.0,
    priceRange: '$5.00 -> $10.00',
    action: '---',
    reward: '1:0.4 Reward',
  },
  {
    stage: 7,
    percentOfTs: '1.00%',
    coinsSoldB: 8.0,
    priceRange: '$10.00 -> $20.00',
    action: 'Unlocks WGCP',
    reward: '1:0.35 Reward',
  },
  // Phase 3: Final Ascent
  {
    stage: 8,
    percentOfTs: '2.00%',
    coinsSoldB: 16.0,
    priceRange: '$20.00 -> $50.00',
    action: '---',
    reward: '1:0.30 Reward',
  },
  {
    stage: 9,
    percentOfTs: '5.00%',
    coinsSoldB: 40.0,
    priceRange: '$50.00 -> $100.00',
    action: 'Sale Ends',
    reward: '1:0.25 Reward',
  },
];

export const pgcPotAllocations: PgcPotAllocation[] = [
    {
      name: 'Public Demand Pot (PDP)',
      allocation: '71.4098',
      coinsB: 571.2784,
      valueT: '57.13',
      use: 'Decided by Public Governance voting.',
      color: '#3b82f6', // blue-500
    },
    {
      name: 'Creator Pot (CP)',
      allocation: '11.00',
      coinsB: 88.0,
      valueT: '8.8',
      use: '10% for Public Use, 1% for Creator Self-Use.',
      color: '#ef4444', // red-500
    },
    {
      name: 'Country Wise Pot (CWP)',
      allocation: '10.00',
      coinsB: 80.0,
      valueT: '8.0',
      use: 'Decided by country-specific public voting.',
      color: '#22c55e', // green-500
    },
    {
      name: "World's Good Cause Pot (WGCP)",
      allocation: '5.00',
      coinsB: 40.0,
      valueT: '4.0',
      use: 'Unlocks after Stage 7 for global initiatives.',
      color: '#f97316', // orange-500
    },
    {
      name: 'Reward Pot (RP)',
      allocation: '2.58',
      coinsB: 20.64,
      valueT: '2.06',
      use: 'For all 1:1 Bonus and 1:X Rewards during main sale stages.',
      color: '#a855f7', // purple-500
    },
     {
      name: 'India Anti-Corruption Reward Pot',
      allocation: '0.01',
      coinsB: 0.08,
      valueT: '0.008',
      use: 'A special fund for rewarding anti-corruption efforts in India, funded by Stage 1 revenue.',
      color: '#14b8a6', // teal-500
    },
    {
      name: 'Presale & Creator Fund',
      allocation: '0.0002',
      coinsB: 0.0016, // 1,600,000 coins (800k for sale, 800k for bonus)
      valueT: '~0',
      use: '0.0001% for presale, 0.0001% for 1:1 bonus. All proceeds go to the Creator.',
      color: '#fde047', // yellow-300
    }
  ];
