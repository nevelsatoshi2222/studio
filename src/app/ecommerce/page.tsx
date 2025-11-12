
'use client';
import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { placeholderImages } from '@/lib/placeholder-images.json';
import { EcommProduct } from '@/lib/types';
import { useSearchParams } from 'next/navigation';


const menuItems = [
    { 
        title: 'Electronics',
        subItems: [
            { title: 'Smartphones' },
            { title: 'Laptops' },
            { title: 'Cameras' },
            { title: 'Headphones' },
        ]
    },
    {
        title: 'Fashion',
        subItems: [
            { title: 'Men\'s Clothing' },
            { title: 'Women\'s Clothing' },
            { title: 'Shoes & Accessories' },
        ]
    },
    {
        title: 'Home & Garden',
        subItems: [
            { title: 'Furniture' },
            { title: 'Kitchenware' },
            { title: 'Gardening Tools' },
        ]
    },
    {
        title: 'Books & Media',
        subItems: []
    },
    {
        title: 'Health & Beauty',
        subItems: []
    }
];

const joinAsMenuItems = [
    {
        title: 'Franchisee',
        subItems: ['Franchisee Supplier', 'Franchisee Wholesaler', 'Franchisee Stockist']
    },
    {
        title: 'Manufacturer / Supplier / Producer',
        subItems: []
    },
    {
        title: 'Service Provider',
        subItems: ['Doctors', 'C.A.', 'Lawyer', 'Beautician', 'Yoga Teacher', 'Tution Teacher', 'Travel', 'Electrician', 'Plumber', 'Painter']
    },
    {
        title: 'Sports',
        subItems: ['Indoor Sports', 'Outdoor Sports']
    },
    {
        title: 'Arts',
        subItems: ['Painters', 'Musicians', 'Dancers', 'Writers', 'Actors']
    },
    {
        title: 'Influencer',
        description: "Earn from a prize pool funded by 1% of your country's invested revenue, distributed based on content views.",
        subItems: []
    },
    {
        title: 'Shipping & Logistics',
        description: 'Join our network to provide local, international, or dropshipping services. Offer competitive rates and reach a global market.',
        subItems: ['Local Shipping Partner', 'International Shipping Partner', 'Dropshipping Partner']
    }
];

