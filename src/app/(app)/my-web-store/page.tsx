
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ShoppingCart, User, Share2, Youtube, Instagram, Star, Palette, Banknote, QrCode, Mail, Phone, BookOpen, Utensils, Wheat, Leaf, Wrench } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { placeholderImages } from '@/lib/placeholder-images.json';

const features = [
  { icon: User, title: "About Me & Contact", description: "Share your story and make it easy for people to reach you." },
  { icon: Share2, title: "Social Media Links", description: "Connect your WhatsApp, Instagram, Telegram, Facebook, and more." },
  { icon: ShoppingCart, title: "Product Showcase", description: "Display up to 100 of your products or services directly on your page." },
  { icon: Youtube, title: "Embedded Videos", description: "Showcase your work with embedded videos from YouTube and Instagram." },
  { icon: Palette, title: "30+ Beautiful Themes", description: "Choose from a wide variety of themes to match your personal brand." },
  { icon: Banknote, title: "Payment Details", description: "Display your bank account, NEFT/IMPS details, and payment QR codes." },
];

const colorPalettes = [
  { id: 'slate', name: 'Slate', bg: 'bg-slate-900', primary: 'text-white', secondary: 'text-slate-400', accent: 'bg-blue-600', buttonText: 'text-white' },
  { id: 'gold', name: 'Gold', bg: 'bg-gray-800', primary: 'text-yellow-400', secondary: 'text-gray-300', accent: 'bg-yellow-400', buttonText: 'text-gray-900' },
  { id: 'forest', name: 'Forest', bg: 'bg-green-900', primary: 'text-white', secondary: 'text-green-200', accent: 'bg-green-500', buttonText: 'text-white' },
  { id: 'rose', name: 'Rose', bg: 'bg-rose-100', primary: 'text-rose-900', secondary: 'text-rose-700', accent: 'bg-rose-600', buttonText: 'text-white' },
  { id: 'ocean', name: 'Ocean', bg: 'bg-white', primary: 'text-blue-800', secondary: 'text-gray-600', accent: 'bg-blue-600', buttonText: 'text-white' },
];

const businessCategories = {
  vegetables: { name: 'Vegetables', icon: Leaf, purpose: 'Retail', mock: { title: 'Fresh Organic Produce', avatarId: 'avatar-veg', products: ['prod-tomatoes', 'prod-spinach', 'prod-carrots', 'prod-cucumbers'] } },
  grains: { name: 'Grains', icon: Wheat, purpose: 'Retail', mock: { title: 'Authentic Grains & Flour', avatarId: 'avatar-grains', products: ['prod-rice', 'prod-wheat', 'prod-millet', 'prod-lentils'] } },
  food: { name: 'Food', icon: Utensils, purpose: 'Service', mock: { title: 'Gourmet Catering Co.', avatarId: 'avatar-food', products: ['prod-wedding-pkg', 'prod-corp-lunch', 'prod-party-platter', 'prod-dessert-bar'] } },
  services: { name: 'Services', icon: Wrench, purpose: 'Booking', mock: { title: 'Expert Plumbing Solutions', avatarId: 'avatar-services', products: ['prod-leak-repair', 'prod-pipe-install', 'prod-drain-clean', 'prod-emergency-callout'] } },
  education: { name: 'Education', icon: BookOpen, purpose: 'Booking', mock: { title: 'Math & Science Tutoring', avatarId: 'avatar-education', products: ['prod-algebra', 'prod-physics', 'prod-chemistry', 'prod-calculus'] } },
  online: { name: 'Online Retail', icon: ShoppingCart, purpose: 'Retail', mock: { title: 'Modern Fashion Store', avatarId: 'avatar-online', products: ['prod-summer-dress', 'prod-leather-jacket', 'prod-tshirt', 'prod-running-shoes'] } },
};

type BusinessCategory = keyof typeof businessCategories;

