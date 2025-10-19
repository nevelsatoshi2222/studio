'use client';
import { AppLayout } from '@/components/app-layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { teamMembers } from '@/lib/data';
import { Users, User, DollarSign, BarChart } from 'lucide-react';
import { placeholderImages } from '@/lib/placeholder-images.json';
import { TeamMember } from '@/lib/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function TeamPage() {
  const directMembers = teamMembers.filter((m) => m.level === 1);

  const levelCounts = teamMembers.reduce((acc, member) => {
    acc[member.level] = (acc[member.level] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const totalEarnings = teamMembers.reduce((acc, member) => acc + member.earnings, 0);

  const getAvatarUrl = (avatarId: string) => {
    const image = placeholderImages.find((img) => img.id === avatarId);
    return image ? image.imageUrl : `https://picsum.photos/seed/${avatarId}/40/40`;
  };

  const getAvatarHint = (avatarId: string) => {
    const image = placeholderImages.find((img) => img.id === avatarId);
    return image ? image.imageHint : 'user avatar';
  };

  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="font-headline text-3xl font-bold">My Team</h1>
          <p className="text-muted-foreground">
            Manage your affiliate team, track earnings, and view your network's growth.
          </p>
        </div>

        <Tabs defaultValue="team-members">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="team-members">
              <Users className="mr-2 h-4 w-4" /> Team Members
            </TabsTrigger>
            <TabsTrigger value="direct-members">
              <User className="mr-2 h-4 w-4" /> Direct Members
            </TabsTrigger>
            <TabsTrigger value="earnings">
              <DollarSign className="mr-2 h-4 w-4" /> Earning
            </TabsTrigger>
          </TabsList>
          <TabsContent value="team-members" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Team Members by Level</CardTitle>
                <CardDescription>
                  An overview of your network depth and the number of members at each level.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Level</TableHead>
                      <TableHead className="text-right">Member Count</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(levelCounts).map(([level, count]) => (
                      <TableRow key={level}>
                        <TableCell>Level {level}</TableCell>
                        <TableCell className="text-right font-medium">{count}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="direct-members" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Direct Members</CardTitle>
                <CardDescription>
                  Users you have personally referred to the platform.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Member</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead className="text-right">Total Earnings (from them)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {directMembers.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={getAvatarUrl(member.avatarId)} alt={member.name} data-ai-hint={getAvatarHint(member.avatarId)} />
                              <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{member.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{member.joinDate}</TableCell>
                        <TableCell className="text-right">${member.earnings.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="earnings" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Affiliate Earnings</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${totalEarnings.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">
                            Total income generated from your entire team.
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Team Members</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{teamMembers.length}</div>
                        <p className="text-xs text-muted-foreground">
                            Everyone in your downline across all 15 levels.
                        </p>
                    </CardContent>
                </Card>
            </div>
             <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Commission Structure</CardTitle>
                    <CardDescription>
                        Your affiliate program offers deep, multi-level rewards. You earn a percentage of the revenue generated by members in your network, down to 15 levels.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="p-4 rounded-lg border bg-primary/10">
                        <h4 className="font-semibold text-lg flex items-center gap-2">Levels 1-5: <span className="text-primary">0.2% Commission</span></h4>
                        <p className="text-muted-foreground mt-1">You earn a 0.2% commission on the revenue generated by each member in the first five levels of your team.</p>
                    </div>
                    <div className="p-4 rounded-lg border">
                        <h4 className="font-semibold text-lg flex items-center gap-2">Levels 6-15: <span className="text-primary">0.1% Commission</span></h4>
                        <p className="text-muted-foreground mt-1">You earn a 0.1% commission on the revenue generated by each member from level 6 down to level 15.</p>
                    </div>
                    <div className="p-4 rounded-lg border bg-green-500/10 text-green-700">
                        <h4 className="font-semibold text-lg flex items-center gap-2">Total Commission: <span className="text-green-600">2% Distributed</span></h4>
                        <p className="text-muted-foreground mt-1 text-green-800">This structure allows you to benefit from the network effect, as your earnings grow exponentially with your team's expansion.</p>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button asChild>
                        <Link href="/affiliate-marketing">Learn More About the Program</Link>
                    </Button>
                </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
