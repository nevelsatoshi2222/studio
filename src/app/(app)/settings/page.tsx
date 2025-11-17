
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Settings } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export default function SettingsPage() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold">{t('settings.title')}</h1>
        <p className="text-muted-foreground">
          {t('settings.description')}
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
              <Settings className="h-6 w-6" />
              {t('common.under_construction')}
          </CardTitle>
          <CardDescription>
              {t('common.coming_soon')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>{t('settings.future_settings')}</p>
          <ul className="list-disc pl-5 mt-2 text-muted-foreground">
              <li>{t('settings.notification_prefs')}</li>
              <li>{t('settings.theme')}</li>
              <li>{t('settings.language_selection')}</li>
              <li>{t('settings.privacy_controls')}</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

    