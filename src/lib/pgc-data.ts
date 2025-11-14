
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

const PDP_TOTAL_COINS = 800_000_000_000 * (69.4295 / 100); // Approx 555.436 Billion PGC

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
  // Presale and Early Stages
  calculateStageData(1, 0.02, 1, 2, 0.1, '1:1'),
  calculateStageData(2, 0.02, 1, 2, 0.1, '1:1'),
  calculateStageData(3, 0.05, 1, 2, 0.2, '1:1'),
  calculateStageData(4, 0.1, 1, 2.5, 0.5, '1:0.7'),
  calculateStageData(5, 0.2, 2.5, 5, 1.0, '1:0.6'),
  calculateStageData(6, 0.5, 5, 10, 2.5, '1:0.5'),
  
  // Vote-to-Unlock Stages with new logic
  calculateStageData(7, 0.75, 10, 20, 3.0, '1:0.45'),
  calculateStageData(8, 1.0, 20, 50, 4.0, '1:0.4'),
  calculateStageData(9, 1.0, 50, 100, 4.0, '1:0.35'),
  calculateStageData(10, 1.0, 100, 200, 4.0, '1:0.3'),
  calculateStageData(11, 1.0, 200, 500, 4.0, '1:0.25'),
  calculateStageData(12, 1.0, 500, 1000, 4.0, '1:0.25'),
  calculateStageData(13, 1.0, 1000, 1500, 4.0, '1:0.25'),
  calculateStageData(14, 1.0, 1500, 2000, 4.0, '1:0.25'),
  calculateStageData(15, 1.0, 2000, 3000, 4.0, '1:0.25'),
  calculateStageData(16, 1.0, 3000, 4000, 4.0, '1:0.25'),
  calculateStageData(17, 1.0, 4000, 5000, 4.0, '1:0.25'),
  calculateStageData(18, 1.0, 5000, 7500, 4.0, '1:0.25'),
  calculateStageData(19, 1.0, 7500, 10000, 4.0, '1:0.25'),
  calculateStageData(20, 1.0, 10000, 12500, 4.0, '1:0.25'),
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
      use: 'Holds all PGC designated for the 20-stage public sale.',
      color: '#10b981', // green-500
    },
    {
      name: 'Creator Pot (CP)',
      allocation: 11.00,
      coinsB: 88,
      use: '10% for Public Use, 1% for Creator Self-Use, governed by the community.',
      color: '#ef4444', // red-500
    },
    {
      name: 'Country Wise Pot (CWP)',
      allocation: 10.00,
      coinsB: 80,
      use: 'Funds allocated for development projects decided by country-specific public voting.',
      color: '#f97316', // orange-500
    },
    {
      name: "World's Good Cause Pot (WGCP)",
      allocation: 5.00,
      coinsB: 40,
      use: 'A reserve pot for future global initiatives, also community-governed.',
      color: '#a855f7', // purple-500
    },
    {
      name: 'Reward Pot (RP)',
      allocation: 4.55,
      coinsB: 36.4,
      use: 'A dedicated reserve for all bonus distributions during the 20-stage sale.',
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

// New fund distribution model based on user image
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

