'use client';
import { Suspense, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSearchParams, useRouter } from 'next/navigation';
import { UserPlus, Crown, Gift, Phone } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useAuth, useFirestore } from '@/firebase';
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile, signOut } from 'firebase/auth';
import { doc, setDoc, collection, query, where, getDocs, updateDoc, arrayUnion, getDoc, increment, runTransaction } from 'firebase/firestore';
import { CommissionCalculator } from '@/lib/commission-calculator';

// Country data with codes and names - 195 countries
const countries = [
  { code: 'AF', name: 'Afghanistan', phoneCode: '+93' },
  { code: 'AL', name: 'Albania', phoneCode: '+355' },
  { code: 'DZ', name: 'Algeria', phoneCode: '+213' },
  { code: 'AD', name: 'Andorra', phoneCode: '+376' },
  { code: 'AO', name: 'Angola', phoneCode: '+244' },
  { code: 'AG', name: 'Antigua and Barbuda', phoneCode: '+1-268' },
  { code: 'AR', name: 'Argentina', phoneCode: '+54' },
  { code: 'AM', name: 'Armenia', phoneCode: '+374' },
  { code: 'AU', name: 'Australia', phoneCode: '+61' },
  { code: 'AT', name: 'Austria', phoneCode: '+43' },
  { code: 'AZ', name: 'Azerbaijan', phoneCode: '+994' },
  { code: 'BS', name: 'Bahamas', phoneCode: '+1-242' },
  { code: 'BH', name: 'Bahrain', phoneCode: '+973' },
  { code: 'BD', name: 'Bangladesh', phoneCode: '+880' },
  { code: 'BB', name: 'Barbados', phoneCode: '+1-246' },
  { code: 'BY', name: 'Belarus', phoneCode: '+375' },
  { code: 'BE', name: 'Belgium', phoneCode: '+32' },
  { code: 'BZ', name: 'Belize', phoneCode: '+501' },
  { code: 'BJ', name: 'Benin', phoneCode: '+229' },
  { code: 'BT', name: 'Bhutan', phoneCode: '+975' },
  { code: 'BO', name: 'Bolivia', phoneCode: '+591' },
  { code: 'BA', name: 'Bosnia and Herzegovina', phoneCode: '+387' },
  { code: 'BW', name: 'Botswana', phoneCode: '+267' },
  { code: 'BR', name: 'Brazil', phoneCode: '+55' },
  { code: 'BN', name: 'Brunei', phoneCode: '+673' },
  { code: 'BG', name: 'Bulgaria', phoneCode: '+359' },
  { code: 'BF', name: 'Burkina Faso', phoneCode: '+226' },
  { code: 'BI', name: 'Burundi', phoneCode: '+257' },
  { code: 'CV', name: 'Cabo Verde', phoneCode: '+238' },
  { code: 'KH', name: 'Cambodia', phoneCode: '+855' },
  { code: 'CM', name: 'Cameroon', phoneCode: '+237' },
  { code: 'CA', name: 'Canada', phoneCode: '+1' },
  { code: 'CF', name: 'Central African Republic', phoneCode: '+236' },
  { code: 'TD', name: 'Chad', phoneCode: '+235' },
  { code: 'CL', name: 'Chile', phoneCode: '+56' },
  { code: 'CN', name: 'China', phoneCode: '+86' },
  { code: 'CO', name: 'Colombia', phoneCode: '+57' },
  { code: 'KM', name: 'Comoros', phoneCode: '+269' },
  { code: 'CG', name: 'Congo', phoneCode: '+242' },
  { code: 'CD', name: 'Congo Democratic Republic', phoneCode: '+243' },
  { code: 'CR', name: 'Costa Rica', phoneCode: '+506' },
  { code: 'CI', name: 'Cote d Ivoire', phoneCode: '+225' },
  { code: 'HR', name: 'Croatia', phoneCode: '+385' },
  { code: 'CU', name: 'Cuba', phoneCode: '+53' },
  { code: 'CY', name: 'Cyprus', phoneCode: '+357' },
  { code: 'CZ', name: 'Czech Republic', phoneCode: '+420' },
  { code: 'DK', name: 'Denmark', phoneCode: '+45' },
  { code: 'DJ', name: 'Djibouti', phoneCode: '+253' },
  { code: 'DM', name: 'Dominica', phoneCode: '+1-767' },
  { code: 'DO', name: 'Dominican Republic', phoneCode: '+1-809' },
  { code: 'EC', name: 'Ecuador', phoneCode: '+593' },
  { code: 'EG', name: 'Egypt', phoneCode: '+20' },
  { code: 'SV', name: 'El Salvador', phoneCode: '+503' },
  { code: 'GQ', name: 'Equatorial Guinea', phoneCode: '+240' },
  { code: 'ER', name: 'Eritrea', phoneCode: '+291' },
  { code: 'EE', name: 'Estonia', phoneCode: '+372' },
  { code: 'SZ', name: 'Eswatini', phoneCode: '+268' },
  { code: 'ET', name: 'Ethiopia', phoneCode: '+251' },
  { code: 'FJ', name: 'Fiji', phoneCode: '+679' },
  { code: 'FI', name: 'Finland', phoneCode: '+358' },
  { code: 'FR', name: 'France', phoneCode: '+33' },
  { code: 'GA', name: 'Gabon', phoneCode: '+241' },
  { code: 'GM', name: 'Gambia', phoneCode: '+220' },
  { code: 'GE', name: 'Georgia', phoneCode: '+995' },
  { code: 'DE', name: 'Germany', phoneCode: '+49' },
  { code: 'GH', name: 'Ghana', phoneCode: '+233' },
  { code: 'GR', name: 'Greece', phoneCode: '+30' },
  { code: 'GD', name: 'Grenada', phoneCode: '+1-473' },
  { code: 'GT', name: 'Guatemala', phoneCode: '+502' },
  { code: 'GN', name: 'Guinea', phoneCode: '+224' },
  { code: 'GW', name: 'Guinea-Bissau', phoneCode: '+245' },
  { code: 'GY', name: 'Guyana', phoneCode: '+592' },
  { code: 'HT', name: 'Haiti', phoneCode: '+509' },
  { code: 'HN', name: 'Honduras', phoneCode: '+504' },
  { code: 'HU', name: 'Hungary', phoneCode: '+36' },
  { code: 'IS', name: 'Iceland', phoneCode: '+354' },
  { code: 'IN', name: 'India', phoneCode: '+91' },
  { code: 'ID', name: 'Indonesia', phoneCode: '+62' },
  { code: 'IR', name: 'Iran', phoneCode: '+98' },
  { code: 'IQ', name: 'Iraq', phoneCode: '+964' },
  { code: 'IE', name: 'Ireland', phoneCode: '+353' },
  { code: 'IL', name: 'Israel', phoneCode: '+972' },
  { code: 'IT', name: 'Italy', phoneCode: '+39' },
  { code: 'JM', name: 'Jamaica', phoneCode: '+1-876' },
  { code: 'JP', name: 'Japan', phoneCode: '+81' },
  { code: 'JO', name: 'Jordan', phoneCode: '+962' },
  { code: 'KZ', name: 'Kazakhstan', phoneCode: '+7' },
  { code: 'KE', name: 'Kenya', phoneCode: '+254' },
  { code: 'KI', name: 'Kiribati', phoneCode: '+686' },
  { code: 'KP', name: 'Korea North', phoneCode: '+850' },
  { code: 'KR', name: 'Korea South', phoneCode: '+82' },
  { code: 'XK', name: 'Kosovo', phoneCode: '+383' },
  { code: 'KW', name: 'Kuwait', phoneCode: '+965' },
  { code: 'KG', name: 'Kyrgyzstan', phoneCode: '+996' },
  { code: 'LA', name: 'Laos', phoneCode: '+856' },
  { code: 'LV', name: 'Latvia', phoneCode: '+371' },
  { code: 'LB', name: 'Lebanon', phoneCode: '+961' },
  { code: 'LS', name: 'Lesotho', phoneCode: '+266' },
  { code: 'LR', name: 'Liberia', phoneCode: '+231' },
  { code: 'LY', name: 'Libya', phoneCode: '+218' },
  { code: 'LI', name: 'Liechtenstein', phoneCode: '+423' },
  { code: 'LT', name: 'Lithuania', phoneCode: '+370' },
  { code: 'LU', name: 'Luxembourg', phoneCode: '+352' },
  { code: 'MG', name: 'Madagascar', phoneCode: '+261' },
  { code: 'MW', name: 'Malawi', phoneCode: '+265' },
  { code: 'MY', name: 'Malaysia', phoneCode: '+60' },
  { code: 'MV', name: 'Maldives', phoneCode: '+960' },
  { code: 'ML', name: 'Mali', phoneCode: '+223' },
  { code: 'MT', name: 'Malta', phoneCode: '+356' },
  { code: 'MH', name: 'Marshall Islands', phoneCode: '+692' },
  { code: 'MR', name: 'Mauritania', phoneCode: '+222' },
  { code: 'MU', name: 'Mauritius', phoneCode: '+230' },
  { code: 'MX', name: 'Mexico', phoneCode: '+52' },
  { code: 'FM', name: 'Micronesia', phoneCode: '+691' },
  { code: 'MD', name: 'Moldova', phoneCode: '+373' },
  { code: 'MC', name: 'Monaco', phoneCode: '+377' },
  { code: 'MN', name: 'Mongolia', phoneCode: '+976' },
  { code: 'ME', name: 'Montenegro', phoneCode: '+382' },
  { code: 'MA', name: 'Morocco', phoneCode: '+212' },
  { code: 'MZ', name: 'Mozambique', phoneCode: '+258' },
  { code: 'MM', name: 'Myanmar', phoneCode: '+95' },
  { code: 'NA', name: 'Namibia', phoneCode: '+264' },
  { code: 'NR', name: 'Nauru', phoneCode: '+674' },
  { code: 'NP', name: 'Nepal', phoneCode: '+977' },
  { code: 'NL', name: 'Netherlands', phoneCode: '+31' },
  { code: 'NZ', name: 'New Zealand', phoneCode: '+64' },
  { code: 'NI', name: 'Nicaragua', phoneCode: '+505' },
  { code: 'NE', name: 'Niger', phoneCode: '+227' },
  { code: 'NG', name: 'Nigeria', phoneCode: '+234' },
  { code: 'MK', name: 'North Macedonia', phoneCode: '+389' },
  { code: 'NO', name: 'Norway', phoneCode: '+47' },
  { code: 'OM', name: 'Oman', phoneCode: '+968' },
  { code: 'PK', name: 'Pakistan', phoneCode: '+92' },
  { code: 'PW', name: 'Palau', phoneCode: '+680' },
  { code: 'PS', name: 'Palestine', phoneCode: '+970' },
  { code: 'PA', name: 'Panama', phoneCode: '+507' },
  { code: 'PG', name: 'Papua New Guinea', phoneCode: '+675' },
  { code: 'PY', name: 'Paraguay', phoneCode: '+595' },
  { code: 'PE', name: 'Peru', phoneCode: '+51' },
  { code: 'PH', name: 'Philippines', phoneCode: '+63' },
  { code: 'PL', name: 'Poland', phoneCode: '+48' },
  { code: 'PT', name: 'Portugal', phoneCode: '+351' },
  { code: 'QA', name: 'Qatar', phoneCode: '+974' },
  { code: 'RO', name: 'Romania', phoneCode: '+40' },
  { code: 'RU', name: 'Russia', phoneCode: '+7' },
  { code: 'RW', name: 'Rwanda', phoneCode: '+250' },
  { code: 'KN', name: 'Saint Kitts and Nevis', phoneCode: '+1-869' },
  { code: 'LC', name: 'Saint Lucia', phoneCode: '+1-758' },
  { code: 'VC', name: 'Saint Vincent and the Grenadines', phoneCode: '+1-784' },
  { code: 'WS', name: 'Samoa', phoneCode: '+685' },
  { code: 'SM', name: 'San Marino', phoneCode: '+378' },
  { code: 'ST', name: 'Sao Tome and Principe', phoneCode: '+239' },
  { code: 'SA', name: 'Saudi Arabia', phoneCode: '+966' },
  { code: 'SN', name: 'Senegal', phoneCode: '+221' },
  { code: 'RS', name: 'Serbia', phoneCode: '+381' },
  { code: 'SC', name: 'Seychelles', phoneCode: '+248' },
  { code: 'SL', name: 'Sierra Leone', phoneCode: '+232' },
  { code: 'SG', name: 'Singapore', phoneCode: '+65' },
  { code: 'SK', name: 'Slovakia', phoneCode: '+421' },
  { code: 'SI', name: 'Slovenia', phoneCode: '+386' },
  { code: 'SB', name: 'Solomon Islands', phoneCode: '+677' },
  { code: 'SO', name: 'Somalia', phoneCode: '+252' },
  { code: 'ZA', name: 'South Africa', phoneCode: '+27' },
  { code: 'SS', name: 'South Sudan', phoneCode: '+211' },
  { code: 'ES', name: 'Spain', phoneCode: '+34' },
  { code: 'LK', name: 'Sri Lanka', phoneCode: '+94' },
  { code: 'SD', name: 'Sudan', phoneCode: '+249' },
  { code: 'SR', name: 'Suriname', phoneCode: '+597' },
  { code: 'SE', name: 'Sweden', phoneCode: '+46' },
  { code: 'CH', name: 'Switzerland', phoneCode: '+41' },
  { code: 'SY', name: 'Syria', phoneCode: '+963' },
  { code: 'TW', name: 'Taiwan', phoneCode: '+886' },
  { code: 'TJ', name: 'Tajikistan', phoneCode: '+992' },
  { code: 'TZ', name: 'Tanzania', phoneCode: '+255' },
  { code: 'TH', name: 'Thailand', phoneCode: '+66' },
  { code: 'TL', name: 'Timor-Leste', phoneCode: '+670' },
  { code: 'TG', name: 'Togo', phoneCode: '+228' },
  { code: 'TO', name: 'Tonga', phoneCode: '+676' },
  { code: 'TT', name: 'Trinidad and Tobago', phoneCode: '+1-868' },
  { code: 'TN', name: 'Tunisia', phoneCode: '+216' },
  { code: 'TR', name: 'Turkey', phoneCode: '+90' },
  { code: 'TM', name: 'Turkmenistan', phoneCode: '+993' },
  { code: 'TV', name: 'Tuvalu', phoneCode: '+688' },
  { code: 'UG', name: 'Uganda', phoneCode: '+256' },
  { code: 'UA', name: 'Ukraine', phoneCode: '+380' },
  { code: 'AE', name: 'United Arab Emirates', phoneCode: '+971' },
  { code: 'GB', name: 'United Kingdom', phoneCode: '+44' },
  { code: 'US', name: 'United States', phoneCode: '+1' },
  { code: 'UY', name: 'Uruguay', phoneCode: '+598' },
  { code: 'UZ', name: 'Uzbekistan', phoneCode: '+998' },
  { code: 'VU', name: 'Vanuatu', phoneCode: '+678' },
  { code: 'VA', name: 'Vatican City', phoneCode: '+379' },
  { code: 'VE', name: 'Venezuela', phoneCode: '+58' },
  { code: 'VN', name: 'Vietnam', phoneCode: '+84' },
  { code: 'YE', name: 'Yemen', phoneCode: '+967' },
  { code: 'ZM', name: 'Zambia', phoneCode: '+260' },
  { code: 'ZW', name: 'Zimbabwe', phoneCode: '+263' }
];

