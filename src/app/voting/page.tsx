
'use client';
import { AppLayout } from '@/components/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { votingPolls } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const geographyOrder = ['Street', 'Village', 'Kasba/Block', 'Taluka', 'District', 'Area', 'State', 'Nation', 'Continental', 'World'];
const sortedPolls = votingPolls.sort((a, b) => geographyOrder.indexOf(a.geography) - geographyOrder.indexOf(b.geography));

const VOTE_COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6'];

export default function VotingPage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="font-headline text-3xl font-bold">Community Voting</h1>
          <p className="text-muted-foreground">
            Participate in governance by voting on proposals.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {sortedPolls.map(poll => (
            <Card key={poll.id}>
              <CardHeader>
                <CardTitle className="text-lg">{poll.title}</CardTitle>
                <CardDescription>
                  <span className="font-semibold">{poll.geography} Level</span> - {poll.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={poll.votes} layout="vertical" margin={{ left: 10, right: 10 }}>
                      <XAxis type="number" hide />
                      <YAxis type="category" dataKey="option" hide />
                      <Tooltip 
                        formatter={(value: number, name: string) => [`${value} votes`, name]}
                        cursor={{ fill: 'transparent' }}
                      />
                      <Bar dataKey="count" barSize={20} radius={[4, 4, 4, 4]}>
                        {poll.votes.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={VOTE_COLORS[index % VOTE_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                 <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>Total Votes: {poll.votes.reduce((acc, v) => acc + v.count, 0)}</span>
                </div>
                <Button className="w-full">Cast Your Vote</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
