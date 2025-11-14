'use client';
import { Suspense, useState, useEffect } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSearchParams, useRouter } from 'next/navigation';
import { UserPlus, Crown, Gift, Phone, Building, Briefcase, Handshake, ConciergeBell } from 'lucide-react';
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
import { businessRoles, businessTypes } from '@/lib/business-data';

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
  { 'SI': 'Slovenia', phoneCode: '+386' },
  { 'SB': 'Solomon Islands', phoneCode: '+677' },
  { 'SO': 'Somalia', phoneCode: '+252' },
  { 'ZA': 'South Africa', phoneCode: '+27' },
  { 'SS': 'South Sudan', phoneCode: '+211' },
  { 'ES': 'Spain', phoneCode: '+34' },
  { 'LK': 'Sri Lanka', phoneCode: '+94' },
  { 'SD': 'Sudan', phoneCode: '+249' },
  { 'SR': 'Suriname', phoneCode: '+597' },
  { 'SE': 'Sweden', phoneCode: '+46' },
  { 'CH': 'Switzerland', phoneCode: '+41' },
  { 'SY': 'Syria', phoneCode: '+963' },
  { 'TW': 'Taiwan', phoneCode: '+886' },
  { 'TJ': 'Tajikistan', phoneCode: '+992' },
  { 'TZ': 'Tanzania', phoneCode: '+255' },
  { 'TH': 'Thailand', phoneCode: '+66' },
  { 'TL': 'Timor-Leste', phoneCode: '+670' },
  { 'TG': 'Togo', phoneCode: '+228' },
  { 'TO': 'Tonga', phoneCode: '+676' },
  { 'TT': 'Trinidad and Tobago', phoneCode: '+1-868' },
  { 'TN': 'Tunisia', phoneCode: '+216' },
  { 'TR': 'Turkey', phoneCode: '+90' },
  { 'TM': 'Turkmenistan', phoneCode: '+993' },
  { 'TV': 'Tuvalu', phoneCode: '+688' },
  { 'UG': 'Uganda', phoneCode: '+256' },
  { 'UA': 'Ukraine', phoneCode: '+380' },
  { 'AE': 'United Arab Emirates', phoneCode: '+971' },
  { 'GB': 'United Kingdom', phoneCode: '+44' },
  { 'US': 'United States', phoneCode: '+1' },
  { 'UY': 'Uruguay', phoneCode: '+598' },
  { 'UZ': 'Uzbekistan', phoneCode: '+998' },
  { 'VU': 'Vanuatu', phoneCode: '+678' },
  { 'VA': 'Vatican City', phoneCode: '+379' },
  { 'VE': 'Venezuela', phoneCode: '+58' },
  { 'VN': 'Vietnam', phoneCode: '+84' },
  { 'YE': 'Yemen', phoneCode: '+967' },
  { 'ZM': 'Zambia', phoneCode: '+260' },
  { 'ZW': 'Zimbabwe', phoneCode: '+263' }
];

const franchiseTiers = [
    { value: "25", label: "User ($25)", description: "Get a 'My Web Store' digital v-card", role: 'User' },
    { value: "100", label: "Street Franchisee ($100)", description: "Operate at a hyper-local street level", role: 'Street Franchisee' },
    { value: "250", label: "Village Franchisee ($250)", description: "Cover an entire village or city ward", role: 'Village Franchisee' },
    { value: "500", label: "Block/Kasba Franchisee ($500)", description: "Manage franchise operations for a block", role: 'Block/Kasba Franchisee' },
    { value: "1000", label: "Taluka Franchisee ($1000)", description: "Oversee a taluka or sub-district", role: 'Taluka Franchisee' },
    { value: "2500", label: "District Franchisee ($2500)", description: "Lead franchise activities for a whole district", role: 'District Franchisee' }
];

// Registration schema with business and franchise fields
const registrationSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long.' }),
  phone: z.string().min(5, { message: 'Please enter a valid phone number.' }),
  country: z.string().min(1, { message: 'Please select your country' }),
  state: z.string().optional(),
  district: z.string().optional(),
  taluka: z.string().optional(),
  village: z.string().optional(),
  street: z.string().optional(),
  referredBy: z.string().optional(),
  investmentTier: z.string().min(1, { message: 'Please select a franchise tier.' }),
  primaryRole: z.string().min(1, { message: 'Please select your primary role.' }),
  businessType: z.string().min(1, { message: 'Please select your business type.' }),
});

type RegistrationFormValues = z.infer<typeof registrationSchema>;

// Generate UNIQUE referral code
const generateReferralCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `PGC-${code}`;
};

