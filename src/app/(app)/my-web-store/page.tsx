
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ShoppingCart, User, Share2, Youtube, Instagram, Star, Palette, Banknote, QrCode, Mail, Phone } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';


const features = [
  { icon: User, title: "About Me & Contact", description: "Share your story and make it easy for people to reach you." },
  { icon: Share2, title: "Social Media Links", description: "Connect your WhatsApp, Instagram, Telegram, Facebook, and more." },
  { icon: ShoppingCart, title: "Product Showcase", description: "Display up to 100 of your products or services directly on your page." },
  { icon: Youtube, title: "Embedded Videos", description: "Showcase your work with embedded videos from YouTube and Instagram." },
  { icon: Palette, title: "30+ Beautiful Themes", description: "Choose from a wide variety of themes to match your personal brand." },
  { icon: Banknote, title: "Payment Details", description: "Display your bank account, NEFT/IMPS details, and payment QR codes." },
];

const themePreviews = [
  { 
    id: 1, 
    name: 'Sleek Product Sales', 
    purpose: 'Products',
    bg: 'bg-gray-900',
    primary: 'text-white',
    secondary: 'text-gray-400',
    accent: 'bg-indigo-600',
    buttonText: 'text-white'
  },
  { 
    id: 2, 
    name: 'Minimal Service Booking', 
    purpose: 'Services',
    bg: 'bg-white',
    primary: 'text-gray-800',
    secondary: 'text-gray-500',
    accent: 'bg-gray-800',
    buttonText: 'text-white'
  },
  { 
    id: 3, 
    name: 'Creative Portfolio', 
    purpose: 'Portfolio',
    bg: 'bg-gradient-to-br from-purple-600 to-indigo-600',
    primary: 'text-white',
    secondary: 'text-purple-200',
    accent: 'bg-white',
    buttonText: 'text-indigo-600'
  },
  { 
    id: 4, 
    name: 'Corporate Professional', 
    purpose: 'Services',
    bg: 'bg-blue-50',
    primary: 'text-blue-900',
    secondary: 'text-blue-700',
    accent: 'bg-blue-700',
    buttonText: 'text-white'
  },
  { 
    id: 5, 
    name: 'Luxury Goods', 
    purpose: 'Products',
    bg: 'bg-gray-800',
    primary: 'text-yellow-400',
    secondary: 'text-gray-300',
    accent: 'bg-yellow-400',
    buttonText: 'text-gray-900'
  },
  { 
    id: 6, 
    name: 'Health & Wellness', 
    purpose: 'Booking',
    bg: 'bg-green-50',
    primary: 'text-green-900',
    secondary: 'text-green-700',
    accent: 'bg-green-600',
    buttonText: 'text-white'
  },
];

const VCardPreview = ({ theme }: { theme: typeof themePreviews[0] }) => (
    <div className={`${theme.bg} w-full h-full rounded-lg shadow-lg p-4 flex flex-col text-xs`}>
        <div className="flex-shrink-0 text-center mb-3">
            <Avatar className="w-16 h-16 mx-auto border-2 border-white/50">
                <AvatarImage src={`https://picsum.photos/seed/${theme.id}/96/96`} />
                <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <h3 className={`font-bold mt-2 text-lg ${theme.primary}`}>Username</h3>
            <p className={theme.secondary}>Digital Creator | Consultant</p>
        </div>
        
        <div className="flex justify-center gap-2 mb-3">
            <div className={`${theme.accent} ${theme.buttonText} p-1.5 rounded-full`}><Phone className="h-3 w-3" /></div>
            <div className={`${theme.accent} ${theme.buttonText} p-1.5 rounded-full`}><Mail className="h-3 w-3" /></div>
            <div className={`${theme.accent} ${theme.buttonText} p-1.5 rounded-full`}><Instagram className="h-3 w-3" /></div>
            <div className={`${theme.accent} ${theme.buttonText} p-1.5 rounded-full`}><Youtube className="h-3 w-3" /></div>
        </div>

        <div className="space-y-2 mb-3">
            <button className={`w-full text-center p-1.5 rounded-md ${theme.accent} ${theme.buttonText} font-semibold`}>
                {theme.purpose === 'Booking' ? 'Book a Consultation' : 'Contact Me'}
            </button>
        </div>
        
        <div className="flex-grow overflow-y-auto space-y-3">
            <h4 className={`font-bold ${theme.primary}`}>Products & Services</h4>
            <div className="grid grid-cols-2 gap-2">
                {[1, 2].map((i) => (
                    <div key={i} className="bg-white/10 backdrop-blur-sm rounded-md p-1.5">
                        <div className="aspect-square bg-gray-500/50 rounded-sm mb-1"></div>
                        <p className={`font-semibold ${theme.secondary}`}>Product {i}</p>
                    </div>
                ))}
            </div>
        </div>
    </div>
);


export default function MyWebStorePage() {
  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto">
      <Card className="text-center bg-gradient-to-br from-primary/10 via-background to-background">
        <CardHeader>
          <Star className="mx-auto h-12 w-12 text-primary" />
          <CardTitle className="text-4xl font-headline mt-4">Create My Web Store</CardTitle>
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
            <Carousel
                opts={{
                    align: "start",
                    loop: true,
                }}
                className="w-full max-w-4xl mx-auto"
            >
                <CarouselContent>
                    {themePreviews.map((theme) => (
                        <CarouselItem key={theme.id} className="md:basis-1/2 lg:basis-1/3">
                            <div className="p-1">
                                <Card className="overflow-hidden">
                                    <CardContent className="p-0 aspect-[9/16]">
                                        <VCardPreview theme={theme} />
                                    </CardContent>
                                    <CardFooter className="p-2 bg-muted/50">
                                        <div className="text-center w-full">
                                            <p className="font-semibold text-sm">{theme.name}</p>
                                            <Badge variant="outline" className="mt-1">{theme.purpose}</Badge>
                                        </div>
                                    </CardFooter>
                                </Card>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="hidden sm:flex" />
                <CarouselNext className="hidden sm:flex" />
            </Carousel>
        </CardContent>
      </Card>
    </div>
  );
}

  