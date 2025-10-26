
import { PgcSaleStage, PgcPotAllocation } from './types';

export const pgcSaleStages: PgcSaleStage[] = [
  // Presale and Early Stages
  { stage: 1, percentOfTs: '0.01%', coinsSoldB: 0.08, priceRange: '$1-2', incomingFund: '$120M', wgcpReleasePercent: '-', wgcpFundReleased: '-', status: 'Split' },
  { stage: 2, percentOfTs: '0.02%', coinsSoldB: 0.16, priceRange: '$1-2', incomingFund: '$240M', wgcpReleasePercent: '-', wgcpFundReleased: '-', status: 'Split' },
  { stage: 3, percentOfTs: '0.05%', coinsSoldB: 0.4, priceRange: '$1-2', incomingFund: '$600M', wgcpReleasePercent: '-', wgcpFundReleased: '-', status: 'Split' },
  { stage: 4, percentOfTs: '0.1%', coinsSoldB: 0.8, priceRange: '$1-2.5', incomingFund: '$1.4B', wgcpReleasePercent: '-', wgcpFundReleased: '-', status: '' },
  { stage: 5, percentOfTs: '0.2%', coinsSoldB: 1.6, priceRange: '$2.5-5', incomingFund: '$6B', wgcpReleasePercent: '-', wgcpFundReleased: '-', status: '' },
  { stage: 6, percentOfTs: '0.5%', coinsSoldB: 4.0, priceRange: '$5-10', incomingFund: '$30B', wgcpReleasePercent: '-', wgcpFundReleased: '-', status: '' },
  // Vote-to-Unlock Stages
  { stage: 7, percentOfTs: '1%', coinsSoldB: 8.0, priceRange: '$10-20', incomingFund: '$120B', wgcpReleasePercent: '10%', wgcpFundReleased: '$80B', status: 'Locked' },
  { stage: 8, percentOfTs: '1%', coinsSoldB: 8.0, priceRange: '$20-50', incomingFund: '$280B', wgcpReleasePercent: '8%', wgcpFundReleased: '$160B', status: 'Locked' },
  { stage: 9, percentOfTs: '1%', coinsSoldB: 8.0, priceRange: '$50-100', incomingFund: '$600B', wgcpReleasePercent: '7%', wgcpFundReleased: '$280B', status: 'Locked' },
  { stage: 10, percentOfTs: '1%', coinsSoldB: 8.0, priceRange: '$100-200', incomingFund: '$1.2T', wgcpReleasePercent: '6%', wgcpFundReleased: '$480B', status: 'Locked' },
  { stage: 11, percentOfTs: '1%', coinsSoldB: 8.0, priceRange: '$200-500', incomingFund: '$2.8T', wgcpReleasePercent: '5%', wgcpFundReleased: '$1T', status: 'Locked' },
  { stage: 12, percentOfTs: '1%', coinsSoldB: 8.0, priceRange: '$500-1k', incomingFund: '$6T', wgcpReleasePercent: '4.5%', wgcpFundReleased: '$1.8T', status: 'Locked' },
  { stage: 13, percentOfTs: '1%', coinsSoldB: 8.0, priceRange: '$1k-1.5k', incomingFund: '$10T', wgcpReleasePercent: '4%', wgcpFundReleased: '$2.4T', status: 'Locked' },
  { stage: 14, percentOfTs: '1%', coinsSoldB: 8.0, priceRange: '$1.5k-2k', incomingFund: '$14T', wgcpReleasePercent: '3.5%', wgcpFundReleased: '$2.8T', status: 'Locked' },
  { stage: 15, percentOfTs: '1%', coinsSoldB: 8.0, priceRange: '$2k-2.5k', incomingFund: '$18T', wgcpReleasePercent: '3%', wgcpFundReleased: '$3T', status: 'Locked' },
  { stage: 16, percentOfTs: '1%', coinsSoldB: 8.0, priceRange: '$2.5k-3k', incomingFund: '$22T', wgcpReleasePercent: '2.5%', wgcpFundReleased: '$3T', status: 'Locked' },
  { stage: 17, percentOfTs: '1%', coinsSoldB: 8.0, priceRange: '$3k-3.5k', incomingFund: '$26T', wgcpReleasePercent: '2.5%', wgcpFundReleased: '$3.5T', status: 'Locked' },
  { stage: 18, percentOfTs: '1%', coinsSoldB: 8.0, priceRange: '$3.5k-4k', incomingFund: '$30T', wgcpReleasePercent: '2.5%', wgcpFundReleased: '$4T', status: 'Locked' },
  { stage: 19, percentOfTs: '1%', coinsSoldB: 8.0, priceRange: '$4k-4.5k', incomingFund: '$34T', wgcpReleasePercent: '2.5%', wgcpFundReleased: '$4.5T', status: 'Locked' },
  { stage: 20, percentOfTs: '1%', coinsSoldB: 8.0, priceRange: '$4.5k-5k', incomingFund: '$38T', wgcpReleasePercent: '2.5%', wgcpFundReleased: '$5T', status: 'Locked' },
];


export const pgcPotAllocations: PgcPotAllocation[] = [
    {
      name: 'Public Demand Pot (PDP)',
      allocation: 71.3995,
      coinsB: 571.196,
      use: 'Decided by Public Governance voting.',
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
      use: 'Unlocks after Stage 7 for global initiatives.',
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
