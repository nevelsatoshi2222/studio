








import {
  Transaction,
  User,
  TradingPair,
  Order,
  Trade,
  StakedPosition,
  LockDuration,
  TokenStage,
  QuizQuestion,
  Cause,
  VotingPoll,
  IndiaIssuePoll,
  EcommCategory,
  EcommProduct,
  SocialPost,
  CoinPackage,
  AdminAllocation,
  SportsAndArtsItem,
  CompetitionPhase,
  SportsItem,
  ArtItem,
  AirdropReward,
  FundAllocation,
  AffiliateRewardTier,
  LevelCommission
} from './types';
import { placeholderImages } from './placeholder-images.json';
import { Users as UsersIcon, Star, Award, Gem, Shield, Crown, UserPlus } from 'lucide-react';


export const users: User[] = [
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

export const tradingPairs: TradingPair[] = [
  { from: 'PGC', to: 'USDT' },
  { from: 'PGC', to: 'ETH' },
  { from: 'PGC', to: 'BTC' },
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
  { from: 'WORK', to: 'USDT' },
  { from: 'WORK', to: 'ETH' },
  { from: 'WORK', to: 'BTC' },
  { from: 'Quiz', to: 'USDT' },
  { from: 'Quiz', to: 'ETH' },
  { from: 'Quiz', to: 'BTC' },
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
    { stage: 1, supplyPercentage: 0.1, status: 'Active', unfreezesIn: '' },
    { stage: 2, supplyPercentage: 0.2, status: 'Locked', unfreezesIn: '' },
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
  { value: 1, unit: 'year', label: '1 Year' },
  { value: 2, unit: 'year', label: '2 Years' },
  { value: 3, unit: 'year', label: '3 Years' },
  { value: 0, unit: 'stage', label: 'Till this stage complete' },
  { value: 1, unit: 'stage', label: 'Till this stage and next stage complete' },
  { value: 2, unit: 'stage', label: 'Till this stage and next 2 stages complete' },
  { value: 3, unit: 'stage', label: 'Till this stage and next 3 stages complete' },
  { value: 5, unit: 'stage', label: 'Till this stage and next 5 stages complete' },
];


export const stakedPositions: StakedPosition[] = [
  { id: 'stake1', asset: 'IGC', amount: 5000, startDate: '2024-01-10', endDate: '2025-01-10', durationMonths: 12, status: 'Staked' },
  { id: 'stake2', asset: 'ITC', amount: 10000, startDate: '2023-12-01', endDate: '2025-12-01', durationMonths: 24, status: 'Staked' },
  { id: 'stake3', asset: 'ICE', amount: 2500, startDate: '2024-03-15', endDate: '2024-09-15', durationMonths: 6, status: 'Staked' },
  { id: 'stake4', asset: 'Quiz', amount: 800, startDate: '2023-11-20', endDate: '2024-05-20', durationMonths: 6, status: 'Unstaked' },
];

export const countries = [
    { value: 'AFG', label: 'Afghanistan' },
    { value: 'ALA', label: 'Åland Islands' },
    { value: 'ALB', label: 'Albania' },
    { value: 'DZA', label: 'Algeria' },
    { value: 'ASM', label: 'American Samoa' },
    { value: 'AND', label: 'Andorra' },
    { value: 'AGO', label: 'Angola' },
    { value: 'AIA', label: 'Anguilla' },
    { value: 'ATA', label: 'Antarctica' },
    { value: 'ATG', label: 'Antigua and Barbuda' },
    { value: 'ARG', label: 'Argentina' },
    { value: 'ARM', label: 'Armenia' },
    { value: 'ABW', label: 'Aruba' },
    { value: 'AUS', label: 'Australia' },
    { value: 'AUT', label: 'Austria' },
    { value: 'AZE', label: 'Azerbaijan' },
    { value: 'BHS', label: 'Bahamas' },
    { value: 'BHR', label: 'Bahrain' },
    { value: 'BGD', label: 'Bangladesh' },
    { value: 'BRB', label: 'Barbados' },
    { value: 'BLR', label: 'Belarus' },
    { value: 'BEL', label: 'Belgium' },
    { value: 'BLZ', label: 'Belize' },
    { value: 'BEN', label: 'Benin' },
    { value: 'BMU', label: 'Bermuda' },
    { value: 'BTN', label: 'Bhutan' },
    { value: 'BOL', label: 'Bolivia' },
    { value: 'BES', label: 'Bonaire, Sint Eustatius and Saba' },
    { value: 'BIH', label: 'Bosnia and Herzegovina' },
    { value: 'BWA', label: 'Botswana' },
    { value: 'BVT', label: 'Bouvet Island' },
    { value: 'BRA', label: 'Brazil' },
    { value: 'IOT', label: 'British Indian Ocean Territory' },
    { value: 'BRN', label: 'Brunei Darussalam' },
    { value: 'BGR', label: 'Bulgaria' },
    { value: 'BFA', label: 'Burkina Faso' },
    { value: 'BDI', label: 'Burundi' },
    { value: 'KHM', label: 'Cambodia' },
    { value: 'CMR', label: 'Cameroon' },
    { value: 'CAN', label: 'Canada' },
    { value: 'CPV', label: 'Cape Verde' },
    { value: 'CYM', label: 'Cayman Islands' },
    { value: 'CAF', label: 'Central African Republic' },
    { value: 'TCD', label: 'Chad' },
    { value: 'CHL', label: 'Chile' },
    { value: 'CHN', label: 'China' },
    { value: 'CXR', label: 'Christmas Island' },
    { value: 'CCK', label: 'Cocos (Keeling) Islands' },
    { value: 'COL', label: 'Colombia' },
    { value: 'COM', label: 'Comoros' },
    { value: 'COG', label: 'Congo' },
    { value: 'COD', label: 'Congo, Democratic Republic of the' },
    { value: 'COK', label: 'Cook Islands' },
    { value: 'CRI', label: 'Costa Rica' },
    { value: 'CIV', label: 'Côte d\'Ivoire' },
    { value: 'HRV', label: 'Croatia' },
    { value: 'CUB', label: 'Cuba' },
    { value: 'CUW', label: 'Curaçao' },
    { value: 'CYP', label: 'Cyprus' },
    { value: 'CZE', label: 'Czech Republic' },
    { value: 'DNK', label: 'Denmark' },
    { value: 'DJI', label: 'Djibouti' },
    { value: 'DMA', label: 'Dominica' },
    { value: 'DOM', label: 'Dominican Republic' },
    { value: 'ECU', label: 'Ecuador' },
    { value: 'EGY', label: 'Egypt' },
    { value: 'SLV', label: 'El Salvador' },
    { value: 'GNQ', label: 'Equatorial Guinea' },
    { value: 'ERI', label: 'Eritrea' },
    { value: 'EST', label: 'Estonia' },
    { value: 'ETH', label: 'Ethiopia' },
    { value: 'FLK', label: 'Falkland Islands (Malvinas)' },
    { value: 'FRO', label: 'Faroe Islands' },
    { value: 'FJI', label: 'Fiji' },
    { value: 'FIN', label: 'Finland' },
    { value: 'FRA', label: 'France' },
    { value: 'GUF', label: 'French Guiana' },
    { value: 'PYF', label: 'French Polynesia' },
    { value: 'ATF', label: 'French Southern Territories' },
    { value: 'GAB', label: 'Gabon' },
    { value: 'GMB', label: 'Gambia' },
    { value: 'GEO', label: 'Georgia' },
    { value: 'DEU', label: 'Germany' },
    { value: 'GHA', label: 'Ghana' },
    { value: 'GIB', label: 'Gibraltar' },
    { value: 'GRC', label: 'Greece' },
    { value: 'GRL', label: 'Greenland' },
    { value: 'GRD', label: 'Grenada' },
    { value: 'GLP', label: 'Guadeloupe' },
    { value: 'GUM', label: 'Guam' },
    { value: 'GTM', label: 'Guatemala' },
    { value: 'GGY', label: 'Guernsey' },
    { value: 'GIN', label: 'Guinea' },
    { value: 'GNB', label: 'Guinea-Bissau' },
    { value: 'GUY', label: 'Guyana' },
    { value: 'HTI', label: 'Haiti' },
    { value: 'HMD', label: 'Heard Island and McDonald Islands' },
    { value: 'HND', label: 'Honduras' },
    { value: 'HKG', label: 'Hong Kong' },
    { value: 'HUN', label: 'Hungary' },
    { value: 'ISL', label: 'Iceland' },
    { value: 'IND', label: 'India' },
    { value: 'IDN', label: 'Indonesia' },
    { value: 'IRN', label: 'Iran, Islamic Republic of' },
    { value: 'IRQ', label: 'Iraq' },
    { value: 'IRL', label: 'Ireland' },
    { value: 'IMN', label: 'Isle of Man' },
    { value: 'ISR', label: 'Israel' },
    { value: 'ITA', label: 'Italy' },
    { value: 'JAM', label: 'Jamaica' },
    { value: 'JPN', label: 'Japan' },
    { value: 'JEY', label: 'Jersey' },
    { value: 'JOR', label: 'Jordan' },
    { value: 'KAZ', label: 'Kazakhstan' },
    { value: 'KEN', label: 'Kenya' },
    { value: 'KIR', label: 'Kiribati' },
    { value: 'PRK', label: 'Korea, Democratic People\'s Republic of' },
    { value: 'KOR', label: 'Korea, Republic of' },
    { value: 'KWT', label: 'Kuwait' },
    { value: 'KGZ', label: 'Kyrgyzstan' },
    { value: 'LAO', label: 'Lao People\'s Democratic Republic' },
    { value: 'LVA', label: 'Latvia' },
    { value: 'LBN', label: 'Lebanon' },
    { value: 'LSO', label: 'Lesotho' },
    { value: 'LBR', label: 'Liberia' },
    { value: 'LBY', label: 'Libya' },
    { value: 'LIE', label: 'Liechtenstein' },
    { value: 'LTU', label: 'Lithuania' },
    { value: 'LUX', label: 'Luxembourg' },
    { value: 'MAC', label: 'Macao' },
    { value: 'MKD', label: 'Macedonia, the former Yugoslav Republic of' },
    { value: 'MDG', label: 'Madagascar' },
    { value: 'MWI', label: 'Malawi' },
    { value: 'MYS', label: 'Malaysia' },
    { value: 'MDV', label: 'Maldives' },
    { value: 'MLI', label: 'Mali' },
    { value: 'MLT', label: 'Malta' },
    { value: 'MHL', label: 'Marshall Islands' },
    { value: 'MTQ', label: 'Martinique' },
    { value: 'MRT', label: 'Mauritania' },
    { value: 'MUS', label: 'Mauritius' },
    { value: 'MYT', label: 'Mayotte' },
    { value: 'MEX', label: 'Mexico' },
    { value: 'FSM', label: 'Micronesia, Federated States of' },
    { value: 'MDA', label: 'Moldova, Republic of' },
    { value: 'MCO', label: 'Monaco' },
    { value: 'MNG', label: 'Mongolia' },
    { value: 'MNE', label: 'Montenegro' },
    { value: 'MSR', label: 'Montserrat' },
    { value: 'MAR', label: 'Morocco' },
    { value: 'MOZ', label: 'Mozambique' },
    { value: 'MMR', label: 'Myanmar' },
    { value: 'NAM', label: 'Namibia' },
    { value: 'NRU', label: 'Nauru' },
    { value: 'NPL', label: 'Nepal' },
    { value: 'NLD', label: 'Netherlands' },
    { value: 'NCL', label: 'New Caledonia' },
    { value: 'NZL', label: 'New Zealand' },
    { value: 'NIC', label: 'Nicaragua' },
    { value: 'NER', label: 'Niger' },
    { value: 'NGA', label: 'Nigeria' },
    { value: 'NIU', label: 'Niue' },
    { value: 'NFK', label: 'Norfolk Island' },
    { value: 'MNP', label: 'Northern Mariana Islands' },
    { value: 'NOR', label: 'Norway' },
    { value: 'OMN', label: 'Oman' },
    { value: 'PAK', label: 'Pakistan' },
    { value: 'PLW', label: 'Palau' },
    { value: 'PSE', label: 'Palestinian Territory, Occupied' },
    { value: 'PAN', label: 'Panama' },
    { value: 'PNG', label: 'Papua New Guinea' },
    { value: 'PRY', label: 'Paraguay' },
    { value: 'PER', label: 'Peru' },
    { value: 'PHL', label: 'Philippines' },
    { value: 'PCN', label: 'Pitcairn' },
    { value: 'POL', label: 'Poland' },
    { value: 'PRT', label: 'Portugal' },
    { value: 'PRI', label: 'Puerto Rico' },
    { value: 'QAT', label: 'Qatar' },
    { value: 'REU', label: 'Réunion' },
    { value: 'ROU', label: 'Romania' },
    { value: 'RUS', label: 'Russian Federation' },
    { value: 'RWA', label: 'Rwanda' },
    { value: 'BLM', label: 'Saint Barthélemy' },
    { value: 'SHN', label: 'Saint Helena, Ascension and Tristan da Cunha' },
    { value: 'KNA', label: 'Saint Kitts and Nevis' },
    { value: 'LCA', label: 'Saint Lucia' },
    { value: 'MAF', label: 'Saint Martin (French part)' },
    { value: 'SPM', label: 'Saint Pierre and Miquelon' },
    { value: 'VCT', label: 'Saint Vincent and the Grenadines' },
    { value: 'WSM', label: 'Samoa' },
    { value: 'SMR', label: 'San Marino' },
    { value: 'STP', label: 'Sao Tome and Principe' },
    { value: 'SAU', label: 'Saudi Arabia' },
    { value: 'SEN', label: 'Senegal' },
    { value: 'SRB', label: 'Serbia' },
    { value: 'SYC', label: 'Seychelles' },
    { value: 'SLE', label: 'Sierra Leone' },
    { value: 'SGP', label: 'Singapore' },
    { value: 'SXM', label: 'Sint Maarten (Dutch part)' },
    { value: 'SVK', label: 'Slovakia' },
    { value: 'SVN', label: 'Slovenia' },
    { value: 'SLB', label: 'Solomon Islands' },
    { value: 'SOM', label: 'Somalia' },
    { value: 'ZAF', label: 'South Africa' },
    { value: 'SGS', label: 'South Georgia and the South Sandwich Islands' },
    { value: 'SSD', label: 'South Sudan' },
    { value: 'ESP', label: 'Spain' },
    { value: 'LKA', label: 'Sri Lanka' },
    { value: 'SDN', label: 'Sudan' },
    { value: 'SUR', label: 'Suriname' },
    { value: 'SJM', label: 'Svalbard and Jan Mayen' },
    { value: 'SWZ', label: 'Swaziland' },
    { value: 'SWE', label: 'Sweden' },
    { value: 'CHE', label: 'Switzerland' },
    { value: 'SYR', label: 'Syrian Arab Republic' },
    { value: 'TWN', label: 'Taiwan, Province of China' },
    { value: 'TJK', label: 'Tajikistan' },
    { value: 'TZA', label: 'Tanzania, United Republic of' },
    { value: 'THA', label: 'Thailand' },
    { value: 'TLS', label: 'Timor-Leste' },
    { value: 'TGO', label: 'Togo' },
    { value: 'TKL', label: 'Tokelau' },
    { value: 'TON', label: 'Tonga' },
    { value: 'TTO', label: 'Trinidad and Tobago' },
    { value: 'TUN', label: 'Tunisia' },
    { value: 'TUR', label: 'Turkey' },
    { value: 'TKM', label: 'Turkmenistan' },
    { value: 'TCA', label: 'Turks and Caicos Islands' },
    { value: 'TUV', label: 'Tuvalu' },
    { value: 'UGA', label: 'Uganda' },
    { value: 'UKR', label: 'Ukraine' },
    { value: 'ARE', label: 'United Arab Emirates' },
    { value: 'GBR', label: 'United Kingdom' },
    { value: 'USA', label: 'United States' },
    { value: 'UMI', label: 'United States Minor Outlying Islands' },
    { value: 'URY', label: 'Uruguay' },
    { value: 'UZB', label: 'Uzbekistan' },
    { value: 'VUT', label: 'Vanuatu' },
    { value: 'VEN', label: 'Venezuela, Bolivarian Republic of' },
    { value: 'VNM', label: 'Viet Nam' },
    { value: 'VGB', label: 'Virgin Islands, British' },
    { value: 'VIR', label: 'Virgin Islands, U.S.' },
    { value: 'WLF', label: 'Wallis and Futuna' },
    { value: 'ESH', label: 'Western Sahara' },
    { value: 'YEM', label: 'Yemen' },
    { value: 'ZMB', label: 'Zambia' },
    { value: 'ZWE', label: 'Zimbabwe' }
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

export const publicGovernancePoll = {
    title: "Public Governance: A New Constitution",
    description: `WE WANT A NEW "IDEA, THOUGHT, STRATEGY" DRIVEN DEMOCRACY BY VOTING OF ALL PUBLIC (OF THAT AREA). "NO DEMOCRACY BY LEADERS". HERE I WANT TO ACCEPT THIS ALL THOUGHTS AND LETS DISCUSS AND MAKE NEW IDEOLOGY FOR LIVING. GIVE OPTION 0 TO 100% ACEECPTING OPTION AS IN VOTING .THIS IS THE 1ST IN INDIA NATION VOTING ISSUE.`,
    solutions: [
        { text: "NEW LAW AND ORDER" },
        { text: "NEW JUDICIARY SYSTEM" },
        { text: "NEW EDUCATION SYSTEM ( MORE PRACTICAL BASE )" },
        { text: "NEW TRAFFIC RULES AND DRIVING LICENCE RULLES. HERE I WANT TO ACCEPT THIS ALL THOUGHTS AND LETS DISCUSS AND MAKE NEW IDEOLOGY FOR LIVING. GIVE OPTION 0 TO 100% ACEECPTING OPTION AS IN VOTING .THIS IS THE 1ST IN INDIA NATION VOTING ISSUE." }
    ]
};

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

export const indiaIssuesPolls: IndiaIssuePoll[] = [
    {
        id: 'india-public-governance',
        title: 'Public Governance: A New Model of Democracy',
        description: 'We want a new "Idea, Thought, Strategy" driven democracy, decided by public vote, not by leaders. Let\'s discuss and create a new ideology for living.',
        solutions: [
            { id: 'sol-pg-1', text: 'New Law and Order', results: [] },
            { id: 'sol-pg-2', text: 'New Judiciary System', results: [] },
            { id: 'sol-pg-3', text: 'New Education System (More Practical Based)', results: [] },
            { id: 'sol-pg-4', text: 'New Traffic Rules and Driving License Rules', results: [] },
        ],
    },
    {
        id: 'india-unemployment',
        title: 'Tackling Unemployment',
        description: 'Millions of educated youth in India lack suitable jobs. Which approaches should be prioritized?',
        solutions: [
            { id: 'sol-1-1', text: 'Promote skill-based education aligned with industries.', results: [] },
            { id: 'sol-1-2', text: 'Support startups & MSMEs through easy loans and tax relief.', results: [] },
            { id: 'sol-1-3', text: 'Expand vocational training via digital platforms (e.g., Skill India 2.0).', results: [] },
            { id: 'sol-1-4', text: 'Encourage green jobs in renewable energy and EV sectors.', results: [] },
        ],
    },
    {
        id: 'india-corruption',
        title: 'Reducing Corruption',
        description: 'Corruption is a major issue due to weak enforcement and bureaucratic delays. What are the best solutions?',
        solutions: [
            { id: 'sol-2-1', text: 'Enforce real-time e-governance and digital payments.', results: [] },
            { id: 'sol-2-2', text: 'Strengthen Lokpal/Lokayukta and whistleblower protection laws.', results: [] },
            { id: 'sol-2-3', text: 'Encourage blockchain-based transparency in government tenders.', results: [] },
        ],
    },
    {
        id: 'india-poverty',
        title: 'Alleviating Poverty',
        description: 'Over 20 crore people live below the poverty line. What is the best strategy to lift them out?',
        solutions: [
            { id: 'sol-3-1', text: 'Direct cash transfer (DBT) and food subsidies to genuine beneficiaries.', results: [] },
            { id: 'sol-3-2', text: 'Encourage micro-enterprises and self-help groups (SHGs).', results: [] },
            { id: 'sol-3-3', text: 'Affordable housing, healthcare, and education reforms.', results: [] },
        ],
    },
    {
        id: 'india-education',
        title: 'Improving Education Quality',
        description: 'The education system often focuses on rote learning. What is the best way to improve it?',
        solutions: [
            { id: 'sol-4-1', text: 'Introduce AI-driven smart classrooms in government schools.', results: [] },
            { id: 'sol-4-2', text: 'Focus on critical thinking & digital literacy.', results: [] },
            { id: 'sol-4-3', text: 'Improve teacher training and reduce dropouts with incentives.', results: [] },
        ],
    },
    {
        id: 'india-population',
        title: 'Managing Population Growth',
        description: 'Rapid population growth strains national resources. Which strategy is most effective?',
        solutions: [
            { id: 'sol-5-1', text: 'Awareness campaigns on family planning.', results: [] },
            { id: 'sol-5-2', text: 'Free contraceptives and women’s health services.', results: [] },
            { id: 'sol-5-3', text: 'Empower women through education and employment.', results: [] },
        ],
    },
    {
        id: 'india-healthcare',
        title: 'Addressing Healthcare Deficiency',
        description: 'Rural areas lack access to adequate hospitals and doctors. What is the best immediate solution?',
        solutions: [
            { id: 'sol-6-1', text: 'Expand telemedicine and mobile clinics.', results: [] },
            { id: 'sol-6-2', text: 'Promote Ayushman Bharat with local partnerships.', results: [] },
            { id: 'sol-6-3', text: 'Increase public health spending to 3–5% of GDP.', results: [] },
        ],
    },
    {
        id: 'india-pollution',
        title: 'Combating Pollution & Environmental Degradation',
        description: 'Air, water, and soil pollution are at alarming levels. What should be the top priority?',
        solutions: [
            { id: 'sol-7-1', text: 'Promote electric vehicles (EVs) and renewable energy.', results: [] },
            { id: 'sol-7-2', text: 'Strict industrial emission laws.', results: [] },
            { id: 'sol-7-3', text: 'Encourage tree plantation and waste segregation at source.', results: [] },
        ],
    },
    {
        id: 'india-water',
        title: 'Tackling Water Scarcity',
        description: 'India faces depleting groundwater and frequent droughts. Which solution is most impactful?',
        solutions: [
            { id: 'sol-8-1', text: 'Rainwater harvesting mandatory for all buildings.', results: [] },
            { id: 'sol-8-2', text: 'River-linking and watershed development projects.', results: [] },
            { id: 'sol-8-3', text: 'Promote drip irrigation for farmers.', results: [] },
        ],
    },
    {
        id: 'india-women-safety',
        title: 'Improving Women Safety & Gender Inequality',
        description: 'Harassment and unequal opportunities persist. Which actions are most critical?',
        solutions: [
            { id: 'sol-9-1', text: 'Fast-track courts for crimes against women.', results: [] },
            { id: 'sol-9-2', text: 'Promote women-led entrepreneurship.', results: [] },
            { id: 'sol-9-3', text: 'Equal pay laws and digital safety campaigns.', results: [] },
        ],
    },
    {
        id: 'india-farmer-distress',
        title: 'Solving Farmer Distress',
        description: 'Farmers face low income, debt, and crop failures. What is the most effective support?',
        solutions: [
            { id: 'sol-10-1', text: 'MSP reform and crop insurance coverage.', results: [] },
            { id: 'sol-10-2', text: 'Promote organic & smart farming technologies.', results: [] },
            { id: 'sol-10-3', text: 'Strengthen direct-to-market farmer e-platforms.', results: [] },
        ],
    },
    {
        id: 'india-infrastructure',
        title: 'Closing Infrastructure Gaps',
        description: 'Poor roads, transport, and logistics hinder growth. How should we prioritize investment?',
        solutions: [
            { id: 'sol-11-1', text: 'Integrate Smart City and PM Gati Shakti projects.', results: [] },
            { id: 'sol-11-2', text: 'Private-public partnership (PPP) in infrastructure.', results: [] },
            { id: 'sol-11-3', text: 'Encourage electric public transport and smart grids.', results: [] },
        ],
    },
    {
        id: 'india-judicial-delays',
        title: 'Reducing Judicial Delays',
        description: 'Crores of court cases are pending, denying timely justice. What is the best reform?',
        solutions: [
            { id: 'sol-12-1', text: 'Increase number of judges & fast-track courts.', results: [] },
            { id: 'sol-12-2', text: 'Use AI-based legal document management.', results: [] },
            { id: 'sol-12-3', text: 'Promote online hearings for small cases.', results: [] },
        ],
    },
    {
        id: 'india-black-money',
        title: 'Curbing Black Money',
        description: 'A parallel cash economy weakens the formal system. Which measure is most effective?',
        solutions: [
            { id: 'sol-13-1', text: 'Promote UPI, digital rupee (CBDC).', results: [] },
            { id: 'sol-13-2', text: 'Stronger income tracking and cross-border cooperation.', results: [] },
            { id: 'sol-13-3', text: 'Reward honest taxpayers.', results: [] },
        ],
    },
    {
        id: 'india-discrimination',
        title: 'Fighting Caste & Religious Discrimination',
        description: 'Discrimination divides society and politics. What is the most constructive approach?',
        solutions: [
            { id: 'sol-14-1', text: 'Promote inter-caste education & employment programs.', results: [] },
            { id: 'sol-14-2', text: 'Strict action against hate speech and violence.', results: [] },
            { id: 'sol-14-3', text: 'Encourage unity through community development.', results: [] },
        ],
    },
    {
        id: 'india-inflation',
        title: 'Controlling Inflation',
        description: 'The rising cost of living affects middle and poor classes. How can the government provide relief?',
        solutions: [
            { id: 'sol-15-1', text: 'Control supply chains and reduce hoarding.', results: [] },
            { id: 'sol-15-2', text: 'Boost domestic manufacturing (Make in India).', results: [] },
            { id: 'sol-15-3', text: 'Smart subsidies for essential goods.', results: [] },
        ],
    },
    {
        id: 'india-crime',
        title: 'Improving Crime & Law Enforcement',
        description: 'Police infrastructure is often weak and outdated. What is the most needed upgrade?',
        solutions: [
            { id: 'sol-16-1', text: 'Modernize police with body cams & digital record systems.', results: [] },
            { id: 'sol-16-2', text: 'Recruit & train more police personnel.', results: [] },
            { id: 'sol-16-3', text: 'Community policing for trust building.', results: [] },
        ],
    },
    {
        id: 'india-energy',
        title: 'Solving the Energy Crisis',
        description: 'India is heavily dependent on coal and energy imports. What is the path to energy independence?',
        solutions: [
            { id: 'sol-17-1', text: 'Expand solar, wind, and hydro capacity.', results: [] },
            { id: 'sol-17-2', text: 'Encourage EV adoption with battery recycling.', results: [] },
            { id: 'sol-17-3', text: 'Promote energy efficiency in industries and homes.', results: [] },
        ],
    },
    {
        id: 'india-urbanization',
        title: 'Managing Urbanization & Slums',
        description: 'Unplanned growth of cities leads to overcrowding and slums. What is the best urban planning strategy?',
        solutions: [
            { id: 'sol-18-1', text: 'Develop smart satellite towns.', results: [] },
            { id: 'sol-18-2', text: 'Affordable housing & rental reforms.', results: [] },
            { id: 'sol-18-3', text: 'Improve waste management and sanitation.', results: [] },
        ],
    },
    {
        id: 'india-transportation',
        title: 'Fixing Transportation Problems',
        description: 'Traffic congestion and poor connectivity plague major cities. What is the priority?',
        solutions: [
            { id: 'sol-19-1', text: 'Promote metro, EV buses, cycling tracks.', results: [] },
            { id: 'sol-19-2', text: 'Develop logistics corridors.', results: [] },
            { id: 'sol-19-3', text: 'Smart traffic systems with AI.', results: [] },
        ],
    },
    {
        id: 'india-cybercrime',
        title: 'Addressing Cybercrime & Data Security',
        description: 'Online frauds and hacking are increasing. How can citizens and data be protected?',
        solutions: [
            { id: 'sol-20-1', text: 'Strengthen Cybersecurity laws & awareness.', results: [] },
            { id: 'sol-20-2', text: 'Use AI-based fraud detection tools.', results: [] },
            { id: 'sol-20-3', text: 'Train police in cyber forensics.', results: [] },
        ],
    },
    {
        id: 'india-brain-drain',
        title: 'Reversing Brain Drain',
        description: 'Skilled Indians are migrating abroad for better opportunities. How can we retain talent?',
        solutions: [
            { id: 'sol-21-1', text: 'Build research & innovation hubs.', results: [] },
            { id: 'sol-21-2', text: 'Competitive pay & startup ecosystem.', results: [] },
            { id: 'sol-21-3', text: 'Incentivize return of skilled professionals.', results: [] },
        ],
    },
    {
        id: 'india-public-sector',
        title: 'Curing Public Sector Inefficiency',
        description: 'Bureaucratic delays and outdated systems slow down governance. What reform is most needed?',
        solutions: [
            { id: 'sol-22-1', text: 'Introduce performance-based evaluation.', results: [] },
            { id: 'sol-22-2', text: 'Privatize loss-making PSUs.', results: [] },
            { id: 'sol-22-3', text: 'AI-driven service delivery platforms.', results: [] },
        ],
    },
    {
        id: 'india-road-safety',
        title: 'Improving Road Safety',
        description: 'India has high accident rates due to negligence and poor infrastructure. What is the most urgent fix?',
        solutions: [
            { id: 'sol-23-1', text: 'Strict traffic rule enforcement & camera systems.', results: [] },
            { id: 'sol-23-2', text: 'Road quality improvement.', results: [] },
            { id: 'sol-23-3', text: 'Awareness campaigns and driver training.', results: [] },
        ],
    },
    {
        id: 'india-food-wastage',
        title: 'Reducing Food Wastage',
        description: 'Millions go hungry while tons of food is wasted. What is the most practical solution?',
        solutions: [
            { id: 'sol-24-1', text: 'Create food banks & cold storage networks.', results: [] },
            { id: 'sol-24-2', text: 'Encourage food donation apps and awareness drives.', results: [] },
            { id: 'sol-24-3', text: 'Educate restaurants on responsible waste management.', results: [] },
        ],
    },
    {
        id: 'india-governance',
        title: 'Fixing Political Polarization & Poor Governance',
        description: 'Divisive politics reduces focus on development. How can accountability be improved?',
        solutions: [
            { id: 'sol-25-1', text: 'Promote transparency and accountability in parties.', results: [] },
            { id: 'sol-25-2', text: 'Educate voters on performance-based voting.', results: [] },
            { id: 'sol-25-3', text: 'Limit money power in elections via digital monitoring.', results: [] },
        ],
    },
];

export const socialPosts: SocialPost[] = [
    // PGC and IGC, Tokenomics (1-20)
  { id: 'post1', authorId: 'usr_002', content: "Just read the Vision page. Building a decentralized nation powered by $PGC isn't just ambitious, it's revolutionary. #PublicGovernance #Crypto", mentionsPgc: true, timestamp: '15m ago', likes: 29, comments: 7 },
  { id: 'post2', authorId: 'usr_003', content: "The tokenomics for the main governance coin are insane. Over 70% of the supply is in a Public Demand Pot, controlled by voters! This is what true community ownership looks like. #DeFi #DAO", mentionsPgc: true, timestamp: '45m ago', likes: 58, comments: 12, imageUrl: 'social-tokenomics', imageHint: 'pie chart' },
  { id: 'post3', authorId: 'usr_005', content: "So much more than just a coin. A percentage of sales for $IGC and $PGC goes directly to funding anti-corruption, peace, and environmental initiatives. Investing in good. #SocialImpact #CryptoForGood", mentionsPgc: true, mentionsIgc: true, timestamp: '1h ago', likes: 72, comments: 18 },
  { id: 'post10', authorId: 'usr_002', content: "The deflationary 20-stage sale for our main coin is designed for long-term stability. It prevents massive dumps and encourages holding. Smart move. #Tokenomics", mentionsPgc: true, timestamp: '8h ago', likes: 55, comments: 10 },
  { id: 'post18', authorId: 'usr_011', content: "The combination of the main coin for governance and $ITC as a stablecoin for trade is a solid economic foundation. A self-sustaining ecosystem. #Crypto #Economics", mentionsPgc: true, timestamp: '16h ago', likes: 68, comments: 16 },
  { id: 'post21', authorId: 'usr_004', content: "Just joined the presale for $PGC. The 1:1 bonus is a fantastic deal for early supporters. Feeling like a founding member of something huge. #Presale #CryptoInvestment", mentionsPgc: true, timestamp: '19h ago', likes: 130, comments: 40, imageUrl: 'social-rocket', imageHint: 'rocket launch' },
  { id: 'post101', authorId: 'usr_006', content: "Deep diving into the $PGC tokenomics page. The multi-stage sale ensures a gradual release, preventing supply shocks. This is a project built for the long term. #CryptoStrategy", mentionsPgc: true, timestamp: '2d ago', likes: 88, comments: 14, imageUrl: 'social-chart-up', imageHint: 'stock chart' },
  { id: 'post102', authorId: 'usr_007', content: "The fact that the Public Demand Pot for the governance coin is worth trillions at target price is mind-boggling. The community will literally have a war chest to fund global change. #DAO #FutureOfFinance", mentionsPgc: true, timestamp: '2d ago', likes: 154, comments: 32 },
  { id: 'post103', authorId: 'usr_008', content: "Explaining the difference to a friend: $IGC is for the core platform governance and earning from lockers, while $PGC is the massive-scale public governance coin. Both have incredible potential. #CryptoEducation #Blockchain", mentionsPgc: true, mentionsIgc: true, timestamp: '2d ago', likes: 92, comments: 19 },
  { id: 'post104', authorId: 'usr_009', content: "The visual breakdown of fund allocations on the Tokenomics page is so clear. Love the transparency. You know exactly where the money is going. #Transparency #Crypto", timestamp: '2d ago', likes: 76, comments: 11, imageUrl: 'social-pie-chart', imageHint: 'data chart' },
  
  // Voting and Governance (21-40)
  { id: 'post5', authorId: 'usr_007', content: "Submitted my vote for the national issues in India. It's incredible to have a direct say on policies that matter. This is what #PublicGovernance is all about.", timestamp: '3h ago', likes: 98, comments: 22, imageUrl: 'social-vote', imageHint: 'voting democracy' },
  { id: 'post14', authorId: 'usr_006', content: "The potential of the Public Demand Pot. 40% of all incoming funds, controlled by us, the voters. We could fund anything from local parks to open-source software. The possibilities are endless. #DAO #Voting #PGC", mentionsPgc: true, timestamp: '12h ago', likes: 110, comments: 35, imageUrl: 'social-lightbulb', imageHint: 'idea lightbulb' },
  { id: 'post16', authorId: 'usr_007', content: "Reading the proposal for a 'New Constitution' in the India voting section. A democracy driven by ideas, not politicians. Mind-blowing concept. #Future #Governance #India", timestamp: '14h ago', likes: 180, comments: 48, imageUrl: 'social-constitution', imageHint: 'document scroll' },
  { id: 'post20', authorId: 'usr_005', content: "It's not just about voting, it's about building. My vote for fixing the potholes on my street feels just as important as my vote on climate change. #LocalGov #GlobalGov", timestamp: '18h ago', likes: 85, comments: 25 },
  { id: 'post28', authorId: 'usr_009', content: "That feeling when you vote on a proposal and see it pass, knowing you had a direct impact. That's the power of this platform. #Voting #DAO", imageUrl: 'social-community', imageHint: 'community people', timestamp: '1d ago', likes: 111, comments: 33 },
  { id: 'post29', authorId: 'usr_002', content: "Just voted on healthcare policy for my state in the USA. The fact that this is all on-chain and transparent is a game-changer for political accountability. #BlockchainForGood #GovTech", timestamp: '1d ago', likes: 78, comments: 16, imageUrl: 'social-healthcare', imageHint: 'medical healthcare' },
  { id: 'post120', authorId: 'usr_010', content: "The geographic voting is so powerful. I'm in South Africa, and seeing polls for local issues in my own district is amazing. Finally, a way to make my voice heard locally. #LocalGov #Africa", timestamp: '3d ago', likes: 67, comments: 10 },

  // Competitions (41-60)
  { id: 'post4', authorId: 'usr_006', content: "The Global Quiz Tournament is genius. A chance to prove your knowledge and win real prizes. Can't wait for it to start. Any other quizzers here? #Quiz #Competition #PlayToEarn", imageUrl: 'social-quiz', imageHint: 'quiz competition', timestamp: '2h ago', likes: 41, comments: 15 },
  { id: 'post7', authorId: 'usr_009', content: "I'm a digital artist, and the World Talent Championship for Arts is a game-changer. A global stage, judged by the community, with real funding! #Art #NFT #Competition", imageUrl: 'social-art', imageHint: 'digital art', timestamp: '5h ago', likes: 120, comments: 31 },
  { id: 'post13', authorId: 'usr_003', content: "This is the first project I've seen that has a clear, detailed plan for everything. The idea-based competitions let you become a project head for your own proposal! #Innovation #Community", timestamp: '11h ago', likes: 92, comments: 28, imageUrl: 'social-sports', imageHint: 'football sport' },
  { id: 'post131', authorId: 'usr_004', content: "Training for the sports competition. The fact that the community votes for the winners is huge. It's not about politics, just pure talent. Let's go! #eSports #Gaming", timestamp: '3d ago', likes: 115, comments: 25, imageUrl: 'social-esports', imageHint: 'esports gaming' },
  
  // Franchisee Program (61-70)
  { id: 'post27', authorId: 'usr_011', content: "The franchise program is a huge opportunity to build a business within the ecosystem. A decentralized network of goods and services, powered by the community. #Franchise #Business", timestamp: '1d ago', likes: 49, comments: 9, imageUrl: 'social-franchise', imageHint: 'small business' },
  { id: 'post161', authorId: 'usr_002', content: "Just submitted my application for a street-level food franchise. Excited to bring quality goods to my local community, all powered by the ecosystem. #Entrepreneur #LocalBusiness", timestamp: '4d ago', likes: 82, comments: 18, imageUrl: 'social-food-stall', imageHint: 'food stall' },
  { id: 'post162', authorId: 'usr_005', content: "Looking at the State Franchisee level. The potential to manage an entire state's network is massive. This is a real business opportunity, not just a crypto project. #Franchise #BigBusiness", timestamp: '4d ago', likes: 102, comments: 22 },

  // Airdrop, Quiz, Affiliate, Influencer (71-90)
  { id: 'post6', authorId: 'usr_008', content: "The affiliate program is a great way to build a team and earn rewards. The multi-level structure is very motivating. Let's grow this community together! #Affiliate #Marketing", timestamp: '4h ago', likes: 35, comments: 9, imageUrl: 'social-network', imageHint: 'network diagram' },
  { id: 'post19', authorId: 'usr_002', content: "The influencer program based on views is fair and transparent. No shady deals, just pure performance. Content creators, this is your chance. #Influencer #Marketing", timestamp: '17h ago', likes: 48, comments: 13, imageUrl: 'social-influencer', imageHint: 'video creator' },
  { id: 'post24', authorId: 'usr_003', content: "The Financial Awareness Quiz wasn't just about earning coins, it was genuinely educational. Everyone should take it to understand the scale of public finances. #Education #Finance", timestamp: '22h ago', likes: 61, comments: 17 },
  { id: 'post171', authorId: 'usr_004', content: "Got my airdrop reward for completing the financial quiz early! Feels good to be an early supporter of a project with a real vision. #Airdrop #CryptoRewards", timestamp: '5d ago', likes: 250, comments: 45, imageUrl: 'social-gift', imageHint: 'gift box' },
  { id: 'post172', authorId: 'usr_009', content: "My affiliate team is growing! The rewards from the paid user track are starting to add up. This is a great way to earn while supporting the project's growth. #PassiveIncome #AffiliateMarketing", timestamp: '5d ago', likes: 123, comments: 23 },
  
  // Vision & Social Impact (91-110)
  { id: 'post11', authorId: 'usr_004', content: "The 'Plant 2 Trees, Get 1 ITC' initiative is simple but powerful. A direct incentive for real-world environmental action. Proud to be part of this. #Environment #ITC", imageUrl: 'social-trees', imageHint: 'forest nature', timestamp: '9h ago', likes: 150, comments: 45 },
  { id: 'post12', authorId: 'usr_005', content: "Just saw the breakdown of the 'World Initiatives' fund. AI education, sports development, global peace... this platform has its priorities straight. #Vision #PublicGovernance", timestamp: '10h ago', likes: 76, comments: 14 },
  { id: 'post15', authorId: 'usr_008', content: "The anti-corruption bounty is one of the boldest ideas I've seen in crypto. Using the blockchain for transparent whistleblowing and rewarding citizen journalists. #AntiCorruption #Transparency", timestamp: '13h ago', likes: 215, comments: 55, imageUrl: 'social-justice', imageHint: 'justice scale' },
  { id: 'post17', authorId: 'usr_009', content: "It's not just a platform, it's a movement. A global, decentralized nation. The 'Our Vision' page gives me chills. Who else is ready to build? #Community #Vision", timestamp: '15h ago', likes: 99, comments: 21 },
  { id: 'post22', authorId: 'usr_006', content: "The idea of a 'No War and Global Peace' corps funded by the platform's revenue is incredibly inspiring. Using technology to organize for peace. #Peace #SocialGood", imageUrl: 'social-peace', imageHint: 'peace dove', timestamp: '20h ago', likes: 190, comments: 60 },
  { id: 'post30', authorId: 'usr_005', content: "From local street issues to global policies, your voice matters. It's not just a tagline, it's the core mechanic of the entire system. #Empowerment #Decentralization", timestamp: '2d ago', likes: 95, comments: 24 }
];


export const coinPackages: CoinPackage[] = [
    { name: 'Diamond', coins: 100000, packagesAvailable: 8000, color: 'bg-cyan-300' },
    { name: 'Platinum', coins: 50000, packagesAvailable: 16000, color: 'bg-slate-400' },
    { name: 'Gold', coins: 25000, packagesAvailable: 32000, color: 'bg-amber-400' },
    { name: 'Silver', coins: 12500, packagesAvailable: 64000, color: 'bg-zinc-400' },
    { name: 'Bronze', coins: 6250, packagesAvailable: 128000, color: 'bg-orange-400' },
];

export const incomingFundAllocations: FundAllocation[] = [
    { name: 'Geographic Allocation', value: 40, color: '#3b82f6', description: 'Funds distributed to various geographic levels for local development.' },
    { name: 'Public Demand (Voting)', value: 40, color: '#8b5cf6', description: 'Funds allocated based on community votes for projects and initiatives.' },
    { name: 'World Initiatives', value: 20, color: '#10b981', description: 'Fixed allocation for global good causes and platform operations.' },
];

export const geographicAllocations: FundAllocation[] = [
  { name: 'Society/Street Development', value: 37.5, color: '#14b8a6', description: 'Funding for hyper-local community projects (15% of total incoming funds).' },
  { name: 'Village/Ward Development', value: 25, color: '#06b6d4', description: 'Funding for village and city-level initiatives (10% of total incoming funds).' },
  { name: 'State Development', value: 12.5, color: '#a855f7', description: 'Funding for state-wide projects and infrastructure (5% of total incoming funds).' },
  { name: 'Country Development', value: 25, color: '#3b82f6', description: 'Development funds for national-level projects (10% of total incoming funds).' },
];


export const publicDemandAllocations: FundAllocation[] = [
    { name: 'Public Demand (Voting)', value: 100, color: '#8b5cf6', description: '100% of this fund is allocated based on community votes for projects, issues, and initiatives across all levels.' }
];

export const worldInitiativeAllocations: FundAllocation[] = [
  { name: 'System Management', value: 2, color: '#64748b', description: 'Covers operational costs, servers, team, and staff. (0.4% of total)' },
  { name: 'Global Peace & Dev', value: 15, color: '#ef4444', description: 'Funds for global peacekeeping and humanitarian aid. (3% of total)' },
  { name: 'Anti-Corruption', value: 25, color: '#f97316', description: 'Bounties and resources for fighting corruption. (5% of total)' },
  { name: 'AI Education', value: 5, color: '#f59e0b', description: 'Providing free AI education and tools. (1% of total)' },
  { name: 'Plant a Tree Initiative', value: 7.5, color: '#84cc16', description: 'Global reforestation and environmental projects. (1.5% of total)' },
  { name: 'Intl & National Issues', value: 10, color: '#22c55e', description: 'Funding for tackling voted-on global & national challenges. (2% of total)' },
  { name: 'Influencer Prize Pool', value: 5, color: '#0ea5e9', description: 'Rewards for content creators promoting the platform. (1% of total)' },
  { name: 'Sports & Arts Dev', value: 10, color: '#0284c7', description: 'Sponsoring athletes, artists, and cultural projects. (2% of total)' },
  { name: 'Affiliate Marketing', value: 10, color: '#7c3aed', description: 'Rewards for bringing new users to the platform. (2% of total)' },
  { name: 'Other Fixed', value: 10.5, color: '#c026d3', description: 'Includes Creator, franchisee, guide, and initial investor benefits. (2.1% of total)' },
];


export const adminAllocations: AdminAllocation[] = [
  // 40% Geographic
  { type: 'geographic', category: 'Society/Street Development', percentage: 15, description: 'Funding for hyper-local community projects.', color: '#14b8a6' },
  { type: 'geographic', category: 'Village/Ward Development', percentage: 10, description: 'Funding for village and ward level initiatives.', color: '#06b6d4' },
  { type: 'geographic', category: 'Block/Kasbah Development', percentage: 5, description: 'Development funds for blocks and kasbahs.', color: '#3b82f6' },
  { type: 'geographic', category: 'Taluka Development', percentage: 2.5, description: 'Funds allocated for development at the Taluka level.', color: '#6366f1' },
  { type: 'geographic', category: 'District Development', percentage: 2.5, description: 'Development funds for entire districts.', color: '#8b5cf6' },
  { type: 'geographic', category: 'State Development', percentage: 5, description: 'Funding for state-wide projects and infrastructure.', color: '#a855f7' },
  
  // 40% Voting
  { type: 'voting', category: 'Public Demand (Voting)', percentage: 40, description: 'Decided by public voting for issues, events, and projects.', color: '#d946ef' },

  // 20% Fixed (World Initiative)
  { type: 'fixed', category: 'Creator', percentage: 0.1, description: 'Ongoing rewards for the original architects of the system.', color: '#f43f5e' },
  { type: 'fixed', category: 'System Management', percentage: 0.4, description: 'Covers operational costs, servers, team, and staff.', color: '#ef4444' },
  { type: 'fixed', category: 'Global Peace & Development', percentage: 3.0, description: 'Funds for global peacekeeping and humanitarian aid.', color: '#f97316' },
  { type: 'fixed', category: 'Anti-Corruption', percentage: 5.0, description: 'Bounties and resources for fighting corruption.', color: '#f59e0b' },
  { type: 'fixed', category: 'AI Education', percentage: 1.0, description: 'Providing free AI education and tools.', color: '#eab308' },
  { type: 'fixed', category: 'Plant a Tree Initiative', percentage: 1.5, description: 'Global reforestation and environmental projects.', color: '#84cc16' },
  { type: 'fixed', category: 'International Issues', percentage: 1.0, description: 'Funding for tackling global challenges voted on by the community.', color: '#22c55e' },
  { type: 'fixed', category: 'National Issues', percentage: 1.0, description: 'Country-specific projects and initiatives.', color: '#10b981' },
  { type: 'fixed', category: 'Influencer Prize Pool', percentage: 1.0, description: 'Rewards for content creators promoting the platform.', color: '#0ea5e9' },
  { type: 'fixed', category: 'Sports Development', percentage: 1.0, description: 'Sponsoring athletes and developing sports infrastructure.', color: '#0284c7' },
  { type: 'fixed', category: 'Arts Development', percentage: 1.0, description: 'Grants and platforms for artists and cultural projects.', color: '#4f46e5' },
  { type: 'fixed', category: 'Affiliate Marketing', percentage: 2.0, description: 'Rewards for bringing new users to the platform.', color: '#7c3aed' },
  { type: 'fixed', category: 'Main franchisee commission', percentage: 1.0, description: 'Commission for main franchise holders.', color: '#c026d3' },
  { type: 'fixed', category: 'Guide benefit', percentage: 0.5, description: 'Rewards for platform guides and mentors.', color: '#db2777' },
  { type: 'fixed', category: 'Initial investor', percentage: 0.5, description: 'Benefits reserved for initial investors.', color: '#e11d48' },
];

export const sportsAndArtsItems: SportsAndArtsItem[] = [
    { id: 1, name: "Women's Cricket", description: 'Promoting and funding women\'s cricket leagues and teams.'},
    { id: 2, name: "Men's Cricket", description: 'Supporting grassroots and professional men\'s cricket.'},
    { id: 3, name: "Women's Football", description: 'Developing women\'s football from local clubs to national teams.'},
    { id: 4, name: "Men's Football", description: 'Investing in football academies and tournaments for men.'},
    { id: 5, name: 'Painting', description: 'Grants and platforms for painters to showcase and sell their work.'},
    { id: 6, name: 'Sculpture', description: 'Funding for public art projects and sculpture exhibitions.'},
    { id: 7, name: 'Digital Art', description: 'Supporting digital artists with tools, education, and NFT marketplace integration.'},
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
  { id: 23, name: 'Equestrian', description: 'The art and sport of horsemanship.' },
  { id: 24, name: 'Wrestling', description: 'A combat sport involving grappling techniques.' },
  { id: 25, name: 'Snooker & Billiards', description: 'Cue sports requiring precision and strategy.' },
];

export const artsList: ArtItem[] = [
  { id: 1, name: 'Painting', description: 'Covering oil, acrylic, watercolor, and more.' },
  { id: 2, name: 'Sculpture', description: 'From traditional clay and stone to modern installations.' },
  { id: 3, name: 'Digital Art', description: 'Includes 2D, D, animation, and generative art.' },
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

export const airdropRewards: AirdropReward[] = [
  { name: 'Early Registration', percentage: 10, description: 'Reserved for early users who register and complete the Financial Awareness Quiz.' },
];

export const freeTrackRewards: AffiliateRewardTier[] = [
    { name: 'Bronze', icon: UsersIcon, reward: '100 PGC', limit: '', requirement: '10 Direct Members', goal: 10 },
    { name: 'Silver', icon: Award, reward: '1,000 PGC', limit: '', requirement: '100 Team Members', goal: 100 },
    { name: 'Gold', icon: Gem, reward: '10,000 PGC', limit: '', requirement: '1,000 Team Members', goal: 1000 },
];

export const paidTrackRewards: AffiliateRewardTier[] = [
    { name: 'Bronze Star', icon: UserPlus, reward: '1,000 PGC', limit: '', requirement: '10 Paid Members', goal: 10 },
    { name: 'Silver Star', icon: Award, reward: '10,000 PGC', limit: '', requirement: '100 Paid Members', goal: 100 },
    { name: 'Gold Star', icon: Gem, reward: '100,000 PGC', limit: '', requirement: '1,000 Paid Members', goal: 1000 },
];

export const influencerTiers = [
    {
        icon: UsersIcon,
        title: "Total Views Basis Reward",
        description: "A pool of 50,000 PGC is reserved for everyone. After the presale, submit links to your videos (max 25). Our system will calculate a 'per-view' value, and you'll be rewarded based on your total verified views.",
        criteria: "Minimum 100 views to be eligible for claim."
    },
    {
        icon: Gem,
        title: "Gold Reward Achiever",
        description: "Get an extra 4 PGC on top of your view-based reward. Limited to the first 5,000 achievers.",
        criteria: "1,000 to 9,999 Views"
    },
    {
        icon: Shield,
        title: "Emerald Reward Achiever",
        description: "Get an extra 8 PGC. Limited to the first 1,000 achievers.",
        criteria: "10,000 to 99,999 Views"
    },
    {
        icon: Star,
        title: "Platinum Reward Achiever",
        description: "Get an extra 25 PGC. Limited to the first 200 achievers.",
        criteria: "100,000 to 999,999 Views"
    },
    {
        icon: Award,
        title: "Diamond Reward Achiever",
        description: "Get an extra 100 PGC. Limited to the first 40 achievers.",
        criteria: "1 Million to 9.99 Million Views"
    },
    {
        icon: Crown,
        title: "Crown Reward Achiever",
        description: "Get an extra 1,000 PGC plus all lower-tier rewards. Limited to the first 8 achievers.",
        criteria: "Above 10 Million Views"
    }
];

export const levelCommissions: LevelCommission[] = [
    { level: 1, percentage: 0.2 }, // 0.2%
    { level: 2, percentage: 0.1 }, // 0.1%
    { level: 3, percentage: 0.05 }, // 0.05%
    { level: 4, percentage: 0.05 },
    { level: 5, percentage: 0.05 },
    { level: 6, percentage: 0.05 },
    { level: 7, percentage: 0.05 },
    { level: 8, percentage: 0.05 },
    { level: 9, percentage: 0.05 },
    { level: 10, percentage: 0.05 },
    { level: 11, percentage: 0.05 },
    { level: 12, percentage: 0.05 },
    { level: 13, percentage: 0.05 },
    { level: 14, percentage: 0.05 },
    { level: 15, percentage: 0.05 },
];
