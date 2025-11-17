
'use client';
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  PieChart,
  Crown,
  Target,
  Star,
  TrendingUp,
  Building2,
  ShoppingCart,
  Coins,
  Trophy,
  Shield,
  GraduationCap,
  HeartHandshake
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const PGC_LOGO_URL = "https://storage.googleapis.com/public-governance-859029-c316e.firebasestorage.app/IMG_20251111_165229.png";


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

const roadmapStages = [
  {
    stage: "Presale & Airdrop Launch",
    phase: "Current Phase",
    icon: <Rocket className="h-8 w-8" />,
    status: "active",
    timeframe: "Q1 2024",
    description: "Launching Public Governance Coin (PGC) presale with exclusive airdrop program for early supporters",
    features: [
      "PGC Token Presale Launch",
      "Early Bird Airdrop Program",
      "First 20,000 Users Bonus",
      "Community Building Initiative",
      "Referral Reward System"
    ],
    color: "bg-blue-500",
    textColor: "text-blue-500"
  },
  {
    stage: "Global Education Revolution",
    phase: "Stage 1",
    icon: <GraduationCap className="h-8 w-8" />,
    status: "upcoming",
    timeframe: "Q2-Q3 2024",
    description: "Transforming global education with accessible, decentralized learning systems for all",
    features: [
      "Decentralized Learning Platform",
      "Free Educational Resources",
      "Skill Development Programs",
      "Global Teacher Network",
      "Blockchain Certification"
    ],
    color: "bg-green-500",
    textColor: "text-green-500"
  },
  {
    stage: "Anti-Corruption Framework",
    phase: "Stage 2",
    icon: <Shield className="h-8 w-8" />,
    status: "upcoming",
    timeframe: "Q4 2024",
    description: "Implementing transparent governance systems to eliminate corruption through blockchain technology",
    features: [
      "Transparent Governance Protocol",
      "Public Fund Tracking System",
      "Anti-Corruption Dashboard",
      "Whistleblower Protection",
      "Community Oversight Platform"
    ],
    color: "bg-purple-500",
    textColor: "text-purple-500"
  },
  {
    stage: "Talent & Competition Platform",
    phase: "Stage 3",
    icon: <Trophy className="h-8 w-8" />,
    status: "upcoming",
    timeframe: "Q1 2025",
    description: "Creating global platforms for sports, arts, and talent competitions with fair reward systems",
    features: [
      "Global Talent Competitions",
      "Sports Tournament Platform",
      "Arts & Culture Festivals",
      "Digital Performance Stages",
      "Fair Reward Distribution"
    ],
    color: "bg-yellow-500",
    textColor: "text-yellow-500"
  },
  {
    stage: "Multi-Coin Ecosystem Launch",
    phase: "Stage 4",
    icon: <Coins className="h-8 w-8" />,
    status: "upcoming",
    timeframe: "Q2 2025",
    description: "Expanding our ecosystem with specialized tokens for governance, trade, and innovation",
    features: [
      "Idea Governance Coin (IDC) Launch",
      "International Trade Coin (ITC)",
      "International Trade Exchange (ITE)",
      "Franchise Coin Ecosystem",
      "Job & Work Coin Integration"
    ],
    color: "bg-orange-500",
    textColor: "text-orange-500"
  },
  {
    stage: "E-Commerce & Employment Revolution",
    phase: "Stage 5",
    icon: <ShoppingCart className="h-8 w-8" />,
    status: "upcoming",
    timeframe: "Q3 2025",
    description: "Creating new economic opportunities through decentralized commerce and employment solutions",
    features: [
      "Global E-Commerce Platform",
      "Home Employment Solutions",
      "Customer Discount Programs",
      "Franchise Opportunities",
      "Job Creation Initiatives"
    ],
    color: "bg-red-500",
    textColor: "text-red-500"
  },
  {
    stage: "Community Support Initiative",
    phase: "Stage 6",
    icon: <Users className="h-8 w-8" />,
    status: "upcoming",
    timeframe: "Q4 2025",
    description: "Direct assistance programs starting with street communities and expanding globally",
    features: [
      "Street Community Support",
      "Basic Needs Provision",
      "Skill Training Programs",
      "Healthcare Access Initiatives",
      "Housing Support Systems"
    ],
    color: "bg-indigo-500",
    textColor: "text-indigo-500"
  },
  {
    stage: "National Implementation",
    phase: "Stage 7",
    icon: <Building2 className="h-8 w-8" />,
    status: "upcoming",
    timeframe: "Q1 2026",
    description: "Full-scale implementation of Public Governance system in pioneer countries",
    features: [
      "First Country Implementation",
      "Government Partnership",
      "National Scale Deployment",
      "Public Service Integration",
      "Policy Framework Adoption"
    ],
    color: "bg-teal-500",
    textColor: "text-teal-500"
  },
  {
    stage: "Global Expansion (Stages 8-20)",
    phase: "Growth Phase",
    icon: <Globe className="h-8 w-8" />,
    status: "upcoming",
    timeframe: "2026-2030",
    description: "Worldwide expansion helping people and governments complete projects through employment circles",
    features: [
      "Multi-Country Expansion",
      "Government Project Support",
      "Employment Circle Networks",
      "Infrastructure Development",
      "Global Economic Integration"
    ],
    color: "bg-cyan-500",
    textColor: "text-cyan-500"
  }
];

