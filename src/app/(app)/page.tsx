
'use client';
import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useUser } from '@/firebase';

// Main dashboard content sections
const sections = [
  'worldPerspective',
  'newIndia',
  'quiz',
  'polls',
  'conclusion'
];

export default function Dashboard() {
  const { t, currentLanguage } = useTranslation();
  const { user } = useUser();

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{t('common.welcome')}, {user?.displayName || user?.email || 'Guest'}!</CardTitle>
              <CardDescription>Explore the platform in your preferred language.</CardDescription>
            </div>
            <LanguageSwitcher />
          </div>
        </CardHeader>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map(section => (
          <Card key={section} className="flex flex-col">
            <CardHeader>
              <CardTitle>{t(`navigation.${section}`)}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground">
                {/* Dummy content - you can add specific descriptions here */}
                Explore the {t(`navigation.${section}`)} section to learn more about our governance model.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline">
                <Link href={`/governance/${section.replace(/([A-Z])/g, "-$1").toLowerCase()}`}>
                  Go to {t(`navigation.${section}`)}
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