const featuredProducts: EcommProduct[] = [
  {
    id: 1,
    name: 'Premium Leather Wallet',
    description: 'A sleek and durable wallet, handcrafted from genuine leather.',
    priceITC: 8,
    priceUSD: 60,
    imageId: 'prod-wallet',
    category: 'Fashion',
    subcategory: 'Shoes & Accessories'
  },
  {
    id: 2,
    name: 'Wireless BT Headphones',
    description: 'High-fidelity sound, 20-hour battery life.',
    priceITC: 15,
    priceUSD: 112,
    imageId: 'prod-headphones',
    category: 'Electronics',
    subcategory: 'Headphones'
  },
  {
    id: 3,
    name: 'Smart Fitness Tracker',
    description: 'Monitor your health and workouts with this sleek device.',
    priceITC: 10,
    priceUSD: 75,
    imageId: 'prod-tracker',
    category: 'Electronics',
    subcategory: 'Smartphones'
  },
  {
    id: 4,
    name: 'Stainless Steel Water Bottle',
    description: 'Stay hydrated with this double-walled, insulated bottle.',
    priceITC: 4,
    priceUSD: 30,
    imageId: 'prod-bottle',
    category: 'Home & Garden',
    subcategory: 'Kitchenware'
  },
  {
    id: 5,
    name: 'Organic Cotton T-Shirt',
    description: 'A soft, comfortable, and eco-friendly t-shirt.',
    priceITC: 3,
    priceUSD: 22.5,
    imageId: 'prod-tshirt',
    category: 'Fashion',
    subcategory: 'Men\'s Clothing'
  },
  {
    id: 6,
    name: 'Modern Ceramic Vase',
    description: 'A beautiful and minimalist vase for your home decor.',
    priceITC: 7,
    priceUSD: 52.5,
    imageId: 'prod-vase',
    category: 'Home & Garden',
    subcategory: 'Furniture'
  },
  {
    id: 7,
    name: 'Professional Chef\'s Knife',
    description: 'A high-carbon stainless steel knife for all your kitchen needs.',
    priceITC: 12,
    priceUSD: 90,
    imageId: 'prod-knife',
    category: 'Home & Garden',
    subcategory: 'Kitchenware'
  },
  {
    id: 8,
    name: 'Portable Power Bank',
    description: 'Charge your devices on the go with this 20,000mAh power bank.',
    priceITC: 9,
    priceUSD: 67.5,
    imageId: 'prod-powerbank',
    category: 'Electronics',
    subcategory: 'Smartphones'
  },
  {
    id: 9,
    name: 'Yoga & Exercise Mat',
    description: 'A non-slip, eco-friendly mat for your fitness routine.',
    priceITC: 5,
    priceUSD: 37.5,
    imageId: 'prod-yogamat',
    category: 'Health & Beauty',
    subcategory: 'Fitness'
  },
  {
    id: 10,
    name: 'Handmade Scented Candle',
    description: 'A soy wax candle with a relaxing lavender scent.',
    priceITC: 3,
    priceUSD: 22.5,
    imageId: 'prod-candle',
    category: 'Home & Garden',
    subcategory: 'Furniture'
  },
  {
    id: 11,
    name: 'Leather Messenger Bag',
    description: 'A stylish and functional bag for work or travel.',
    priceITC: 25,
    priceUSD: 187.5,
    imageId: 'prod-messengerbag',
    category: 'Fashion',
    subcategory: 'Shoes & Accessories'
  },
  {
    id: 12,
    name: 'Digital Drawing Tablet',
    description: 'Unleash your creativity with this pressure-sensitive tablet.',
    priceITC: 18,
    priceUSD: 135,
    imageId: 'prod-drawingtablet',
    category: 'Electronics',
    subcategory: 'Laptops'
  },
  {
    id: 13,
    name: 'Gourmet Coffee Beans',
    description: 'A 1kg bag of premium, single-origin Arabica coffee beans.',
    priceITC: 4,
    priceUSD: 30,
    imageId: 'prod-coffeebeans',
    category: 'Home & Garden',
    subcategory: 'Kitchenware'
  },
  {
    id: 14,
    name: 'Hardcover Fiction Novel',
    description: 'The latest bestseller from a world-renowned author.',
    priceITC: 3,
    priceUSD: 22.5,
    imageId: 'prod-novel',
    category: 'Books & Media',
    subcategory: 'Books'
  },
  {
    id: 15,
    name: 'Aviator Sunglasses',
    description: 'Classic sunglasses with polarized lenses for UV protection.',
    priceITC: 6,
    priceUSD: 45,
    imageId: 'prod-sunglasses',
    category: 'Fashion',
    subcategory: 'Shoes & Accessories'
  },
  {
    id: 16,
    name: 'Desktop Mechanical Keyboard',
    description: 'A tactile and responsive keyboard for typing and gaming.',
    priceITC: 14,
    priceUSD: 105,
    imageId: 'prod-keyboard',
    category: 'Electronics',
    subcategory: 'Laptops'
  },
  {
    id: 17,
    name: 'Silk Necktie',
    description: 'A luxurious, 100% silk tie for formal occasions.',
    priceITC: 5,
    priceUSD: 37.5,
    imageId: 'prod-necktie',
    category: 'Fashion',
    subcategory: 'Men\'s Clothing'
  },
  {
    id: 18,
    name: 'Compact Travel Umbrella',
    description: 'A windproof and lightweight umbrella for any weather.',
    priceITC: 3,
    priceUSD: 22.5,
    imageId: 'prod-umbrella',
    category: 'Fashion',
    subcategory: 'Shoes & Accessories'
  },
  {
    id: 19,
    name: 'Electric Toothbrush',
    description: 'A powerful toothbrush with multiple cleaning modes.',
    priceITC: 11,
    priceUSD: 82.5,
    imageId: 'prod-toothbrush',
    category: 'Health & Beauty',
    subcategory: 'Personal Care'
  },
  {
    id: 20,
    name: 'Gardening Tool Set',
    description: 'A 3-piece set including a trowel, transplanter, and cultivator.',
    priceITC: 6,
    priceUSD: 45,
    imageId: 'prod-gardentools',
    category: 'Home & Garden',
    subcategory: 'Gardening Tools'
  }
];


