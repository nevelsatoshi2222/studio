
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useUser } from '@/firebase';
import { 
  BarChart3, 
  Users, 
  Trophy, 
  Vote, 
  Globe, 
  TrendingUp, 
  Rocket, 
  Shield,
  Award,
  Clock,
  Calendar
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Main dashboard content sections
const governanceSections = [
  {
    id: 'world-perspective',
    title: 'World Perspective',
    description: 'Explore global governance models and international perspectives',
    icon: Globe,
    href: '/governance/world-perspective',
    color: 'blue'
  },
  {
    id: 'new-india',
    title: 'New India Vision',
    description: 'Discover the vision for New India and developmental initiatives',
    icon: Rocket,
    href: '/governance/new-india-vision',
    color: 'green'
  },
  {
    id: 'voting-system',
    title: 'Voting System',
    description: 'Participate in democratic processes at all governance levels',
    icon: Vote,
    href: '/voting',
    color: 'purple'
  },
  {
    id: 'quiz',
    title: 'Governance Quiz',
    description: 'Test your knowledge and share your opinions on governance',
    icon: Trophy,
    href: '/quiz-opinion',
    color: 'orange'
  },
  {
    id: 'polls',
    title: 'Opinion Polls',
    description: 'Participate in opinion polls and shape public discourse',
    icon: BarChart3,
    href: '/governance/opinion-polls',
    color: 'red'
  },
  {
    id: 'community',
    title: 'Community',
    description: 'Join the community and collaborate with fellow citizens',
    icon: Users,
    href: '/community',
    color: 'indigo'
  }
];

const quickStats = [
  { label: 'Active Users', value: '10,234', change: '+12%', icon: Users },
  { label: 'Votes Cast', value: '45,678', change: '+8%', icon: Vote },
  { label: 'Quizzes Taken', value: '23,456', change: '+15%', icon: Trophy },
  { label: 'Polls Created', value: '1,234', change: '+5%', icon: BarChart3 },
];

const recentActivities = [
  { action: 'Voted on', topic: 'National Education Policy', time: '2 hours ago' },
  { action: 'Completed', topic: 'Governance Basics Quiz', time: '1 day ago' },
  { action: 'Participated in', topic: 'Climate Change Poll', time: '2 days ago' },
  { action: 'Joined', topic: 'Community Discussion', time: '3 days ago' },
];

const getColorClasses = (color: string) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  };
  return colors[color as keyof typeof colors] || colors.blue;
};

export default function Dashboard() {
  const { user, isUserLoading } = useUser();

  if (isUserLoading) {
    return (
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <div className="h-8 bg-gray-200 rounded w-64 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
              </div>
            </div>
          </CardHeader>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </CardHeader>
              <CardContent>
                <div className="h-16 bg-gray-200 rounded"></div>
              </CardContent>
              <CardFooter>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex-1">
              <CardTitle className="text-2xl md:text-3xl text-gray-900 mb-2">
                Welcome, {user?.displayName || user?.email?.split('@')[0] || 'Guest'}! 👋
              </CardTitle>
              <CardDescription className="text-lg text-gray-700">
                Explore governance features in your preferred language
              </CardDescription>
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge variant="secondary" className="bg-white">
                  <Shield className="w-3 h-3 mr-1" />
                  Public Governance
                </Badge>
                <Badge variant="secondary" className="bg-white">
                  <Award className="w-3 h-3 mr-1" />
                  Multi-language
                </Badge>
                <Badge variant="secondary" className="bg-white">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Growing Community
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {user && (
                <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                  Verified Citizen
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className="text-xs text-green-600 font-medium mt-1">{stat.change} from last month</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-full">
                  <stat.icon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Governance Features Grid */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Governance Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {governanceSections.map((section) => {
            const IconComponent = section.icon;
            return (
              <Card key={section.id} className={`flex flex-col transition-all duration-200 hover:shadow-lg hover:scale-105 ${getColorClasses(section.color)}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow pb-3">
                  <p className="text-sm opacity-90">
                    {section.description}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline" className="w-full bg-white hover:bg-gray-50">
                    <Link href={section.href}>
                      Explore {section.title}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Your recent interactions with the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {activity.action} <span className="text-blue-600">{activity.topic}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>Frequently used features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button asChild variant="outline" className="w-full justify-start h-12">
                <Link href="/voting">
                  <Vote className="w-4 h-4 mr-2" />
                  Cast Your Vote
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start h-12">
                <Link href="/quiz-opinion">
                  <Trophy className="w-4 h-4 mr-2" />
                  Take a Quiz
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start h-12">
                <Link href="/governance/opinion-polls">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Participate in Poll
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start h-12">
                <Link href="/profile">
                  <Users className="w-4 h-4 mr-2" />
                  Update Profile
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Language Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Language & Accessibility</CardTitle>
          <CardDescription>
            Content available in multiple languages for better accessibility
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">18+</div>
              <div className="text-sm text-blue-600">Languages</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">100%</div>
              <div className="text-sm text-green-600">Accessible</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">24/7</div>
              <div className="text-sm text-purple-600">Available</div>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">10k+</div>
              <div className="text-sm text-orange-600">Users</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
