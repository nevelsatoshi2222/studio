
'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, Send } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const offerRequestSchema = z.object({
    role: z.string().min(1, { message: 'Please select your role.' }),
    subject: z.string().min(5, { message: 'Subject must be at least 5 characters.' }).max(100),
    message: z.string().min(20, { message: 'Message must be at least 20 characters.' }).max(2000),
});

type OfferRequestFormValues = z.infer<typeof offerRequestSchema>;


export function RequestOfferCard() {
    const { toast } = useToast();

    const form = useForm<OfferRequestFormValues>({
        resolver: zodResolver(offerRequestSchema),
        defaultValues: {
            role: '',
            subject: '',
            message: '',
        },
    });

    function onSubmit(data: OfferRequestFormValues) {
        // In a real application, you would send this data to a backend endpoint.
        console.log("Offer Request Submitted:", data);
        toast({
            title: "Request Submitted!",
            description: "Your direct offer request has been sent to the admin team. We will review it and get back to you shortly.",
        });
        form.reset();
    }


  return (
    <Card className="border-2 border-amber-500 bg-amber-50/10">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-amber-500">
                    <Crown className="h-6 w-6" />
                    Request a Direct Offer
                    </CardTitle>
                    <CardDescription>
                    Are you a top performer? Do you have a significant network or social media following? You may be eligible for a special direct offer from our admin team.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>1. Select Your Role</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="I am a..." />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="influencer">Influencer</SelectItem>
                                        <SelectItem value="affiliate">Affiliate Networker</SelectItem>
                                        <SelectItem value="community-leader">Community Leader</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>2. Subject</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., Partnership Proposal" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>3. Your Message</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Describe your network, social media presence, and why you believe you qualify for a direct offer..."
                                        className="resize-none"
                                        rows={6}
                                        maxLength={2000}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </CardContent>
                <CardFooter>
                     <Button type="submit" size="lg" className="w-full bg-amber-500 hover:bg-amber-600 text-white">
                        <Send className="h-5 w-5 mr-2" />
                        Submit Request to Admin
                    </Button>
                </CardFooter>
            </form>
        </Form>
    </Card>
  );
}
