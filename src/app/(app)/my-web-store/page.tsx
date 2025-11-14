'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ShoppingCart, User, Share2, Youtube, Instagram, Star, Palette, Banknote, QrCode } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const features = [
  { icon: User, title: "About Me & Contact", description: "Share your story and make it easy for people to reach you." },
  { icon: Share2, title: "Social Media Links", description: "Connect your WhatsApp, Instagram, Telegram, Facebook, and more." },
  { icon: ShoppingCart, title: "Product Showcase", description: "Display up to 100 of your products or services directly on your page." },
  { icon: Youtube, title: "Embedded Videos", description: "Showcase your work with embedded videos from YouTube and Instagram." },
  { icon: Palette, title: "30+ Beautiful Themes", description: "Choose from a wide variety of themes to match your personal brand." },
  { icon: Banknote, title: "Payment Details", description: "Display your bank account, NEFT/IMPS details, and payment QR codes." },
];

const themePreviews = [
  { id: 1, name: 'Modern Dark', imageHint: 'dark modern' },
  { id: 2, name: 'Clean Light', imageHint: 'light minimal' },
  { id: 3, name: 'Vibrant Gradient', imageHint: 'vibrant gradient' },
  { id: 4, name: 'Professional Blue', imageHint: 'professional corporate' },
  { id: 5, name: 'Elegant Gold', imageHint: 'elegant gold' },
  { id: 6, name: 'Creative Green', imageHint: 'creative nature' },
];

export default function MyWebStorePage() {
  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto">
      <Card className="text-center bg-gradient-to-br from-primary/10 via-background to-background">
        <CardHeader>
          <Star className="mx-auto h-12 w-12 text-primary" />
          <CardTitle className="text-4xl font-headline mt-4">Create Your Digital V-Card & Web Store</CardTitle>
          <CardDescription className="text-lg max-w-3xl mx-auto">
            Your all-in-one digital identity. Share your details, showcase your products, and accept payments with a single, beautiful page.
          </CardDescription>
        </CardHeader>
        <CardContent>
             <p className="text-2xl font-bold text-primary">Just $10 USD</p>
             <p className="text-muted-foreground">(Payable in USDT)</p>
        </CardContent>
        <CardFooter className="justify-center">
            <Button asChild size="lg">
                <Link href="/presale">Get Your Web Store Now</Link>
            </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle>Powerful Features Included</CardTitle>
            <CardDescription>Everything you need to build your online presence.</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                     <div key={index} className="flex items-start gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mt-1 flex-shrink-0">
                            <Icon className="h-5 w-5" />
                        </div>
                        <div>
                            <h4 className="font-semibold">{feature.title}</h4>
                            <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </div>
                    </div>
                );
            })}
        </CardContent>
      </Card>

       <Card>
        <CardHeader>
            <CardTitle>Choose Your Style</CardTitle>
            <CardDescription>Select from over 30 themes to find the perfect look for your brand.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {themePreviews.map((theme) => (
                    <div key={theme.id} className="group relative overflow-hidden rounded-lg">
                        <Image 
                            src={`https://picsum.photos/seed/${theme.id}/400/300`}
                            alt={theme.name}
                            width={400}
                            height={300}
                            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                            data-ai-hint={theme.imageHint}
                        />
                        <div className="absolute inset-0 bg-black/50 flex items-end p-4">
                            <h4 className="text-white font-bold">{theme.name}</h4>
                        </div>
                    </div>
                ))}
            </div>
        </CardContent>
      </Card>

    </div>
  );
}
