'use client';
import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import Image from 'next/image';
import { placeholderImages } from '@/lib/placeholder-images.json';
import { EcommProduct } from '@/lib/types';
import { ShoppingCart } from 'lucide-react';


// Main dashboard content sections
const sections = [
  'worldPerspective',
  'newIndia',
  'quiz',
  'polls',
  'conclusion'
];

const featuredProducts: EcommProduct[] = [
  {
    id: 1,
    name: 'Premium Leather Wallet',
    description: 'Sleek, durable, and handcrafted.',
    priceITC: 8,
    priceUSD: 60,
    imageId: 'prod-wallet',
    category: 'Fashion',
    subcategory: 'Accessories'
  },
  {
    id: 2,
    name: 'Wireless BT Headphones',
    description: 'High-fidelity sound, 20-hour battery.',
    priceITC: 15,
    priceUSD: 112,
    imageId: 'prod-headphones',
    category: 'Electronics',
    subcategory: 'Audio'
  },
  {
    id: 3,
    name: 'Smart Fitness Tracker',
    description: 'Monitor your health and workouts.',
    priceITC: 10,
    priceUSD: 75,
    imageId: 'prod-tracker',
    category: 'Electronics',
    subcategory: 'Wearables'
  },
  {
    id: 4,
    name: 'Stainless Steel Water Bottle',
    description: 'Stay hydrated with this insulated bottle.',
    priceITC: 4,
    priceUSD: 30,
    imageId: 'prod-bottle',
    category: 'Home',
    subcategory: 'Kitchenware'
  },
  {
    id: 5,
    name: 'Organic Cotton T-Shirt',
    description: 'Soft, comfortable, and eco-friendly.',
    priceITC: 3,
    priceUSD: 22.5,
    imageId: 'prod-tshirt',
    category: 'Fashion',
    subcategory: 'Apparel'
  },
  {
    id: 6,
    name: 'Modern Ceramic Vase',
    description: 'A beautiful and minimalist vase.',
    priceITC: 7,
    priceUSD: 52.5,
    imageId: 'prod-vase',
    category: 'Home',
    subcategory: 'Decor'
  }
];

export default function Dashboard() {
  const { t, currentLanguage } = useTranslation();

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{t('common.welcome')}</CardTitle>
              <CardDescription>Explore the platform in your preferred language.</CardDescription>
            </div>
            <LanguageSwitcher />
          </div>
        </CardHeader>
      </Card>
      
      {/* Featured Products Section */}
      <Card>
        <CardHeader>
          <CardTitle>Featured Products</CardTitle>
          <CardDescription>Get these items by purchasing a presale package.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => {
              const productImage = placeholderImages.find(p => p.id === product.imageId);
              return (
                <Card key={product.id} className="group overflow-hidden flex flex-col">
                  <div className="relative h-48 w-full overflow-hidden">
                    {productImage && (
                      <Image 
                        src={productImage.imageUrl} 
                        alt={product.name} 
                        fill
                        style={{ objectFit: 'cover' }}
                        className="transition-transform duration-300 group-hover:scale-105"
                        data-ai-hint={productImage.imageHint}
                      />
                    )}
                  </div>
                  <CardHeader className="flex-grow">
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <CardDescription>{product.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xl font-bold text-primary">{product.priceITC} ITC / ${product.priceUSD}</p>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full">
                      <Link href="/presale">
                        <ShoppingCart className="mr-2 h-4 w-4" /> Buy with Presale Package
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map(section => (
          <Card key={section} className="flex flex-col">
            <CardHeader>
              <CardTitle>{t(`navigation.${section}`)}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground">
                {/* Dummy content - you can add specific descriptions here */}
                Explore the {t(`navigation.${section}`)} section to learn more about our governance model.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline">
                <Link href={`/governance/${section.replace(/([A-Z])/g, "-$1").toLowerCase()}`}>
                  Go to {t(`navigation.${section}`)}
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
