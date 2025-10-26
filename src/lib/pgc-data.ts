
import { PgcSaleStage, PgcPotAllocation } from './types';

const formatCurrency = (value: number) => {
    if (value >= 1e12) {
        return `$${(value / 1e12).toFixed(3)}T`;
    }
    if (value >= 1e9) {
        return `$${(value / 1e9).toFixed(2)}B`;
    }
    if (value >= 1e6) {
        return `$${(value / 1e6).toFixed(2)}M`;
    }
    return `$${value.toLocaleString()}`;
};

const PDP_TOTAL_COINS = 800_000_000_000 * 0.713995; // 571,196,000,000 PGC

const calculateStageData = (
    stage: number,
    percentOfTs: number,
    priceLow: number,
    priceHigh: number,
    pdpReleasePercent: number,
    status: string
): PgcSaleStage => {
    const coinsSoldB = 800 * (percentOfTs / 100);
    const avgPrice = (priceLow + priceHigh) / 2;
    const incomingFundValue = coinsSoldB * 1e9 * avgPrice;
    
    // Calculate PGC released from PDP and its value at the end-of-stage price
    const pdpCoinsReleased = PDP_TOTAL_COINS * (pdpReleasePercent / 100);
    const pdpFundValue = pdpCoinsReleased * priceHigh;

    return {
        stage,
        percentOfTs: `${percentOfTs}%`,
        coinsSoldB,
        priceRange: `$${priceLow.toLocaleString()}-$${priceHigh.toLocaleString()}`,
        incomingFund: formatCurrency(incomingFundValue),
        publicGoodReleasePercent: `${pdpReleasePercent}%`,
        publicGoodFundReleased: formatCurrency(pdpFundValue),
        status,
    };
};

export const pgcSaleStages: PgcSaleStage[] = [
  // Presale and Early Stages
  { stage: 1, percentOfTs: '0.01%', coinsSoldB: 0.08, priceRange: '$1-2', incomingFund: '$120M', publicGoodReleasePercent: '-', publicGoodFundReleased: '-', status: 'Split' },
  { stage: 2, percentOfTs: '0.02%', coinsSoldB: 0.16, priceRange: '$1-2', incomingFund: '$240M', publicGoodReleasePercent: '-', publicGoodFundReleased: '-', status: 'Split' },
  { stage: 3, percentOfTs: '0.05%', coinsSoldB: 0.4, priceRange: '$1-2', incomingFund: '$600M', publicGoodReleasePercent: '-', publicGoodFundReleased: '-', status: 'Split' },
  { stage: 4, percentOfTs: '0.1%', coinsSoldB: 0.8, priceRange: '$1-2.5', incomingFund: '$1.4B', publicGoodReleasePercent: '-', publicGoodFundReleased: '-', status: '' },
  { stage: 5, percentOfTs: '0.2%', coinsSoldB: 1.6, priceRange: '$2.5-5', incomingFund: '$6B', publicGoodReleasePercent: '-', publicGoodFundReleased: '-', status: '' },
  { stage: 6, percentOfTs: '0.5%', coinsSoldB: 4.0, priceRange: '$5-10', incomingFund: '$30B', publicGoodReleasePercent: '-', publicGoodFundReleased: '-', status: '' },
  
  // Vote-to-Unlock Stages with dual funding model
  calculateStageData(7, 1, 10, 20, 10, 'Locked'),
  calculateStageData(8, 1, 20, 50, 8, 'Locked'),
  calculateStageData(9, 1, 50, 100, 7, 'Locked'),
  calculateStageData(10, 1, 100, 200, 6, 'Locked'),
  calculateStageData(11, 1, 200, 500, 5, 'Locked'),
  calculateStageData(12, 1, 500, 1000, 4.5, 'Locked'),
  calculateStageData(13, 1, 1000, 1500, 4, 'Locked'),
  calculateStageData(14, 1, 1500, 2000, 3.5, 'Locked'),
  calculateStageData(15, 1, 2000, 2500, 3, 'Locked'),
  calculateStageData(16, 1, 2500, 3000, 2.5, 'Locked'),
  calculateStageData(17, 1, 3000, 3500, 2.5, 'Locked'),
  calculateStageData(18, 1, 3500, 4000, 2.5, 'Locked'),
  calculateStageData(19, 1, 4000, 4500, 2.5, 'Locked'),
  calculateStageData(20, 1, 4500, 5000, 2.5, 'Locked'),
];


export const pgcPotAllocations: PgcPotAllocation[] = [
    {
      name: 'Public Demand Pot (PDP)',
      allocation: 71.3995,
      coinsB: 571.196,
      use: 'Decided by Public Governance voting. Also funds public good initiatives upon stage completions.',
      color: '#3b82f6', // blue-500
    },
    {
      name: 'Creator Pot (CP)',
      allocation: 11.00,
      coinsB: 88,
      valueT: '8.8',
      use: '10% for Public Use, 1% for Creator Self-Use.',
      color: '#ef4444', // red-500
    },
    {
      name: 'Country Wise Pot (CWP)',
      allocation: 10.00,
      coinsB: 80,
      valueT: '8.0',
      use: 'Decided by country-specific public voting.',
      color: '#22c55e', // green-500
    },
    {
      name: "World's Good Cause Pot (WGCP)",
      allocation: 5.00,
      coinsB: 40,
      valueT: '4.0',
      use: 'A reserve pot for future global initiatives, governed by the community.',
      color: '#f97316', // orange-500
    },
    {
      name: 'Reward Pot (RP)',
      allocation: 2.58,
      coinsB: 20.64,
      valueT: '2.06',
      use: 'A dedicated reserve for all bonus distributions during the 9-stage sale, including compounding split rewards.',
      color: '#a855f7', // purple-500
    },
     {
      name: 'India Anti-Corruption Reward Pot',
      allocation: 0.01,
      coinsB: 0.08,
      valueT: '0.008',
      use: 'A donation-based fund for rewarding anti-corruption efforts in India. The public and organizations can contribute in USDT and other top 10 cryptocurrencies.',
      color: '#64748b', // slate-500
    },
    {
      name: 'Presale Fund',
      allocation: 0.0005,
      coinsB: 0.004, // 4 Million PGC (2M for sale, 2M for bonus)
      use: 'A micro-allocation for the exclusive presale (0.00025% for sale, 0.00025% for 1:1 bonus). Proceeds go to the Creator.',
      color: '#fde047', // yellow-300
    },
    {
      name: 'Presale Affiliate Reward Pot',
      allocation: 0.0000275,
      coinsB: 0.00022, // 220,000 PGC
      use: '11% of the 2M presale coins, reserved for the presale affiliate reward program.',
      color: '#ec4899', // pink-500
    },
    {
      name: 'Presale Influencer Reward Pot',
      allocation: 0.0000125,
      coinsB: 0.0001, // 100,000 PGC
      use: '5% of the 2M presale coins, reserved for the presale influencer reward program.',
      color: '#d946ef', // fuchsia-500
    },
    {
      name: 'Presale Financial Quiz Pot',
      allocation: 0.00001,
      coinsB: 0.00008, // 80,000 PGC
      use: '4% of the 2M presale coins, reserved for the presale financial quiz rewards.',
      color: '#84cc16', // lime-500
    }
  ];