function RegistrationForm() {
  const auth = useAuth();
  const firestore = useFirestore();
  const searchParams = useSearchParams();
  const router = useRouter();
  const referredByCode = searchParams.get('ref') || '';
  const [selectedCountry, setSelectedCountry] = useState('');
  const [phoneCode, setPhoneCode] = useState('');

  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      district: '',
      taluka: '',
      village: '',
      street: '',
      investmentTier: '25',
      primaryRole: '',
      businessType: '',
    },
  });

  const handleCountryChange = (value: string) => {
    setSelectedCountry(value);
    form.setValue('country', value);
    const country = countries.find(c => c.code === value);
    if (country) {
      setPhoneCode(country.phoneCode);
    }
  };

  const onSubmit = async (data: RegistrationFormValues) => {
    setIsSubmitting(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const authUser = userCredential.user;
      await updateProfile(authUser, { displayName: data.name });

      const newReferralCode = generateReferralCode();
      let referrerUserId = null;

      if (data.referredBy && data.referredBy.trim() !== '') {
        const usersRef = collection(firestore, 'users');
        const q = query(usersRef, where('referralCode', '==', data.referredBy.trim()));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          referrerUserId = querySnapshot.docs[0].id;
        }
      }

      const selectedTier = franchiseTiers.find(t => t.value === data.investmentTier);
      const investmentAmount = parseInt(data.investmentTier);

      const userDocData = {
        email: data.email,
        name: data.name,
        phone: phoneCode + data.phone,
        country: data.country,
        state: data.state,
        district: data.district,
        taluka: data.taluka,
        village: data.village,
        street: data.street,
        referralCode: newReferralCode,
        referredByUserId: referrerUserId,
        role: selectedTier?.role || 'User',
        status: 'Active',
        investmentTier: investmentAmount,
        primaryRole: data.primaryRole,
        businessType: data.businessType,
        registeredAt: new Date(),
        pgcBalance: investmentAmount * 2, // 1 USD = 2 PGC
        totalCommission: 0,
        direct_team: [],
      };

      await setDoc(doc(firestore, 'users', authUser.uid), userDocData);
      
      if (referrerUserId) {
        await CommissionCalculator.calculateAndDistributeCommissions(authUser.uid, investmentAmount);
      }

      await sendEmailVerification(authUser);
      await signOut(auth);

      toast({
        title: 'Registration Successful! 🎉',
        description: `You've applied as a ${selectedTier?.role}. Please check your email to verify your account.`,
      });
      router.push('/login');

    } catch (error: any) {
      console.error('❌ REGISTRATION ERROR:', error);
      toast({
        variant: 'destructive',
        title: 'Registration Failed',
        description: error.message || 'An unknown error occurred.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <UserPlus className="mx-auto h-12 w-12 text-primary" />
        <CardTitle className="text-3xl font-headline mt-4">Join the Ecosystem</CardTitle>
        <CardDescription>Register to become a user, seller, or franchisee in our global network.</CardDescription>
      </CardHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <CardContent className="space-y-6 p-6">
            <div className="space-y-4 p-4 border rounded-lg">
                <h3 className="font-semibold text-lg">1. Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Full Name *</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email Address *</FormLabel><FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="password" render={({ field }) => (<FormItem><FormLabel>Password *</FormLabel><FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="referredBy" render={({ field }) => (<FormItem><FormLabel>Referral Code (Optional)</FormLabel><FormControl><Input placeholder="Enter referral code" {...field} /></FormControl><FormMessage /></FormItem>)} />
                </div>
            </div>

             <div className="space-y-4 p-4 border rounded-lg">
                <h3 className="font-semibold text-lg">2. Business & Role</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="primaryRole" render={({ field }) => (<FormItem><FormLabel>Primary Role *</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select your primary role" /></SelectTrigger></FormControl><SelectContent><ScrollArea className="h-72">{businessRoles.map(role => (<SelectItem key={role} value={role}>{role}</SelectItem>))}</ScrollArea></SelectContent></Select><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="businessType" render={({ field }) => (<FormItem><FormLabel>Business Type *</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select your business type" /></SelectTrigger></FormControl><SelectContent className="max-h-72"><ScrollArea className="h-72">{businessTypes.map(type => (<SelectItem key={type} value={type}>{type}</SelectItem>))}</ScrollArea></SelectContent></Select><FormMessage /></FormItem>)} />
                 </div>
            </div>

            <div className="space-y-4 p-4 border rounded-lg">
                <h3 className="font-semibold text-lg">3. Geographical Area of Operation</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="country" render={({ field }) => (<FormItem><FormLabel>Country *</FormLabel><Select onValueChange={handleCountryChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select your country" /></SelectTrigger></FormControl><SelectContent className="max-h-60">{countries.map((country) => (<SelectItem key={country.code} value={country.name}>{country.name}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="phone" render={({ field }) => (<FormItem><FormLabel>Phone Number *</FormLabel><FormControl><div className="flex gap-2"><Input value={phoneCode} readOnly className="w-24 bg-muted font-mono" placeholder="Code" /><Input placeholder="Phone number" {...field} /></div></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="state" render={({ field }) => (<FormItem><FormLabel>State/Province</FormLabel><FormControl><Input placeholder="e.g., California" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="district" render={({ field }) => (<FormItem><FormLabel>District</FormLabel><FormControl><Input placeholder="e.g., Los Angeles" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="taluka" render={({ field }) => (<FormItem><FormLabel>Taluka/Block</FormLabel><FormControl><Input placeholder="e.g., Hollywood" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="village" render={({ field }) => (<FormItem><FormLabel>Village/Ward</FormLabel><FormControl><Input placeholder="e.g., Beverly Hills" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="street" render={({ field }) => (<FormItem className="md:col-span-2"><FormLabel>Street</FormLabel><FormControl><Input placeholder="e.g., Rodeo Drive" {...field} /></FormControl><FormMessage /></FormItem>)} />
                </div>
            </div>
            
            <div className="space-y-4 p-4 border rounded-lg">
                <h3 className="font-semibold text-lg">4. Select Your Franchise Tier</h3>
                 <FormField control={form.control} name="investmentTier" render={({ field }) => (<FormItem><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select your investment tier" /></SelectTrigger></FormControl><SelectContent>{franchiseTiers.map(tier => (<SelectItem key={tier.value} value={tier.value}><div className="flex flex-col"><span className="font-semibold">{tier.label}</span><span className="text-xs text-muted-foreground">{tier.description}</span></div></SelectItem>))}</SelectContent></Select><FormDescription>Each tier comes with PGC tokens equivalent to your investment (1 USD = 2 PGC).</FormDescription><FormMessage /></FormItem>)} />
            </div>

          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting} size="lg">{isSubmitting ? 'Creating Account...' : 'Apply & Create Account'}</Button>
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
