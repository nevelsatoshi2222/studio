
'use client';
import { AppLayout } from '@/components/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { forumPosts } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ArrowUp, MessageSquare } from 'lucide-react';

export default function ForumPage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="font-headline text-3xl font-bold">Forum & Governance</h1>
          <p className="text-muted-foreground">
            Discuss proposals and shape the future of the platform.
          </p>
        </div>
        <div className="space-y-6">
          {forumPosts.map(post => (
            <Card key={post.id}>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarImage src={`https://picsum.photos/seed/${post.authorAvatar}/40/40`} alt={post.author} />
                    <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{post.title}</CardTitle>
                    <CardDescription>
                      Posted by {post.author} in {post.topic} ({post.geography})
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardFooter className="flex justify-end gap-4">
                <Button variant="ghost" size="sm">
                  <ArrowUp className="mr-2 h-4 w-4" />
                  {post.upvotes} Upvotes
                </Button>
                <Button variant="ghost" size="sm">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  {post.comments} Comments
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
