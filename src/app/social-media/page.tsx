
'use client';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
  Loader2,
  Vote,
  X,
  Expand,
  Shrink,
  RectangleHorizontal,
  RectangleVertical,
  MoreVertical,
  Trash2,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useUser, useFirestore, useCollection, useMemoFirebase, AppUser } from '@/firebase';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import React, { useState, useRef, useEffect } from 'react';
import { addDoc, collection, serverTimestamp, query, orderBy, doc, deleteDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';

type ImageSize = 'small' | 'medium' | 'large' | 'cover';

type SocialPost = {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  imageUrl?: string;
  imageSize?: ImageSize;
  timestamp: {
    seconds: number;
    nanoseconds: number;
  } | null;
  likes: number;
  comments: number;
  mentionsPgc?: boolean;
  mentionsIgc?: boolean;
};

function CreatePostCard() {
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();
    const [postContent, setPostContent] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageSize, setImageSize] = useState<ImageSize>('cover');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const clearImage = () => {
        setImageFile(null);
        setImagePreview(null);
        setImageSize('cover');
        if(fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }

    const handlePost = async () => {
        if (!firestore || !user) {
            toast({ variant: 'destructive', title: 'You must be logged in to post.'});
            return;
        }
        if (!postContent.trim()) {
            toast({ variant: 'destructive', title: 'Post content cannot be empty.'});
            return;
        }

        setIsSubmitting(true);
        try {
            // Note: In a real app, you would upload `imageFile` to Firebase Storage
            // and get a URL. For this prototype, we'll use the local preview URL.
            await addDoc(collection(firestore, 'social_posts'), {
                authorId: user.uid,
                authorName: user.displayName || user.email,
                authorAvatar: user.photoURL || `https://picsum.photos/seed/${user.uid}/40/40`,
                content: postContent,
                imageUrl: imagePreview, // Using the Data URL for preview purposes
                imageSize: imagePreview ? imageSize : null,
                mentionsPgc: postContent.includes('$PGC'),
                mentionsIgc: postContent.includes('$IGC'),
                likes: 0,
                comments: 0,
                timestamp: serverTimestamp(),
            });

            setPostContent('');
            clearImage();
            toast({ title: 'Post created successfully!'});
        } catch (error) {
            console.error("Error creating post:", error);
            toast({ variant: 'destructive', title: 'Failed to create post.'});
        } finally {
            setIsSubmitting(false);
        }
    }

    const SizingControls = () => (
      <div className="pl-14 pt-2">
          <div className="flex items-center gap-2 rounded-lg bg-muted p-1">
              {(['small', 'medium', 'large', 'cover'] as ImageSize[]).map((size) => (
                  <Button
                      key={size}
                      variant={imageSize === size ? 'secondary' : 'ghost'}
                      size="sm"
                      onClick={() => setImageSize(size)}
                      className="capitalize flex-1"
                  >
                      {size === 'small' && <Shrink className="mr-2 h-4 w-4" />}
                      {size === 'medium' && <RectangleHorizontal className="mr-2 h-4 w-4" />}
                      {size === 'large' && <RectangleVertical className="mr-2 h-4 w-4" />}
                      {size === 'cover' && <Expand className="mr-2 h-4 w-4" />}
                      {size}
                  </Button>
              ))}
          </div>
      </div>
  );

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="flex items-start gap-4">
          <Avatar>
            <AvatarImage src={user.photoURL || `https://picsum.photos/seed/${user.uid}/40/40`} />
            <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <Textarea
            placeholder="What's on your mind? #PublicGovernance"
            className="flex-1 resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none p-0"
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
          />
        </div>
        {imagePreview && (
            <div className="pl-14 relative">
                <Image src={imagePreview} alt="Image preview" width={500} height={300} className={cn("rounded-lg border object-contain", {
                    'w-1/3': imageSize === 'small',
                    'w-2/3': imageSize === 'medium',
                    'w-full max-h-96': imageSize === 'large',
                    'w-full aspect-video object-cover': imageSize === 'cover',
                })} />
                <Button variant="ghost" size="icon" className="absolute top-2 right-2 bg-black/50 hover:bg-black/75 text-white hover:text-white" onClick={clearImage}>
                    <X className="h-4 w-4" />
                </Button>
            </div>
        )}
        {imagePreview && <SizingControls />}
      </CardContent>
      <CardFooter className="flex justify-between items-center p-4 border-t">
        <div className="flex gap-1 text-muted-foreground">
          <input 
              type="file" 
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageSelect}
          />
          <Button variant="ghost" size="icon" aria-label="Upload Image" onClick={() => fileInputRef.current?.click()}>
            <ImageIcon className={cn("h-5 w-5", imagePreview && "text-primary")} />
          </Button>
           <Button variant="ghost" size="icon" aria-label="Upload Video" disabled>
            <Video className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Add Link" disabled>
            <Link2 className="h-5 w-5" />
          </Button>
        </div>
        <Button onClick={handlePost} disabled={isSubmitting || !postContent.trim()}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Post
        </Button>
      </CardFooter>
    </Card>
  );
}