export default function EcommercePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredProducts = selectedCategory
    ? featuredProducts.filter(p => p.category === selectedCategory || p.subcategory === selectedCategory)
    : featuredProducts;

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
  };
  
  const handleViewAll = () => {
    setSelectedCategory(null);
  };

  return (
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="font-headline text-3xl font-bold">E-commerce Marketplace</h1>
          <p className="text-muted-foreground">
            Buy and sell goods using ITC, ICE, and other currencies.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-4">
            <aside className="md:col-span-1 space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Categories</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Button variant="link" onClick={handleViewAll} className="p-0 h-auto mb-2">View All</Button>
                        <Accordion type="multiple" className="w-full">
                            {menuItems.map((item, index) => (
                                <AccordionItem value={`item-${index}`} key={item.title}>
                                    <AccordionTrigger onClick={() => handleSelectCategory(item.title)}>{item.title}</AccordionTrigger>
                                    <AccordionContent>
                                        <ul className="space-y-2 pl-4">
                                            {item.subItems.length > 0 ? (
                                                item.subItems.map(subItem => (
                                                    <li key={subItem.title}>
                                                        <button onClick={() => handleSelectCategory(subItem.title)} className="hover:text-primary hover:underline text-left">
                                                            {subItem.title}
                                                        </button>
                                                    </li>
                                                ))
                                            ) : (
                                                <li><span className="text-muted-foreground text-sm">Coming soon</span></li>
                                            )}
                                        </ul>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Join As</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Accordion type="multiple" className="w-full">
                            {joinAsMenuItems.map((item, index) => (
                                <AccordionItem value={`join-item-${index}`} key={item.title}>
                                    <AccordionTrigger>{item.title}</AccordionTrigger>
                                    <AccordionContent>
                                        {item.description && <p className="text-sm text-muted-foreground pl-4 mb-2">{item.description}</p>}
                                        <ul className="space-y-2 pl-4">
                                          {item.subItems.length > 0 ? (
                                            item.subItems.map(subItem => (
                                              <li key={subItem}>
                                                <Link href={`/register?role=${encodeURIComponent(subItem)}`} className="hover:text-primary hover:underline">
                                                  {subItem}
                                                </Link>
                                              </li>
                                            ))
                                          ) : (
                                            <li>
                                              <Link href={`/register?role=${encodeURIComponent(item.title)}`} className="hover:text-primary hover:underline text-sm">
                                                Apply to be a {item.title}
                                              </Link>
                                            </li>
                                          )}
                                        </ul>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </CardContent>
                </Card>
            </aside>
            <main className="md:col-span-3">
                 <Card>
                    <CardHeader>
                        <CardTitle>
                          {selectedCategory ? `Products in "${selectedCategory}"` : 'Featured Products'}
                        </CardTitle>
                        <CardDescription>
                          {selectedCategory 
                            ? `Showing ${filteredProducts.length} products.` 
                            : 'Discover the best products available in our marketplace.'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map((product) => {
                                    const productImage = placeholderImages.find(p => p.id === product.imageId);
                                    if (!productImage) return null;
                                    
                                    return (
                                    <Card key={product.id} className="group overflow-hidden">
                                        <div className="relative h-48 w-full overflow-hidden">
                                            <Image 
                                                src={productImage.imageUrl} 
                                                alt={product.name} 
                                                fill
                                                style={{ objectFit: 'cover' }}
                                                className="transition-transform duration-300 group-hover:scale-105"
                                                data-ai-hint={productImage.imageHint}
                                            />
                                        </div>
                                        <CardHeader>
                                            <CardTitle className="text-lg">{product.name}</CardTitle>
                                            <CardDescription>{product.description}</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex items-baseline gap-2">
                                                <p className="text-xl font-bold text-primary">{product.priceITC} ITC</p>
                                                <p className="text-sm text-muted-foreground">/ ${product.priceUSD}</p>
                                            </div>
                                        </CardContent>
                                        <CardFooter>
                                            <Button className="w-full">
                                                <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                    );
                                })
                            ) : (
                                <div className="col-span-full text-center text-muted-foreground py-10">
                                    <p>No products found in this category.</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
      </div>
  );
}