const VCardPreview = ({ theme, category }: { theme: typeof colorPalettes[0], category: typeof businessCategories[BusinessCategory] }) => {
    const avatar = placeholderImages.find(p => p.id === category.mock.avatarId);

    return (
    <div className={cn("w-full h-[550px] rounded-lg shadow-lg p-4 flex flex-col text-sm", theme.bg)}>
        <div className="flex-shrink-0 text-center mb-4">
            <Avatar className="w-20 h-20 mx-auto border-4 border-white/50 shadow-md">
                {avatar && <AvatarImage src={avatar.imageUrl} data-ai-hint={avatar.imageHint} />}
                <AvatarFallback>{category.mock.title.charAt(0)}</AvatarFallback>
            </Avatar>
            <h3 className={cn("font-bold mt-2 text-xl", theme.primary)}>{category.mock.title}</h3>
            <p className={cn("text-base", theme.secondary)}>{category.purpose === 'Retail' ? 'High-Quality Products' : 'Professional Services'}</p>
        </div>
        
        <div className="flex justify-center gap-3 mb-4">
            <div className={cn("p-2 rounded-full", theme.accent, theme.buttonText)}><Phone className="h-4 w-4" /></div>
            <div className={cn("p-2 rounded-full", theme.accent, theme.buttonText)}><Mail className="h-4 w-4" /></div>
            <div className={cn("p-2 rounded-full", theme.accent, theme.buttonText)}><Instagram className="h-4 w-4" /></div>
            <div className={cn("p-2 rounded-full", theme.accent, theme.buttonText)}><Youtube className="h-4 w-4" /></div>
        </div>

        <div className="space-y-3 mb-4">
            <button className={cn("w-full text-center py-2 rounded-md font-semibold", theme.accent, theme.buttonText)}>
                {category.purpose === 'Booking' ? 'Book an Appointment' : 'View All Products'}
            </button>
        </div>
        
        <div className="flex-grow overflow-y-auto space-y-3 pr-2">
            <h4 className={cn("font-bold text-lg", theme.primary)}>Featured {category.purpose === 'Retail' ? 'Products' : 'Services'}</h4>
            <div className="grid grid-cols-2 gap-3">
                {category.mock.products.map((productId, i) => {
                    const product = placeholderImages.find(p => p.id === productId);
                    if (!product) return null;
                    return (
                        <div key={i} className="bg-white/10 backdrop-blur-sm rounded-lg p-2">
                            <div className="aspect-square bg-gray-500/50 rounded-md mb-2">
                                <Image src={product.imageUrl} alt={product.description} width={150} height={150} className="w-full h-full object-cover rounded-md" data-ai-hint={product.imageHint} />
                            </div>
                            <p className={cn("font-semibold truncate", theme.secondary)}>{product.description}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    </div>
    );
};


export default function MyWebStorePage() {
  const [activeCategory, setActiveCategory] = useState<BusinessCategory>('online');
  const [activePalette, setActivePalette] = useState<typeof colorPalettes[0]>(colorPalettes[0]);

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto">
      <Card className="text-center bg-gradient-to-br from-primary/10 via-background to-background">
        <CardHeader>
          <Star className="mx-auto h-12 w-12 text-primary" />
          <CardTitle className="text-4xl font-headline mt-4">Create My Web Store</CardTitle>
          <CardDescription className="text-lg max-w-3xl mx-auto">
            Your all-in-one digital identity. Share your details, showcase your products, and accept payments with a single, beautiful page.
          </CardDescription>
        </CardHeader>
        <CardContent>
             <p className="text-2xl font-bold text-primary">Just $25 USD</p>
             <p className="text-muted-foreground">(Payable in USDT)</p>
        </CardContent>
        <CardFooter className="justify-center">
            <Button asChild size="lg">
                <Link href="/register">Get Your Web Store Now</Link>
            </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle>Interactive Theme Previewer</CardTitle>
            <CardDescription>See how your "My Web Store" page could look. Select a business type and color palette.</CardDescription>
        </CardHeader>
        <CardContent className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
                <div>
                  <h3 className="font-semibold mb-3">1. Select a Business Type</h3>
                   <Tabs defaultValue={activeCategory} onValueChange={(value) => setActiveCategory(value as BusinessCategory)} className="w-full">
                      <TabsList className="grid w-full grid-cols-3 h-auto flex-wrap">
                        {Object.entries(businessCategories).map(([key, { name, icon: Icon }]) => (
                            <TabsTrigger key={key} value={key} className="flex flex-col gap-1.5 h-16">
                                <Icon className="h-5 w-5" />
                                <span className="text-xs">{name}</span>
                            </TabsTrigger>
                        ))}
                      </TabsList>
                   </Tabs>
                </div>
                <div>
                    <h3 className="font-semibold mb-3">2. Choose a Color Palette</h3>
                    <div className="flex flex-wrap gap-3">
                        {colorPalettes.map(palette => (
                            <button key={palette.id} onClick={() => setActivePalette(palette)} className={cn("h-10 w-10 rounded-full border-2 transition-transform hover:scale-110", activePalette.id === palette.id ? 'border-primary ring-2 ring-primary ring-offset-2 ring-offset-background' : 'border-muted')}>
                                <div className={cn("h-full w-full rounded-full", palette.bg)} />
                            </button>
                        ))}
                    </div>
                </div>
                 <div className="pt-4">
                    <h3 className="font-semibold mb-3">Powerful Features Included</h3>
                    <div className="space-y-4">
                        {features.slice(0, 3).map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <div key={index} className="flex items-start gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary mt-1 flex-shrink-0">
                                        <Icon className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-sm">{feature.title}</h4>
                                        <p className="text-xs text-muted-foreground">{feature.description}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            <div className="lg:col-span-2">
                <Card className="overflow-hidden">
                    <CardContent className="p-2 bg-muted/20">
                        <div className="max-w-sm mx-auto">
                           <VCardPreview theme={activePalette} category={businessCategories[activeCategory]} />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
