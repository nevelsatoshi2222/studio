
'use client';
import { useState } from 'react';
import { AppLayout } from '@/components/app-layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Share2, Star, TrendingUp, Users, Award, Gem, Shield, Crown, Link as LinkIcon, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { influencerTiers } from '@/lib/data';
import { SubmittedContent } from '@/lib/types';
import { useUser } from '@/firebase';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';


const InfluencerDashboard = () => {
    const [submittedContent, setSubmittedContent] = useState<SubmittedContent[]>([]);
    const [newLink, setNewLink] = useState('');
    const { toast } = useToast();

    const totalViews = submittedContent.reduce((acc, curr) => acc + (curr.views || 0), 0);
    const airdropEarned = (totalViews / 1000).toFixed(2); // Example calculation

    const handleAddLink = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newLink || !newLink.startsWith('http')) {
            toast({ variant: 'destructive', title: 'Invalid Link', description: 'Please enter a valid URL.' });
            return;
        }
        const newSubmission: SubmittedContent = {
            id: String(Date.now()),
            url: newLink,
            submittedAt: new Date(),
            status: 'Pending',
        };
        setSubmittedContent(prevContent => [newSubmission, ...prevContent]);
        setNewLink('');
        toast({ title: 'Link Submitted!', description: 'Your content is now pending review.' });
    };

    const getStatusIcon = (status: SubmittedContent['status']) => {
        switch (status) {
            case 'Approved': return <CheckCircle className="h-5 w-5 text-green-500" />;
            case 'Pending': return <Clock className="h-5 w-5 text-yellow-500" />;
            case 'Rejected': return <AlertCircle className="h-5 w-5 text-red-500" />;
        }
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Submit Your Content</CardTitle>
                    <CardDescription>Add links to the content you've created. You can submit up to 25 links for review after the presale ends.</CardDescription>
                </CardHeader>
                <form onSubmit={handleAddLink}>
                    <CardContent>
                        <div className="flex gap-2">
                            <Input
                                type="url"
                                placeholder="https://youtube.com/watch?v=..."
                                value={newLink}
                                onChange={(e) => setNewLink(e.target.value)}
                            />
                            <Button type="submit">
                                <LinkIcon className="mr-2 h-4 w-4" /> Add Link
                            </Button>
                        </div>
                    </CardContent>
                </form>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>My Content Dashboard</CardTitle>
                    <CardDescription>Track the status and performance of your submitted content.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-6 text-center">
                        <div className="p-4 rounded-lg bg-muted">
                            <p className="text-sm text-muted-foreground">Total Verified Views</p>
                            <p className="text-2xl font-bold">{totalViews.toLocaleString()}</p>
                        </div>
                        <div className="p-4 rounded-lg bg-muted">
                            <p className="text-sm text-muted-foreground">Estimated PGC Earned</p>
                            <p className="text-2xl font-bold text-primary">{airdropEarned}</p>
                        </div>
                    </div>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Content URL</TableHead>
                                <TableHead>Date Submitted</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Verified Views</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {submittedContent.length > 0 ? submittedContent.map(content => (
                                <TableRow key={content.id}>
                                    <TableCell>
                                        <a href={content.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate block max-w-xs">
                                            {content.url}
                                        </a>
                                    </TableCell>
                                    <TableCell>{content.submittedAt.toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <Badge variant={content.status === 'Approved' ? 'default' : content.status === 'Pending' ? 'secondary' : 'destructive'} className="flex items-center gap-2 w-fit">
                                            {getStatusIcon(content.status)}
                                            {content.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right font-medium">{content.views ? content.views.toLocaleString() : 'N/A'}</TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                                        You haven't submitted any content yet.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </>
    );
};


export default function InfluencerPage() {
  const { user } = useUser();

  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <Card>
            <CardHeader className="text-center">
                <CardTitle className="text-3xl font-headline">Presale Influencer Rewards</CardTitle>
                <CardDescription className="text-lg max-w-3xl mx-auto">
                   5% of total presale coins (100,000 PGC) are reserved to reward content creators. Promote the platform, submit your content, and earn rewards based on your reach and impact.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {influencerTiers.map((tier) => {
                    const Icon = tier.icon;
                    return (
                        <div key={tier.title} className="flex items-start gap-4 rounded-lg border p-4">
                           <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary mt-1">
                                <Icon className="h-6 w-6"/>
                           </div>
                           <div className="flex-1">
                                <div className="flex justify-between items-center">
                                    <h4 className="font-semibold text-lg">{tier.title}</h4>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">{tier.description}</p>
                                <div className="text-sm font-semibold text-primary mt-2 rounded-full bg-primary/10 px-3 py-1 inline-block">{tier.criteria}</div>
                           </div>
                        </div>
                    )
                })}
            </CardContent>
        </Card>
        
        {user ? (
            <InfluencerDashboard />
        ) : (
            <Card>
                <CardHeader>
                    <CardTitle>Join the Influencer Program</CardTitle>
                    <CardDescription>You must be logged in and registered as an influencer to submit content.</CardDescription>
                </CardHeader>
                <CardFooter className="gap-4">
                    <Button asChild>
                        <Link href="/login">Login</Link>
                    </Button>
                    <Button asChild variant="secondary">
                        <Link href="/register?role=Influencer">Apply to be an Influencer</Link>
                    </Button>
                </CardFooter>
            </Card>
        )}
      </div>
    </AppLayout>
  );
}