// Registration schema with location fields
const registrationSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long.' }),
  phone: z.string().min(5, { message: 'Please enter a valid phone number.' }),
  country: z.string().min(1, { message: 'Please select your country' }),
  state: z.string().optional(),
  referredBy: z.string().optional(),
  accountType: z.enum(['free', '10', '25', '50', '100', '250', '500', '1000']),
});

type RegistrationFormValues = z.infer<typeof registrationSchema>;

// Generate UNIQUE referral code
const generateReferralCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// Get total users count using atomic counter - FIXED VERSION
const getTotalUsersCount = async (firestore: any) => {
  try {
    // Use a dedicated counter document for accurate counting
    const counterRef = doc(firestore, 'counters', 'totalUsers');
    
    return await runTransaction(firestore, async (transaction) => {
      const counterDoc = await transaction.get(counterRef);
      
      if (!counterDoc.exists()) {
        // Initialize counter if it doesn't exist
        transaction.set(counterRef, { count: 1 });
        return 1;
      } else {
        const currentCount = counterDoc.data().count;
        const newCount = currentCount + 1;
        
        // Update the counter atomically
        transaction.update(counterRef, { count: newCount });
        return newCount;
      }
    });
  } catch (error) {
    console.error('Error getting users count:', error);
    
    // Fallback: count users collection (less accurate but works)
    try {
      const usersRef = collection(firestore, 'users');
      const snapshot = await getDocs(usersRef);
      return snapshot.size + 1; // +1 because we're about to add a new user
    } catch (fallbackError) {
      console.error('Fallback count also failed:', fallbackError);
      return 0;
    }
  }
};

