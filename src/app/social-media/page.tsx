
'use client';
import { AppLayout } from '@/components/app-layout';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
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
} from 'lucide-react';
import { socialPosts, users } from '@/lib/data';
import Image from 'next/image';
import Link from 'next/link';
import { useUser } from '@/firebase';
import { Badge } from '@/components/ui/badge';
import { placeholderImages } from '@/lib/placeholder-images.json';

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
            placeholder="What's on your mind?"
            className="flex-1 resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none p-0"
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center p-4 border-t">
        <div className="flex gap-2 text-muted-foreground">
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

function PostCard({ post }: { post: (typeof socialPosts)[0] }) {
  const author = users.find((user) => user.id === post.authorId);

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
        <p className="mb-4">{post.content}</p>
        {post.imageUrl && (
          <div className="relative aspect-video w-full rounded-lg overflow-hidden border">
            <Image
              src={post.imageUrl}
              alt="Post image"
              fill
              style={{ objectFit: 'cover' }}
              data-ai-hint={post.imageHint}
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 border-t flex justify-between">
        <div className="flex gap-2">
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

export default function SocialMediaPage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-8 max-w-3xl mx-auto">
        <div>
          <h1 className="font-headline text-3xl font-bold">Social Media Hub</h1>
          <p className="text-muted-foreground">
            Connect with the community, share your thoughts, and stay updated.
          </p>
        </div>
        <CreatePostCard />
        <div className="space-y-6">
          {socialPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
