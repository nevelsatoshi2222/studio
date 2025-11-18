
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Settings } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and platform preferences.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
              <Settings className="h-6 w-6" />
              Under Construction
          </CardTitle>
          <CardDescription>
              This settings page is coming soon.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Future settings will include:</p>
          <ul className="list-disc pl-5 mt-2 text-muted-foreground">
              <li>Notification Preferences</li>
              <li>Theme Selection (Light/Dark)</li>
              <li>Language Selection</li>
              <li>Privacy Controls</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
