
import { PgcSaleStage, PgcPotAllocation, FundDistribution } from './types';

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

const PDP_TOTAL_COINS = 800_000_000_000 * (51.2795 / 100);

const calculateStageData = (
    stage: number,
    percentOfTs: number,
    priceLow: number,
    priceHigh: number,
    pdpReleasePercent: number,
    bonusRatio: string
): PgcSaleStage => {
    const coinsForSale = 800_000_000_000 * (percentOfTs / 100);
    const avgPrice = (priceLow + priceHigh) / 2;
    const incomingFundValue = coinsForSale * avgPrice;
    
    const pdpCoinsReleased = PDP_TOTAL_COINS * (pdpReleasePercent / 100);
    const pdpFundValue = pdpCoinsReleased * priceHigh;

    return {
        stage,
        percentOfTs: `${percentOfTs}%`,
        priceRange: `$${priceLow.toLocaleString()}-${priceHigh.toLocaleString()}`,
        incomingFundValue,
        incomingFund: formatCurrency(incomingFundValue),
        pdpReleasePercent: `${pdpReleasePercent}%`,
        pdpFundValue,
        pdpFundReleased: formatCurrency(pdpFundValue),
        bonusRatio,
        status: 'Locked',
    };
};

export const pgcSaleStages: PgcSaleStage[] = [
  calculateStageData(1, 0.1, 1, 2, 0.1, '1:1'),
  calculateStageData(2, 0.1, 2, 3, 0.1, '1:1'),
  calculateStageData(3, 0.2, 3, 5, 0.2, '1:1'),
  calculateStageData(4, 0.5, 5, 10, 0.5, '1:0.7'),
  calculateStageData(5, 1.0, 10, 20, 1.0, '1:0.6'),
  calculateStageData(6, 2.5, 20, 50, 2.5, '1:0.5'),
  calculateStageData(7, 0.75, 50, 100, 3.0, '1:0.45'),
  calculateStageData(8, 1.0, 100, 200, 4.0, '1:0.4'),
  calculateStageData(9, 1.0, 200, 300, 4.0, '1:0.35'),
  calculateStageData(10, 1.0, 300, 400, 4.0, '1:0.3'),
  calculateStageData(11, 1.0, 400, 500, 4.0, '1:0.25'),
  calculateStageData(12, 1.0, 500, 750, 4.0, '1:0.25'),
  calculateStageData(13, 0.75, 750, 1000, 3.0, '1:0.25'),
  calculateStageData(14, 0.75, 1000, 2500, 3.0, '1:0.25'),
  calculateStageData(15, 0.75, 2500, 5000, 3.0, '1:0.25'),
  calculateStageData(16, 0.5, 5000, 10000, 2.0, '1:0.25'),
  calculateStageData(17, 0.5, 10000, 25000, 2.0, '1:0.25'),
  calculateStageData(18, 0.5, 25000, 50000, 2.0, '1:0.25'),
  calculateStageData(19, 0.5, 50000, 75000, 2.0, '1:0.25'),
  calculateStageData(20, 0.5, 75000, 100000, 2.0, '1:0.25'),
  calculateStageData(21, 0.25, 100000, 200000, 1.0, '1:0.25'),
  calculateStageData(22, 0.25, 200000, 300000, 1.0, '1:0.25'),
  calculateStageData(23, 0.25, 300000, 400000, 1.0, '1:0.25'),
  calculateStageData(24, 0.25, 400000, 500000, 1.0, '1:0.25'),
  calculateStageData(25, 0.25, 500000, 600000, 1.0, '1:0.25'),
  calculateStageData(26, 0.25, 600000, 700000, 1.0, '1:0.25'),
  calculateStageData(27, 0.25, 700000, 800000, 1.0, '1:0.25'),
  calculateStageData(28, 0.25, 800000, 900000, 1.0, '1:0.25'),
  calculateStageData(29, 0.25, 900000, 1000000, 1.0, '1:0.25'),
  calculateStageData(30, 0.25, 1000000, 1000000, 1.0, '1:0.25'), // Final stage ends at 1M
];

// Set status for initial stages
pgcSaleStages[0].status = 'Split';
pgcSaleStages[1].status = 'Split';
pgcSaleStages[2].status = 'Split';

export const pgcPotAllocations: PgcPotAllocation[] = [
    {
      name: 'Public Demand Pot (PDP)',
      allocation: 51.2795,
      coinsB: 410.236,
      use: 'The largest community-governed fund, unlocked in stages and allocated via public voting.',
      color: '#3b82f6', // blue-500
    },
    {
      name: 'Token Sale Pot',
      allocation: 18.15,
      coinsB: 145.2,
      use: 'Holds all PGC designated for the public sale stages.',
      color: '#10b981', // green-500
    },
    {
      name: 'Creator Pot (CP)',
      allocation: 11.0,
      coinsB: 88.0,
      use: 'Funds reserved for the original creators and ongoing development of the platform.',
      color: '#ef4444', // red-500
    },
    {
      name: 'Country Wise Pot (CWP)',
      allocation: 10.0,
      coinsB: 80.0,
      use: 'Funds distributed to countries based on their user base and economic need.',
      color: '#f97316', // orange-500
    },
    {
      name: "World's Good Cause Pot (WGCP)",
      allocation: 5.0,
      coinsB: 40.0,
      use: 'A reserve pot for global initiatives, community-governed. Includes Peace, Environment, and Strategic Resources.',
      color: '#a855f7', // purple-500
    },
    {
      name: 'Reward Pot (RP)',
      allocation: 4.55,
      coinsB: 36.4,
      use: 'A dedicated reserve for all bonus distributions during the token sale.',
      color: '#fde047', // yellow-400
    },
    {
      name: 'India Anti-Corruption Pot',
      allocation: 0.01,
      coinsB: 0.08,
      use: 'A donation-based fund for rewarding anti-corruption efforts in India.',
      color: '#64748b', // slate-500
    },
    {
      name: 'Presale Fund',
      allocation: 0.0005,
      coinsB: 0.004, 
      use: 'Micro-allocation for the exclusive presale (2M PGC for sale, 2M for 1:1 bonus).',
      color: '#ec4899', // pink-500
    },
];

export const fundDistributionModel: FundDistribution[] = [
  { category: 'International', percentage: 12 },
  { category: 'National', percentage: 10 },
  { category: 'State', percentage: 10 },
  { category: 'District', percentage: 4 },
  { category: 'Taluka', percentage: 4 },
  { category: 'Kasaba/Block', percentage: 4 },
  { category: 'Village', percentage: 6 },
  { category: 'Street', percentage: 15 },
  { category: 'Family', percentage: 20 },
  { category: 'Entertainment', percentage: 3 },
  { category: 'Community', percentage: 3 },
  { category: 'Health', percentage: 3 },
  { category: 'Environment', percentage: 3 },
  { category: 'Team', percentage: 3 },
  { category: 'Interest', percentage: 3 },
];

