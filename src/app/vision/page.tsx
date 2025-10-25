'use client';
import { AppLayout } from '@/components/app-layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Globe,
  Vote,
  Lock,
  Heart,
  Users,
  Award,
  Lightbulb,
  Share2,
  Rocket,
} from 'lucide-react';
import Link from 'next/link';

const visionSections = [
  {
    icon: Globe,
    title: 'The Mission: Real Public Governance',
    description:
      'Our goal is monumental: to build a decentralized, transparent, and community-owned platform that empowers every individual to participate in governance. From local street issues to global policies, your voice matters, your vote counts, and your participation is rewarded.',
  },
  {
    icon: Heart,
    title: 'Coin Sales for a Good Cause',
    description:
      "This is not just another crypto project. A significant portion of every coin sale is automatically allocated to dedicated funds for social and environmental good. Your investment directly fuels anti-corruption initiatives, global peace efforts, reforestation projects, and community development.",
    link: '/tokenomics',
    linkText: 'See Fund Allocation',
  },
  {
    icon: Lock,
    title: 'Staking: Earn by Securing the Network',
    description:
      'By staking your tokens, you do more than just earn rewards. You actively participate in the security and stability of the platform, showing your long-term commitment to the vision of a decentralized governance system.',
    link: '/staking',
    linkText: 'Stake Your Tokens',
  },
  {
    icon: Vote,
    title: 'Voting: For Everything',
    description:
      'This is the core of public governance. You can vote on everything: national and international issues, funding for community projects, and even the winners of our global competitions. Your vote has real power and real consequences.',
    link: '/voting',
    linkText: 'Go to Voting Hub',
  },
  {
    icon: Award,
    title: 'Competitions: Ideas, Sports, Arts & Quizzes',
    description:
      'We believe talent and great ideas can come from anywhere. Our global competitions for ideas, sports, arts, and knowledge are designed to discover and fund the best, judged and voted on by the community. Win, and your project gets funded.',
    link: '/quiz',
    linkText: 'Explore Competitions',
  },
  {
    icon: Share2,
    title: 'Marketing by the People: Affiliate & Influencer Programs',
    description:
      'Growth is powered by the community. Our affiliate and influencer marketing programs reward you for spreading the word. By building your network, you contribute to the platform\'s expansion and earn a share of its success.',
    link: '/affiliate-marketing',
    linkText: 'Join the Program',
  },
];

export default function VisionPage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <Card className="bg-gradient-to-br from-primary/10 via-background to-background text-center">
          <CardHeader>
            <Rocket className="mx-auto h-16 w-16 text-primary" />
            <h1 className="font-headline text-4xl font-bold mt-4">
              Our Vision: A World Governed by You
            </h1>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              We are building more than an app; we are building a global,
              decentralized nation where your participation shapes the future.
              This is our manifesto.
            </p>
          </CardHeader>
        </Card>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visionSections.map((section) => {
            const Icon = section.icon;
            return (
              <Card key={section.title} className="flex flex-col">
                <CardHeader className="flex-grow">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle>{section.title}</CardTitle>
                  <CardDescription className="pt-2">
                    {section.description}
                  </CardDescription>
                </CardHeader>
                {section.link && (
                  <CardFooter>
                    <Button asChild variant="outline" className="w-full">
                      <Link href={section.link}>{section.linkText}</Link>
                    </Button>
                  </CardFooter>
                )}
              </Card>
            );
          })}
        </div>

        <Card className="text-center">
          <CardHeader>
            <CardTitle className="font-headline text-3xl">
              Join the Movement
            </CardTitle>
            <CardDescription className="text-base max-w-2xl mx-auto">
              The tools are here. The platform is ready. The only missing piece
              is you. Register, participate, and become a founding citizen of a
              truly public-governed world.
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/register">Create Your Account</Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/social-media">Join the Conversation</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </AppLayout>
  );
}
