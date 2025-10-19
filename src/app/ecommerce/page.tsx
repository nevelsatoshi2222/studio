
'use client';
import { AppLayout } from '@/components/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ecommCategories, ecommProducts } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';

export default function EcommercePage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="font-headline text-3xl font-bold">E-commerce Marketplace</h1>
          <p className="text-muted-foreground">
            Discover products and services from our community.
          </p>
        </div>
        <Tabs defaultValue={ecommCategories[0].title} className="w-full">
            <TabsList>
                {ecommCategories.map(category => (
                    <TabsTrigger key={category.title} value={category.title}>{category.title}</TabsTrigger>
                ))}
            </TabsList>
            {ecommCategories.map(category => (
                <TabsContent key={category.title} value={category.title}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
                        {ecommProducts.filter(p => p.category === category.title).map(product => (
                            <Card key={product.id} className="overflow-hidden">
                                <CardHeader className="p-0">
                                    <Image 
                                        src={`https://picsum.photos/seed/${product.imageId}/400/300`} 
                                        alt={product.name}
                                        width={400}
                                        height={300}
                                        className="w-full h-48 object-cover"
                                        data-ai-hint="product photo"
                                    />
                                </CardHeader>
                                <CardContent className="p-4 space-y-2">
                                    <CardTitle className="text-lg">{product.name}</CardTitle>
                                    <CardDescription>{product.description}</CardDescription>
                                    <div className="flex justify-between items-center pt-2">
                                        <p className="font-bold text-primary">{product.priceITC} ITC</p>
                                        <Button size="sm">Buy Now</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            ))}
        </Tabs>
      </div>
    </AppLayout>
  );
}
