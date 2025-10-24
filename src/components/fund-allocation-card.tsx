'use client';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { FundAllocation } from '@/lib/types';
import {
    CircleDollarSign,
    Globe,
    Landmark,
    Vote,
    Users,
    Heart,
    Shield,
    Leaf,
    Brain,
    MessageSquare,
    Trophy,
    Briefcase,
    Building2,
    Palette,
    Megaphone,
    Share2,
    Handshake,
    Award,
    Scale,
    Settings,
    UserCog,
    UserCheck,
    Gift,
    Map,
} from 'lucide-react';

const iconMap: { [key: string]: React.FC<any> } = {
  'Creator': Award,
  'Public Demand (Voting)': Vote,
  'Society/Street Development': Landmark,
  'Village/Ward Development': Users,
  'Block/Kasbah Development': Building2,
  'Taluka Development': Map,
  'District Development': Building2,
  'State Development': Landmark,
  'Country Development': Globe,
  'System Management': Settings,
  'Global Peace & Development': Heart,
  'Anti-Corruption': Shield,
  'AI Education': Brain,
  'Plant a Tree Initiative': Leaf,
  'International Issues': Globe,
  'National Issues': Landmark,
  'Influencer Prize Pool': Megaphone,
  'Sports Development': Trophy,
  'Arts Development': Palette,
  'Affiliate Marketing': Share2,
  'Main franchisee commission': Handshake,
  'Guide benefit': UserCheck,
  'Initial investor': Gift,
};

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 border rounded-lg bg-background/80 shadow-lg">
          <p className="font-bold text-primary">{`${payload[0].name}`}</p>
          <p className="text-sm text-muted-foreground">{`Allocation: ${payload[0].value}%`}</p>
        </div>
      );
    }
    return null;
  };

export function FundAllocationCard({ allocations }: { allocations: FundAllocation[] }) {
  return (
    <Card className="w-full">
        <CardContent className="grid md:grid-cols-2 gap-8 items-center pt-6">
             <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={allocations}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                        >
                            {allocations.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{fontSize: "0.8rem"}}/>
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="space-y-4">
                {allocations.map(pot => {
                    const Icon = iconMap[pot.name] || CircleDollarSign;
                    return (
                        <div key={pot.name} className="flex items-start gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg mt-1" style={{backgroundColor: `${pot.color}20`, color: pot.color}}>
                                <Icon className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="font-semibold">{pot.name} ({pot.value}%)</h4>
                                <p className="text-sm text-muted-foreground">{pot.description}</p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </CardContent>
    </Card>
  );
}