// Check if early bird bonus is still available
const checkEarlyBirdAvailable = async (firestore: any) => {
  try {
    const counterRef = doc(firestore, 'counters', 'totalUsers');
    const counterDoc = await getDoc(counterRef);
    
    if (counterDoc.exists()) {
      const currentCount = counterDoc.data().count;
      return currentCount < 20000;
    }
    return true; // If counter doesn't exist, assume early bird is available
  } catch (error) {
    console.error('Error checking early bird:', error);
    return true; // Default to available if there's an error
  }
};

// Calculate PGC based on account type and user count
const calculatePGCBalance = (accountType: string, isEarlyUser: boolean) => {
  const accountAmounts = {
    free: 0,
    '10': 10,
    '25': 25,
    '50': 50,
    '100': 100,
    '250': 250,
    '500': 500,
    '1000': 1000
  };

  const investmentAmount = accountAmounts[accountType];
  
  if (accountType === 'free') {
    // Free account gets 1 PGC only if within first 20,000 users
    return isEarlyUser ? 1 : 0;
  } else {
    // Paid accounts get: (investment amount × 2) + (1 PGC if early user)
    const basePGC = investmentAmount * 2;
    const earlyBonus = isEarlyUser ? 1 : 0;
    return basePGC + earlyBonus;
  }
};

