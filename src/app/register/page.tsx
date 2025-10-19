'use client';
import { Suspense } from 'react';
import { AppLayout } from '@/components/app-layout';
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
import { useSearchParams } from 'next/navigation';
import { UserPlus } from 'lucide-react';
import { countries } from '@/lib/data';

function RegistrationForm() {
  const searchParams = useSearchParams();
  const referralCode = searchParams.get('ref') || 'ADMIN_REF_CODE';

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <UserPlus className="h-6 w-6" />
            </div>
            <div>
                <CardTitle className="text-2xl font-headline">Create Your Account</CardTitle>
                <CardDescription>Join the IBC Connect platform and be part of the future.</CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="you@example.com" required />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" required />
                </div>
            </div>
            
            <div className="space-y-2">
                <Label htmlFor="street">Street Address</Label>
                <Input id="street" placeholder="123 Main St" required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="village">Village / Town</Label>
                    <Input id="village" placeholder="Springfield" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="taluka">Taluka / Sub-district</Label>
                    <Input id="taluka" placeholder="Springfield Taluka" required />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="district">District</Label>
                    <Input id="district" placeholder="Shelbyville District" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="state">State / Province</Label>
                    <Input id="state" placeholder="Illinois" required />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Select required>
                        <SelectTrigger id="country">
                            <SelectValue placeholder="Select your country" />
                        </SelectTrigger>
                        <SelectContent>
                            {countries.map(country => (
                                <SelectItem key={country.value} value={country.value}>
                                    {country.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="referral-code">Referral Code</Label>
                    <Input id="referral-code" defaultValue={referralCode} />
                </div>
            </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button type="submit" className="w-full">Register</Button>
      </CardFooter>
    </Card>
  );
}


export default function RegisterPage() {
  return (
    <AppLayout>
      <Suspense fallback={<div>Loading...</div>}>
        <RegistrationForm />
      </Suspense>
    </AppLayout>
  );
}
