
'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown } from 'lucide-react';
import Link from 'next/link';

export function RequestOfferCard() {
  return (
    <Card className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-6 w-6" />
          Request a Direct Offer
        </CardTitle>
        <CardDescription className="text-white/90">
          Are you a top performer? Do you have a significant network or social media following? You may be eligible for a special direct offer from our admin team.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild size="lg" variant="secondary" className="w-full text-amber-700">
          <Link href="/contact?subject=Direct%20Offer%20Request">
            Contact Admin to Request an Offer
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
