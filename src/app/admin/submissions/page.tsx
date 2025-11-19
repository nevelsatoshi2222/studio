// app/admin/submissions/page.tsx
'use client';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Eye, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function ContentSubmissions() {
  const [submissions, setSubmissions] = useState([
    { 
      id: 1, 
      influencer: 'crypto_expert', 
      videoType: 'long', 
      views: 12500, 
      watchTime: 65, 
      reward: 25, 
      status: 'pending',
      submittedAt: '2024-03-20 14:30'
    },
    { 
      id: 2, 
      influencer: 'tech_review', 
      videoType: 'overview', 
      views: 18000, 
      watchTime: 72, 
      reward: 42, 
      status: 'approved',
      submittedAt: '2024-03-20 12:15'
    },
    { 
      id: 3, 
      influencer: 'blockchain_daily', 
      videoType: 'short', 
      views: 52000, 
      watchTime: 81, 
      reward: 18, 
      status: 'rejected',
      submittedAt: '2024-03-19 16:45'
    },
  ]);

  const updateStatus = (id: number, status: string) => {
    setSubmissions(submissions.map(sub => 
      sub.id === id ? { ...sub, status } : sub
    ));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-orange-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Content Submissions</h1>
          <p className="text-gray-600">Review and manage influencer content submissions</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Submission Queue</CardTitle>
          <CardDescription>
            {submissions.filter(s => s.status === 'pending').length} pending reviews
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Influencer</TableHead>
                <TableHead>Video Type</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Watch Time</TableHead>
                <TableHead>Reward</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell className="font-medium">{submission.influencer}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {submission.videoType}
                    </Badge>
                  </TableCell>
                  <TableCell>{submission.views.toLocaleString()}</TableCell>
                  <TableCell>{submission.watchTime}%</TableCell>
                  <TableCell className="font-semibold">{submission.reward} PGC</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(submission.status)}
                      <span className="capitalize">{submission.status}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {new Date(submission.submittedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      {submission.status === 'pending' && (
                        <>
                          <Button 
                            size="sm" 
                            onClick={() => updateStatus(submission.id, 'approved')}
                          >
                            Approve
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => updateStatus(submission.id, 'rejected')}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