function RegistrationForm() {
  const auth = useAuth();
  const firestore = useFirestore();
  const searchParams = useSearchParams();
  const router = useRouter();
  const referredByCode = searchParams.get('ref') || '';
  const [selectedCountry, setSelectedCountry] = useState('');
  const [phoneCode, setPhoneCode] = useState('');
  const [earlyBirdAvailable, setEarlyBirdAvailable] = useState(true);
  const [currentUserCount, setCurrentUserCount] = useState(0);

  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check early bird availability on component mount
  useState(() => {
    const checkAvailability = async () => {
      if (firestore) {
        const available = await checkEarlyBirdAvailable(firestore);
        setEarlyBirdAvailable(available);
        
        // Get current count for display
        const counterRef = doc(firestore, 'counters', 'totalUsers');
        const counterDoc = await getDoc(counterRef);
        if (counterDoc.exists()) {
          setCurrentUserCount(counterDoc.data().count);
        }
      }
    };
    checkAvailability();
  });

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: '',
      referredBy: referredByCode,
      email: '',
      password: '',
      phone: '',
      country: '',
      state: '',
      accountType: 'free',
    },
  });

  const handleCountryChange = (value: string) => {
    setSelectedCountry(value);
    form.setValue('country', value);
    
    // Set phone code based on selected country
    const country = countries.find(c => c.code === value);
    if (country) {
      setPhoneCode(country.phoneCode);
    }
  };

  const onSubmit = async (data: RegistrationFormValues) => {
    console.log('🔄 STARTING REGISTRATION...', data);
    setIsSubmitting(true);

    try {
      // Step 1: Check if early bird is still available
      console.log('👥 Checking early bird availability...');
      const isEarlyUser = await checkEarlyBirdAvailable(firestore);
      
      if (!isEarlyUser && data.accountType === 'free') {
        toast({
          variant: 'destructive',
          title: 'Early Bird Bonus Ended',
          description: 'The early bird bonus for free accounts has ended. You can still register for a free account without the 1 PGC bonus, or choose a paid account to get PGC tokens.',
        });
        // Continue with registration but without early bird bonus
      }

      // Step 2: Get user count (this also increments the counter atomically)
      console.log('📊 Getting user count...');
      const totalUsers = await getTotalUsersCount(firestore);
      console.log(`🎯 User will be number: ${totalUsers}`);
      
      // Update the actual early user status based on atomic counter
      const actualEarlyUser = totalUsers <= 20000;
      
      if (totalUsers > 20000 && data.accountType === 'free') {
        console.log('🚫 Early bird bonus ended for free account');
      }

      // Step 3: Create user in Firebase Auth
      console.log('📝 Creating auth user...');
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const authUser = userCredential.user;
      console.log('✅ AUTH USER CREATED:', authUser.uid);

      // Step 4: Update profile with name
      await updateProfile(authUser, { displayName: data.name });
      console.log('✅ USER PROFILE UPDATED');

      // Step 5: Generate referral code
      const newReferralCode = generateReferralCode();
      console.log('🎯 GENERATED REFERRAL CODE:', newReferralCode);

      // Step 6: Find referrer if referral code was used
      let referrerUserId = null;

      if (data.referredBy && data.referredBy.trim() !== '') {
        console.log('🔍 LOOKING UP REFERRER CODE:', data.referredBy);
        
        const usersRef = collection(firestore, 'users');
        const q = query(usersRef, where('referralCode', '==', data.referredBy.trim()));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const referrerDoc = querySnapshot.docs[0];
          referrerUserId = referrerDoc.id;
          console.log('✅ REFERRER FOUND:', referrerDoc.data().email);
        } else {
          console.log('❌ REFERRER NOT FOUND');
        }
      }

      // Step 7: Calculate balances based on account type
      const accountAmounts = {
        free: 0,
        '10': 10,
        '25': 25,
        '50': 50,
        '100': 100,
        '250': 250,
        '500': 500,
        '1000': 1000
      };

      const investmentAmount = accountAmounts[data.accountType];
      const isPaidAccount = data.accountType !== 'free';
      
      // Calculate PGC with actual early user status
      const pgcBalance = calculatePGCBalance(data.accountType, actualEarlyUser);
      const usdBalance = isPaidAccount ? investmentAmount : 0;

      console.log(`💰 BALANCE CALCULATION: 
        Account Type: ${data.accountType}
        Investment: $${investmentAmount}
        Early User: ${actualEarlyUser}
        User Number: ${totalUsers}
        PGC Balance: ${pgcBalance}
        USD Balance: $${usdBalance}`);

      // Step 8: Create user document in Firestore
      const userDocData = {
        email: data.email,
        name: data.name,
        phone: phoneCode + data.phone,
        referralCode: newReferralCode,
        referredByUserId: referrerUserId,
        role: 'User',
        status: 'Active',
        accountType: data.accountType,
        registeredAt: new Date(),
        country: data.country,
        state: data.state || '',
        usdBalance: usdBalance,
        pgcBalance: pgcBalance,
        currentFreeRank: 'None',
        currentPaidRank: 'None',
        freeAchievers: { bronze: 0, silver: 0, gold: 0 },
        paidAchievers: { bronzeStar: 0, silverStar: 0, goldStar: 0 },
        freeAchievements: { bronze: false, silver: false, gold: false },
        paidAchievements: { bronzeStar: false, silverStar: false, goldStar: false },
        totalCommission: 0,
        walletAddress: '',
        direct_team: [],
        kycVerified: false,
        isEarlyUser: actualEarlyUser,
        totalUsersAtRegistration: totalUsers,
        userSequenceNumber: totalUsers, // Store the actual sequence number
        emailVerified: false,
      };

      console.log('💾 SAVING USER TO FIRESTORE...');
      await setDoc(doc(firestore, 'users', authUser.uid), userDocData);
      console.log('✅ USER DOCUMENT SAVED TO FIRESTORE');

      // Step 9: Update referrer's team if exists
      if (referrerUserId) {
        console.log('💰 UPDATING REFERRER TEAM...');
        
        const referrerUpdateData: any = {
          direct_team: arrayUnion(authUser.uid),
        };

        if (data.accountType === 'free') {
          referrerUpdateData['freeAchievers.bronze'] = increment(1);
        } else {
          referrerUpdateData['paidAchievers.bronzeStar'] = increment(1);
          
          // Calculate commissions for paid registration
          console.log('💰 CALCULATING COMMISSIONS FOR PAID ACCOUNT...');
          
          await CommissionCalculator.calculateRegistrationCommissions(
            authUser.uid,
            data.name,
            referrerUserId,
            investmentAmount
          );
        }

        await updateDoc(doc(firestore, 'users', referrerUserId), referrerUpdateData);
        console.log('✅ REFERRER UPDATED');
      }

      // Step 10: Send email verification
      console.log('📧 SENDING VERIFICATION EMAIL...');
      await sendEmailVerification(authUser, {
        url: `${window.location.origin}/login?verified=true`,
        handleCodeInApp: true,
      });
      console.log('✅ VERIFICATION EMAIL SENT');

      // Step 11: Sign out
      await signOut(auth);
      console.log('✅ USER SIGNED OUT');

      // Step 12: Show success message with PGC details
      let successMessage = '';
      
      if (data.accountType === 'free') {
        if (actualEarlyUser) {
          successMessage = `Registration Successful! 🎉 You are user #${totalUsers}. You received 1 PGC as early bird bonus! Your referral code: ${newReferralCode}. Please check your email to verify your account.`;
        } else {
          successMessage = `Registration Successful! 🎉 Your referral code: ${newReferralCode}. Please check your email to verify your account. (Early bird bonus has ended)`;
        }
      } else {
        const basePGC = investmentAmount * 2;
        if (actualEarlyUser) {
          successMessage = `Registration Successful! 🎉 You are user #${totalUsers}. You received ${basePGC} PGC ($${investmentAmount} × 2) + 1 PGC early bird bonus = ${pgcBalance} PGC total! Your referral code: ${newReferralCode}. Please check your email to verify your account.`;
        } else {
          successMessage = `Registration Successful! 🎉 You received ${basePGC} PGC ($${investmentAmount} × 2)! Your referral code: ${newReferralCode}. Please check your email to verify your account.`;
        }
      }

      toast({
        title: 'Registration Successful! 🎉',
        description: successMessage,
      });

      console.log('🎉 REGISTRATION COMPLETED');
      router.push('/login');

    } catch (error: any) {
      console.error('❌ REGISTRATION ERROR:', error);
      
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered. Please use a different email.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please use a stronger password.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address. Please check your email.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        variant: 'destructive',
        title: 'Registration Failed',
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center gap-4 justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <UserPlus className="h-6 w-6" />
            </div>
            <div>
                <CardTitle className="text-2xl font-headline">Create Your Account</CardTitle>
                <CardDescription>
                  Join the Public Governance platform
                  {currentUserCount > 0 && (
                    <div className="mt-2 text-sm">
                      <strong>{20000 - currentUserCount}</strong> early bird spots remaining!
                    </div>
                  )}
                </CardDescription>
            </div>
        </div>
      </CardHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <CardContent className="space-y-4">
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address *</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password *</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormDescription>Must be at least 6 characters</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone Number Field */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number *</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <div className="w-24">
                        <Input
                          value={phoneCode}
                          readOnly
                          className="bg-muted font-mono"
                          placeholder="Code"
                        />
                      </div>
                      <Input
                        placeholder="Phone number"
                        {...field}
                        onChange={(e) => {
                          // Allow only numbers
                          const value = e.target.value.replace(/[^0-9]/g, '');
                          field.onChange(value);
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Enter your phone number without country code
                    </div>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Location Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Country Dropdown */}
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country *</FormLabel>
                    <Select 
                      onValueChange={handleCountryChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your country" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-60">
                        {countries.map((country) => (
                          <SelectItem key={country.code} value={country.code}>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs">{country.phoneCode}</span>
                              <span>{country.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* State Field (Optional) */}
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State / Province</FormLabel>
                    <FormControl>
                      <Input placeholder="State (Optional)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Account Type */}
            <FormField
              control={form.control}
              name="accountType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select account type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="free">
                        <div className="flex items-center gap-2">
                          <UserPlus className="h-4 w-4" />
                          <div>
                            <span>Free Account</span>
                            <div className="text-xs text-muted-foreground">
                              {earlyBirdAvailable 
                                ? 'Get 1 PGC if within first 20,000 users' 
                                : 'Early bird bonus ended - register for free'
                              }
                            </div>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="10">
                        <div className="flex items-center gap-2">
                          <Crown className="h-4 w-4 text-blue-600" />
                          <div>
                            <span>Paid Account - $10 USD</span>
                            <div className="text-xs text-muted-foreground">
                              Get 20 PGC + {earlyBirdAvailable ? '1 early bird bonus' : 'standard bonus'}
                            </div>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="25">
                        <div className="flex items-center gap-2">
                          <Crown className="h-4 w-4 text-green-600" />
                          <div>
                            <span>Paid Account - $25 USD</span>
                            <div className="text-xs text-muted-foreground">
                              Get 50 PGC + {earlyBirdAvailable ? '1 early bird bonus' : 'standard bonus'}
                            </div>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="50">
                        <div className="flex items-center gap-2">
                          <Crown className="h-4 w-4 text-yellow-600" />
                          <div>
                            <span>Paid Account - $50 USD</span>
                            <div className="text-xs text-muted-foreground">
                              Get 100 PGC + {earlyBirdAvailable ? '1 early bird bonus' : 'standard bonus'}
                            </div>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="100">
                        <div className="flex items-center gap-2">
                          <Crown className="h-4 w-4 text-orange-600" />
                          <div>
                            <span>Paid Account - $100 USD</span>
                            <div className="text-xs text-muted-foreground">
                              Get 200 PGC + {earlyBirdAvailable ? '1 early bird bonus' : 'standard bonus'}
                            </div>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="250">
                        <div className="flex items-center gap-2">
                          <Crown className="h-4 w-4 text-purple-600" />
                          <div>
                            <span>Paid Account - $250 USD</span>
                            <div className="text-xs text-muted-foreground">
                              Get 500 PGC + {earlyBirdAvailable ? '1 early bird bonus' : 'standard bonus'}
                            </div>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="500">
                        <div className="flex items-center gap-2">
                          <Crown className="h-4 w-4 text-red-600" />
                          <div>
                            <span>Paid Account - $500 USD</span>
                            <div className="text-xs text-muted-foreground">
                              Get 1000 PGC + {earlyBirdAvailable ? '1 early bird bonus' : 'standard bonus'}
                            </div>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="1000">
                        <div className="flex items-center gap-2">
                          <Crown className="h-4 w-4 text-pink-600" />
                          <div>
                            <span>Paid Account - $1000 USD</span>
                            <div className="text-xs text-muted-foreground">
                              Get 2000 PGC + {earlyBirdAvailable ? '1 early bird bonus' : 'standard bonus'}
                            </div>
                          </div>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex items-center gap-2 mt-2">
                    <Gift className="h-4 w-4 text-green-600" />
                    <span className="text-sm">
                      <strong>Presale Bonus:</strong> All paid packages get 2× PGC (1 USD = 2 PGC) 
                      {earlyBirdAvailable && ' + 1 PGC early bird bonus for first 20,000 users'}
                    </span>
                  </div>
                  {!earlyBirdAvailable && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-orange-600">
                        <strong>Note:</strong> Early bird bonus has ended for free accounts
                      </span>
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Referral Code */}
            <FormField
              control={form.control}
              name="referredBy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Referral Code (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter referral code" {...field} />
                  </FormControl>
                  <FormDescription>If someone referred you, enter their code here</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
              size="lg"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Creating Account...
                </div>
              ) : (
                'Create Account'
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

export default function RegisterPage() {
  return (
      <Suspense fallback={<div>Loading...</div>}>
        <RegistrationForm />
      </Suspense>
  );
}