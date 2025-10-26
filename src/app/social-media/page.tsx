
'use client';
import { AppLayout } from '@/components/app-layout';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  ThumbsUp,
  MessageSquare,
  Share2,
  Image as ImageIcon,
  Link2,
  Video,
  Youtube,
  Instagram,
  Twitter,
  Facebook,
  Hash,
} from 'lucide-react';
import { socialPosts, users } from '@/lib/data';
import Image from 'next/image';
import Link from 'next/link';
import { useUser } from '@/firebase';
import { Badge } from '@/components/ui/badge';
import { placeholderImages } from '@/lib/placeholder-images.json';
import { cn } from '@/lib/utils';
import React from 'react';


const getAvatarUrl = (avatarId: string) => {
    const image = placeholderImages.find((img) => img.id === avatarId);
    return image ? image.imageUrl : `https://picsum.photos/seed/${avatarId}/40/40`;
}

const getAvatarHint = (avatarId: string) => {
    const image = placeholderImages.find((img) => img.id === avatarId);
    return image ? image.imageHint : 'user avatar';
}

function CreatePostCard() {
    const { user } = useUser();

    if (!user) {
        return (
             <Card>
                <CardHeader>
                    <h2 className="text-xl font-semibold">Join the Conversation</h2>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">You must be logged in to create a post.</p>
                </CardContent>
                <CardFooter>
                    <Button asChild>
                        <Link href="/login">Login or Register</Link>
                    </Button>
                </CardFooter>
            </Card>
        )
    }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Avatar>
            <AvatarImage src={user.photoURL || `https://picsum.photos/seed/${user.uid}/40/40`} />
            <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <Textarea
            placeholder="What's on your mind? #PublicGovernance"
            className="flex-1 resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none p-0"
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center p-4 border-t">
        <div className="flex gap-1 text-muted-foreground">
          <Button variant="ghost" size="icon" aria-label="Upload Image">
            <ImageIcon className="h-5 w-5" />
          </Button>
           <Button variant="ghost" size="icon" aria-label="Upload Video">
            <Video className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Add Link">
            <Link2 className="h-5 w-5" />
          </Button>
        </div>
        <Button>Post</Button>
      </CardFooter>
    </Card>
  );
}

const PostContent = ({ text }: { text: string }) => {
  // Regex to find hashtags and coin symbols
  const regex = /(\$[A-Z]+|#\w+)/g;
  const parts = text.split(regex);

  return (
    <div className="mb-4 whitespace-pre-wrap text-sm">
      {parts.map((part, index) => {
        const coinMatch = part.match(/^\$([A-Z]+)$/);
        if (coinMatch) {
          const coin = coinMatch[1];
          if (coin === 'PGC' || coin === 'IGC') {
            return (
              <span key={index} className="inline-flex items-center">
                <Image
                  src={
                    coin === 'PGC'
                      ? "https://storage.googleapis.com/project-spark-348216.appspot.com/vision_public-governance-859029-c316e_1721831777732_0.png"
                      : "https://storage.googleapis.com/project-spark-348216.appspot.com/vision_public-governance-859029-c316e_1721245050854_1.png"
                  }
                  alt={`${coin} logo`}
                  width={16}
                  height={16}
                  className="inline-block align-middle mr-1 h-4 w-4"
                />
                <span className="font-semibold text-primary">{part}</span>
              </span>
            );
          }
        }
        if (part.startsWith('#')) {
          return (
            <Link href="#" key={index} className="text-primary hover:underline">
              {part}
            </Link>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </div>
  );
};


function PostCard({ post }: { post: (typeof socialPosts)[0] }) {
  const author = users.find((user) => user.id === post.authorId);
  const postImageUrl = post.imageUrl ? placeholderImages.find(p => p.id === post.imageUrl)?.imageUrl : null;
  const postImageHint = post.imageUrl ? placeholderImages.find(p => p.id === post.imageUrl)?.imageHint : null;

  return (
    <Card>
      <CardHeader className="p-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={author ? getAvatarUrl(author.avatarId) : ''} alt={author?.name} data-ai-hint={author ? getAvatarHint(author.avatarId) : 'user avatar'} />
            <AvatarFallback>{author?.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{author?.name}</p>
            <p className="text-xs text-muted-foreground">{post.timestamp}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <PostContent text={post.content} />
        {postImageUrl && (
          <div className="relative aspect-video w-full rounded-lg overflow-hidden border">
            <Image
              src={postImageUrl}
              alt="Post image"
              fill
              style={{ objectFit: 'cover' }}
              data-ai-hint={postImageHint || 'social media image'}
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 border-t flex justify-between">
        <div className="flex gap-1">
            <Button variant="ghost" size="sm">
                <ThumbsUp className="mr-2 h-4 w-4" /> {post.likes} Likes
            </Button>
            <Button variant="ghost" size="sm">
                <MessageSquare className="mr-2 h-4 w-4" /> {post.comments} Comments
            </Button>
        </div>
        <Button variant="ghost" size="sm">
          <Share2 className="mr-2 h-4 w-4" /> Share
        </Button>
      </CardFooter>
    </Card>
  );
}

const socialLinks = [
  { name: 'YouTube', icon: Youtube, href: '#', handle: 'PublicGov' },
  { name: 'Instagram', icon: Instagram, href: '#', handle: '@PublicGov' },
  { name: 'Twitter', icon: Twitter, href: '#', handle: '@PublicGov' },
  { name: 'Facebook', icon: Facebook, href: '#', handle: 'Public Governance' },
];

const trendingTopics = [
    { name: 'PublicGovernance', posts: '15.2k' },
    { name: 'PGC', posts: '11.8k' },
    { name: 'Voting', posts: '9.3k' },
    { name: 'DeFi', posts: '7.1k' },
    { name: 'SocialImpact', posts: '5.9k' },
];


export default function SocialMediaPage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
         <div className="text-center">
            <h1 className="font-headline text-3xl font-bold">Social Media Hub</h1>
            <p className="text-muted-foreground">
                Connect with the community, share your thoughts, and stay updated.
            </p>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <main className="lg:col-span-2 space-y-6">
                <CreatePostCard />
                <div className="space-y-6">
                {socialPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                ))}
                </div>
            </main>
            <aside className="space-y-6 sticky top-20">
                <Card>
                    <CardHeader>
                        <CardTitle>Follow Us</CardTitle>
                        <CardDescription>Stay connected on your favorite platforms.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {socialLinks.map(link => {
                            const Icon = link.icon;
                            return (
                                <Link href={link.href} key={link.name} target="_blank" rel="noopener noreferrer">
                                    <div className="flex items-center gap-4 group p-2 rounded-lg hover:bg-muted">
                                        <Icon className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors"/>
                                        <div>
                                            <p className="font-semibold">{link.name}</p>
                                            <p className="text-sm text-muted-foreground">{link.handle}</p>
                                        </div>
                                    </div>
                                </Link>
                            )
                        })}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Trending Topics</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {trendingTopics.map(topic => (
                             <Link href="#" key={topic.name}>
                                <div className="flex items-start gap-3 group p-2 rounded-lg hover:bg-muted">
                                    <Hash className="h-4 w-4 text-muted-foreground mt-1 group-hover:text-primary"/>
                                    <div>
                                        <p className="font-semibold group-hover:text-primary">{topic.name}</p>
                                        <p className="text-xs text-muted-foreground">{topic.posts} posts</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </CardContent>
                </Card>
            </aside>
         </div>
      </div>
    </AppLayout>
  );
}
