
'use client';
import { useState } from 'react';
import { AppLayout } from '@/components/app-layout';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { ArrowRight, Globe, Landmark, Building, Map, MapPin, Home } from 'lucide-react';
import Link from 'next/link';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { indiaGeography } from '@/lib/data';

const votingLevels = [
  {
    title: 'International Issues',
    description: 'Vote on solutions for global challenges like climate change, health, and security.',
    href: '/voting/international',
    icon: Globe,
  },
  {
    title: 'National Issues',
    description: 'Participate in governance by selecting your country and voting on its top 25 issues.',
    href: '/voting/national',
    icon: Landmark,
  },
];

export default function VotingHubPage() {
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedTaluka, setSelectedTaluka] = useState('');
  const [selectedVillage, setSelectedVillage] = useState('');

  const districts = selectedState ? indiaGeography.find(s => s.name === selectedState)?.districts : [];
  const talukas = selectedDistrict ? districts?.find(d => d.name === selectedDistrict)?.talukas : [];
  const villages = selectedTaluka ? talukas?.find(t => t.name === selectedTaluka)?.villages : [];

  const handleStateChange = (value: string) => {
    setSelectedState(value);
    setSelectedDistrict('');
    setSelectedTaluka('');
    setSelectedVillage('');
  };

  const handleDistrictChange = (value: string) => {
    setSelectedDistrict(value);
    setSelectedTaluka('');
    setSelectedVillage('');
  };

  const handleTalukaChange = (value: string) => {
    setSelectedTaluka(value);
    setSelectedVillage('');
  }

  const handleVillageChange = (value: string) => {
    setSelectedVillage(value);
  }

  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="font-headline text-3xl font-bold">Community Voting Hub</h1>
          <p className="text-muted-foreground">
            Select a governance level to view proposals and cast your vote.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {votingLevels.map((level) => {
            const Icon = level.icon;
            return (
              <Link href={level.href} key={level.title} className="group">
                <Card className="h-full hover:border-primary transition-colors hover:shadow-lg">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Icon className="h-6 w-6" />
                        </div>
                        <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                    </div>
                    <CardTitle className="pt-4">{level.title}</CardTitle>
                    <CardDescription>{level.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Vote on Local Issues in India</CardTitle>
            <CardDescription>Drill down to your specific region to vote on local matters. The next dropdown will appear after you make a selection.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-2">
                  <Select onValueChange={handleStateChange} value={selectedState}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select State" />
                    </SelectTrigger>
                    <SelectContent>
                      {indiaGeography.map(state => (
                        <SelectItem key={state.name} value={state.name}>{state.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Link href={`/voting/state?name=${selectedState}`} passHref>
                      <Button variant="outline" className="w-full sm:w-auto" disabled={!selectedState}>State Issues</Button>
                  </Link>
              </div>

              {selectedState && (
                <div className="flex flex-col sm:flex-row gap-2">
                    <Select onValueChange={handleDistrictChange} value={selectedDistrict}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select District" />
                      </SelectTrigger>
                      <SelectContent>
                        {districts?.map(district => (
                          <SelectItem key={district.name} value={district.name}>{district.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Link href={`/voting/district?name=${selectedDistrict}`} passHref>
                        <Button variant="outline" className="w-full sm:w-auto" disabled={!selectedDistrict}>District Issues</Button>
                    </Link>
                </div>
              )}

              {selectedDistrict && (
                <div className="flex flex-col sm:flex-row gap-2">
                    <Select onValueChange={handleTalukaChange} value={selectedTaluka}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Taluka" />
                      </SelectTrigger>
                      <SelectContent>
                        {talukas?.map(taluka => (
                          <SelectItem key={taluka.name} value={taluka.name}>{taluka.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                     <Link href={`/voting/taluka?name=${selectedTaluka}`} passHref>
                        <Button variant="outline" className="w-full sm:w-auto" disabled={!selectedTaluka}>Taluka/Block Issues</Button>
                    </Link>
                </div>
              )}

              {selectedTaluka && (
                <div className="flex flex-col sm:flex-row gap-2">
                    <Select onValueChange={handleVillageChange} value={selectedVillage}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Village" />
                      </SelectTrigger>
                      <SelectContent>
                        {villages?.map(village => (
                          <SelectItem key={village} value={village}>{village}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="grid grid-cols-2 gap-2 w-full sm:w-auto">
                         <Link href={`/voting/village?name=${selectedVillage}`} passHref>
                            <Button variant="outline" className="w-full" disabled={!selectedVillage}>Village Issues</Button>
                        </Link>
                        <Link href={`/voting/street?name=${selectedVillage}`} passHref>
                            <Button variant="outline" className="w-full" disabled={!selectedVillage}>Street Issues</Button>
                        </Link>
                    </div>
                </div>
              )}
          </CardContent>
        </Card>

      </div>
    </AppLayout>
  );
}
