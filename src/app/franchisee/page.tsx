
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Building2, ShoppingBag, Utensils, Carrot, Wheat, Milk, GraduationCap, Plane, MapPin } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const franchiseCategories = [
    { name: 'Main', icon: Building2 },
    { name: 'Services', icon: ShoppingBag },
    { name: 'Food', icon: Utensils },
    { name: 'Vegetables', icon: Carrot },
    { name: 'Grains', icon: Wheat },
    { name: 'Pulses', icon: Wheat },
    { name: 'Milk', icon: Milk },
    { name: 'Dairy products', icon: Milk },
    { name: 'Beverages', icon: Utensils },
    { name: 'Oils', icon: Utensils },
    { name: 'Education', icon: GraduationCap },
    { name: 'Travel', icon: Plane },
];

const franchiseLevels = [
    { name: 'Street Franchisee', description: 'Operate at a hyper-local street level.' },
    { name: 'Village/Ward Franchisee', description: 'Cover an entire village or city ward.' },
    { name: 'Block/Kasba Franchisee', description: 'Manage franchise operations for a block.' },
    { name: 'Taluka Franchisee', description: 'Oversee a taluka or sub-district.' },
    { name: 'District Franchisee', description: 'Lead franchise activities for a whole district.' },
    { name: 'Area Franchisee', description: 'Manage a larger designated area.' },
    { name: 'State Franchisee', description: 'Head the franchise program for an entire state.' },
];

export default function FranchiseePage() {
  return (
      <div className="flex flex-col gap-8">
        <Card className="text-center">
            <CardHeader>
                <Building2 className="mx-auto h-12 w-12 text-primary" />
                <CardTitle className="text-3xl font-headline mt-4">Franchisee Program</CardTitle>
                <CardDescription className="text-lg max-w-3xl mx-auto">
                    Partner with us to build a decentralized network of goods and services. Our franchisee program offers a unique opportunity to grow your business and be part of a global ecosystem.
                </CardDescription>
            </CardHeader>
            <CardFooter className="justify-center">
                <Button asChild size="lg">
                    <Link href="/register?role=Franchisee">Apply Now</Link>
                </Button>
            </CardFooter>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Franchise Categories</CardTitle>
                <CardDescription>We offer a wide range of franchise opportunities across various sectors.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {franchiseCategories.map((category) => {
                    const Icon = category.icon;
                    return (
                        <div key={category.name} className="flex items-center gap-3 p-3 rounded-lg border bg-muted/50">
                            <Icon className="h-6 w-6 text-primary" />
                            <span className="font-medium">{category.name}</span>
                        </div>
                    );
                })}
            </CardContent>
        </Card>

         <Card>
            <CardHeader>
                <CardTitle>Franchise Levels</CardTitle>
                <CardDescription>Our program has a multi-tiered structure, allowing you to operate at a scale that suits you.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {franchiseLevels.map((level) => (
                    <div key={level.name} className="flex items-start gap-4 rounded-lg border p-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary mt-1">
                            <MapPin className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-lg">{level.name}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{level.description}</p>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>

      </div>
  );
}