const PostContent = ({ text }: { text: string }) => {
    const regex = /(#\w+|\$\w+)/g;
    const parts = text.split(regex);
  
    return (
      <div className="mb-4 whitespace-pre-wrap text-sm text-foreground">
        {parts.map((part, index) => {
          if (part.startsWith('#') || part.startsWith('$')) {
            return (
              <Link href="#" key={index} className="text-primary hover:underline">
                {part}
              </Link>
            );
          }
          return <React.Fragment key={index}>{part}</React.Fragment>;
        })}
      </div>
    );
  };

function PostCard({ post, currentUser }: { post: SocialPost; currentUser: AppUser | null }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    
    const imageSizeClasses = {
      small: 'w-1/2 rounded-lg',
      medium: 'w-2/3 rounded-lg',
      large: 'w-full rounded-lg',
      cover: 'w-full aspect-video rounded-lg',
  };

  const isAuthor = currentUser && currentUser.uid === post.authorId;
  const isAdmin = currentUser && currentUser.role?.includes('Admin');

  const handleDelete = async () => {
    if (!firestore) return;
    try {
        const postRef = doc(firestore, 'social_posts', post.id);
        await deleteDoc(postRef);
        toast({ title: 'Post deleted successfully.'});
    } catch (error) {
        console.error("Error deleting post:", error);
        toast({ variant: 'destructive', title: 'Failed to delete post.'});
    }
  }

  return (
    <Card>
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={post.authorAvatar} alt={post.authorName} />
                <AvatarFallback>{post.authorName?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{post.authorName}</p>
                <p className="text-xs text-muted-foreground">
                    {post.timestamp ? new Date(post.timestamp.seconds * 1000).toLocaleString() : 'Just now'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
                {post.mentionsPgc && (
                    <div className="flex items-center gap-1.5 p-1.5 rounded-md bg-muted">
                         <span className="text-xs font-bold text-primary">PGC</span>
                    </div>
                )}
                {post.mentionsIgc && (
                    <div className="flex items-center gap-1.5 p-1.5 rounded-md bg-muted">
                        <span className="text-xs font-bold text-primary">IGC</span>
                    </div>
                )}
                {(isAuthor || isAdmin) && (
                     <AlertDialog>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <AlertDialogTrigger asChild>
                                    <DropdownMenuItem className="text-destructive">
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete Post
                                    </DropdownMenuItem>
                                </AlertDialogTrigger>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete this post from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
            </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <PostContent text={post.content} />
        {post.imageUrl && (
          <div className="relative mt-4">
            <Image
              src={post.imageUrl}
              alt="Post image"
              width={800}
              height={800}
              className={cn(
                  "border object-contain",
                  imageSizeClasses[post.imageSize || 'cover']
              )}
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

function PostSkeleton() {
    return (
        <Card>
            <CardHeader className="p-4">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16" />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="aspect-video w-full rounded-lg" />
            </CardContent>
            <CardFooter className="p-4 border-t flex justify-between">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
            </CardFooter>
        </Card>
    );
}

export default function SocialMediaPage() {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();

    const postsQuery = useMemoFirebase(() => {
        if (!firestore || !user) return null; // Only query if user is logged in
        return query(collection(firestore, 'social_posts'), orderBy('timestamp', 'desc'));
    }, [firestore, user]);

    const { data: socialPosts, isLoading: arePostsLoading } = useCollection<SocialPost>(postsQuery);

    const isLoading = isUserLoading || arePostsLoading;


  return (
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
                    {isLoading && (
                        <>
                            <PostSkeleton />
                            <PostSkeleton />
                        </>
                    )}
                    {!isLoading && socialPosts && socialPosts.length > 0 ? (
                        socialPosts.map((post) => (
                            <PostCard key={post.id} post={post} currentUser={user} />
                        ))
                    ) : !isLoading && (
                        <Card>
                            <CardContent className="p-10 text-center">
                                <p className="text-muted-foreground">No posts yet. Be the first to share something!</p>
                            </CardContent>
                        </Card>
                    )}
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
  );
}