const milestones = [
  { number: "20K+", label: "Early Users" },
  { number: "100+", label: "Countries" },
  { number: "1M+", label: "Jobs Created" },
  { number: "$100M+", label: "Economic Impact" }
];

export default function VisionRoadmapPage() {
  const [activeStage, setActiveStage] = useState(0);

  return (
      <div className="flex flex-col gap-8">
        {/* Hero Section with PGC Coin */}
        <Card className="bg-gradient-to-br from-primary/10 via-background to-background text-center relative overflow-hidden">
          <div className="absolute top-4 right-4">
            <Badge variant="secondary" className="bg-green-500 text-white">
              Live Presale
            </Badge>
          </div>
          <CardHeader className="relative z-10">
            <div className="flex justify-center items-center gap-6 mb-6">
              {/* PGC Coin Image */}
              <div className="w-24 h-24 md:w-32 md:h-32 relative">
                 <Image
                  src={PGC_LOGO_URL}
                  alt="Public Governance Coin"
                  width={100}
                  height={100}
                  className="object-contain"
                  priority
                />
              </div>
            </div>
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

        {/* Vision Sections */}
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
          
          {/* PGC Token Section */}
          <Card className="flex flex-col lg:col-span-3">
            <CardHeader className="flex-grow">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                <PieChart className="h-6 w-6" />
              </div>
              <CardTitle>The PGC Token: Powering the Ecosystem</CardTitle>
              <CardDescription className="pt-2">
                The Public Governance Coin (PGC) is the lifeblood of the platform. Its tokenomics are meticulously designed to ensure long-term sustainability, decentralization, and community ownership. Key features include a 9-stage deflationary sale, community-governed pots holding over 98% of the total supply, and reward mechanisms for participation. This is not just a token; it's your share in a new digital nation.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link href="/tokenomics">View Detailed PGC Tokenomics</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Roadmap Section */}
        <Card className="bg-gradient-to-br from-slate-50 to-blue-50 border-0">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-6">
              <div className="flex items-center gap-3 bg-white rounded-full px-6 py-3 shadow-lg border">
                <Crown className="h-6 w-6 text-yellow-600" />
                <span className="text-lg font-semibold text-gray-800">Public Governance Platform</span>
              </div>
            </div>
            <CardTitle className="text-4xl font-bold text-gray-900 mb-4">
              Global Transformation <span className="text-blue-600">Roadmap</span>
            </CardTitle>
            <CardDescription className="text-xl text-gray-600 max-w-3xl mx-auto">
              Building a decentralized future where education, governance, and economic opportunities 
              are accessible to everyone, everywhere.
            </CardDescription>
            
            {/* Milestones */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto mt-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="text-center p-4 bg-white rounded-lg shadow-md border">
                  <div className="text-2xl font-bold text-blue-600">{milestone.number}</div>
                  <div className="text-sm text-gray-600">{milestone.label}</div>
                </div>
              ))}
            </div>
          </CardHeader>

          <CardContent>
            {/* Interactive Roadmap */}
            <div className="max-w-6xl mx-auto">
              {/* Stage Navigation */}
              <div className="flex overflow-x-auto pb-4 mb-8 gap-2 scrollbar-hide">
                {roadmapStages.map((stage, index) => (
                  <Button
                    key={index}
                    variant={activeStage === index ? "default" : "outline"}
                    className={`whitespace-nowrap ${activeStage === index ? stage.color : ""}`}
                    onClick={() => setActiveStage(index)}
                  >
                    {stage.phase}
                  </Button>
                ))}
              </div>

              {/* Active Stage Details */}
              <Card className="mb-12 border-2 shadow-xl">
                <CardHeader className={`${roadmapStages[activeStage].color} text-white`}>
                  <div className="flex items-center gap-4">
                    {roadmapStages[activeStage].icon}
                    <div>
                      <Badge variant="secondary" className="mb-2">
                        {roadmapStages[activeStage].status === "active" ? "Live Now" : "Coming Soon"}
                      </Badge>
                      <CardTitle className="text-2xl">{roadmapStages[activeStage].stage}</CardTitle>
                      <CardDescription className="text-white/90">
                        {roadmapStages[activeStage].timeframe}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-lg text-gray-700 mb-6">
                    {roadmapStages[activeStage].description}
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    {roadmapStages[activeStage].features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Complete Visual Roadmap */}
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-8 top-0 bottom-0 w-1 bg-blue-200 transform -translate-x-1/2 z-0"></div>
                
                {/* Stages */}
                <div className="space-y-12 relative z-10">
                  {roadmapStages.map((stage, index) => (
                    <div key={index} className="flex gap-8 items-start">
                      {/* Timeline Dot */}
                      <div className={`flex-shrink-0 w-16 h-16 rounded-full border-4 border-white ${stage.color} shadow-lg flex items-center justify-center z-20`}>
                        {stage.icon}
                      </div>
                      
                      {/* Content */}
                      <Card className={`flex-1 transform transition-all duration-300 hover:scale-105 ${
                        index === activeStage ? 'ring-2 ring-blue-500 shadow-2xl' : 'shadow-lg'
                      }`}>
                        <CardHeader>
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <Badge 
                                variant={stage.status === "active" ? "default" : "secondary"} 
                                className="mb-2"
                              >
                                {stage.status === "active" ? "Live Now" : stage.phase}
                              </Badge>
                              <CardTitle className={`text-xl ${stage.textColor}`}>
                                {stage.stage}
                              </CardTitle>
                              <CardDescription className="text-sm mt-1">
                                {stage.timeframe}
                              </CardDescription>
                            </div>
                            {stage.status === "active" && (
                              <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-sm text-green-500 font-medium">Active</span>
                              </div>
                            )}
                          </div>
                          <p className="text-gray-600">{stage.description}</p>
                        </CardHeader>
                        <CardContent>
                          <div className="grid gap-2">
                            {stage.features.slice(0, 3).map((feature, featureIndex) => (
                              <div key={featureIndex} className="flex items-center gap-2 text-sm">
                                <Target className="h-3 w-3 text-blue-500" />
                                <span>{feature}</span>
                              </div>
                            ))}
                            {stage.features.length > 3 && (
                              <div className="text-sm text-gray-500">
                                +{stage.features.length - 3} more features
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
          <CardHeader>
            <Lightbulb className="h-12 w-12 mx-auto mb-4" />
            <CardTitle className="text-3xl font-bold">Join the Revolution</CardTitle>
            <CardDescription className="text-xl text-white/90 max-w-2xl mx-auto">
              Be part of the global transformation. Together, we're building a future where 
              everyone has access to education, opportunities, and transparent governance.
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-center gap-4">
            <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
              <Rocket className="h-5 w-5 mr-2" />
              Join Presale
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <HeartHandshake className="h-5 w-5 mr-2" />
              Learn More
            </Button>
          </CardFooter>
        </Card>

        {/* Vision Statement */}
        <Card className="bg-gradient-to-br from-gray-900 to-blue-900 text-white border-0">
          <CardContent className="p-8 text-center">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 text-yellow-400" />
            <h3 className="text-2xl font-bold mb-4">Our Vision for 2030</h3>
            <p className="text-lg text-gray-200 max-w-4xl mx-auto">
              By 2030, Public Governance will transform how societies function - creating a world 
              where corruption is eliminated through transparency, education is freely accessible to all, 
              economic opportunities reach every home, and communities thrive through decentralized 
              governance systems that truly serve the people.
            </p>
          </CardContent>
        </Card>

        {/* Final Call to Action */}
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
  );
}

    