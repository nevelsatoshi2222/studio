// app/admin/affiliate-rewards/page.tsx
'use client';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Filter, Download, Mail } from 'lucide-react';

export default function AffiliateRewards() {
  const [affiliates, setAffiliates] = useState([
    { id: 1, name: 'John Trader', email: 'john@example.com', signups: 45, rewards: 225, status: 'active', joinDate: '2024-01-15' },
    { id: 2, name: 'Crypto Queen', email: 'queen@example.com', signups: 128, rewards: 640, status: 'active', joinDate: '2024-01-10' },
    { id: 3, name: 'Bitcoin Maxi', email: 'maxi@example.com', signups: 23, rewards: 115, status: 'inactive', joinDate: '2024-02-01' },
    { id: 4, name: 'DeFi Degen', email: 'degen@example.com', signups: 67, rewards: 335, status: 'active', joinDate: '2024-01-20' },
  ]);

  const [newAffiliate, setNewAffiliate] = useState({
    name: '',
    email: '',
    commissionRate: '5'
  });

  const addAffiliate = () => {
    if (!newAffiliate.name || !newAffiliate.email) return;
    
    const affiliate = {
      id: affiliates.length + 1,
      name: newAffiliate.name,
      email: newAffiliate.email,
      signups: 0,
      rewards: 0,
      status: 'active',
      joinDate: new Date().toISOString().split('T')[0]
    };
    
    setAffiliates([...affiliates, affiliate]);
    setNewAffiliate({ name: '', email: '', commissionRate: '5' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Affiliate Rewards</h1>
          <p className="text-gray-600">Manage affiliate program and track performance</p>
        </div>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{affiliates.length}</div>
            <div className="text-gray-600">Total Affiliates</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {affiliates.reduce((sum, aff) => sum + aff.signups, 0)}
            </div>
            <div className="text-gray-600">Total Sign-ups</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {affiliates.reduce((sum, aff) => sum + aff.rewards, 0)} PGC
            </div>
            <div className="text-gray-600">Total Rewards</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">5 PGC</div>
            <div className="text-gray-600">Per Sign-up</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add New Affiliate */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add Affiliate
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input
                placeholder="Affiliate Name"
                value={newAffiliate.name}
                onChange={(e) => setNewAffiliate({...newAffiliate, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Email *</Label>
              <Input
                type="email"
                placeholder="affiliate@example.com"
                value={newAffiliate.email}
                onChange={(e) => setNewAffiliate({...newAffiliate, email: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Commission Rate</Label>
              <Select value={newAffiliate.commissionRate} onValueChange={(value) => setNewAffiliate({...newAffiliate, commissionRate: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 PGC per sign-up</SelectItem>
                  <SelectItem value="5">5 PGC per sign-up</SelectItem>
                  <SelectItem value="10">10 PGC per sign-up</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={addAffiliate} className="w-full">
              Add Affiliate
            </Button>
          </CardContent>
        </Card>

        {/* Affiliates Table */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Affiliate Partners</CardTitle>
            <CardDescription>Manage and track affiliate performance</CardDescription>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input placeholder="Search affiliates..." className="pl-8" />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Affiliate</TableHead>
                  <TableHead>Sign-ups</TableHead>
                  <TableHead>Rewards</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {affiliates.map((affiliate) => (
                  <TableRow key={affiliate.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{affiliate.name}</div>
                        <div className="text-sm text-gray-500">{affiliate.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{affiliate.signups}</TableCell>
                    <TableCell>{affiliate.rewards} PGC</TableCell>
                    <TableCell>
                      <Badge variant={affiliate.status === 'active' ? 'default' : 'secondary'}>
                        {affiliate.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        <Mail className="h-3 w-3 mr-1" />
                        Contact
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}