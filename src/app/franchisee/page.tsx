
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Building2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { franchiseCategories } from '@/lib/franchise-data';

export default function FranchiseePage() {
  return (
      <div className="flex flex-col gap-8 max-w-6xl mx-auto">
        <Card className="text-center bg-gradient-to-br from-primary/10 via-background to-background">
            <CardHeader>
                <Building2 className="mx-auto h-12 w-12 text-primary" />
                <CardTitle className="text-3xl font-headline mt-4">Franchisee Program</CardTitle>
                <CardDescription className="text-lg max-w-3xl mx-auto">
                    Partner with us to build a decentralized network of goods and services. Explore our diverse franchise opportunities below, categorized for your convenience.
                </CardDescription>
            </CardHeader>
            <CardFooter className="justify-center">
                <Button asChild size="lg">
                    <Link href="/register?role=Franchisee">Apply Now to Become a Franchisee</Link>
                </Button>
            </CardFooter>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Franchise Opportunities Directory</CardTitle>
                <CardDescription>Click on a category to explore all the available franchise businesses within it. You can apply for any of these roles during registration.</CardDescription>
            </CardHeader>
            <CardContent>
                <Accordion type="multiple" className="w-full space-y-4">
                    {franchiseCategories.map((category, index) => {
                        const Icon = category.icon;
                        return (
                            <AccordionItem value={`item-${index}`} key={category.name} className="border-b-0">
                                <Card className="bg-muted/30">
                                    <AccordionTrigger className="p-6 text-left hover:no-underline">
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                                <Icon className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold">{category.name}</h3>
                                                <p className="text-sm text-muted-foreground">{category.businesses.length} opportunities</p>
                                            </div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div className="px-6 pb-6">
                                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                                {category.businesses.map(business => (
                                                    <div key={business} className="p-3 rounded-md border bg-background text-center">
                                                        <p className="text-sm font-medium">{business}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </Card>
                            </AccordionItem>
                        );
                    })}
                </Accordion>
            </CardContent>
        </Card>
      </div>
  );
}
