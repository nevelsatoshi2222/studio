
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ArrowUp, MessageSquare, PlusCircle } from 'lucide-react';
import { useCollection, useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';

const postSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters long.").max(200),
  content: z.string().min(20, "Content must be at least 20 characters long.").max(5000),
  topic: z.string().min(1, "Please select a topic."),
  geography: z.string().min(1, "Please select a geography level."),
});

type PostFormValues = z.infer<typeof postSchema>;

type ForumPost = {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  title: string;
  topic: string;
  geography: string;
  upvotes: number;
  comments: number;
  createdAt: {
    seconds: number,
    nanoseconds: number
  } | null;
};

const geographyLevels = ["Global", "Country", "State", "District", "Taluka", "Village", "Street"];
const topics = ["Technology", "Economy", "Environment", "Social", "Governance", "Other"];

function CreatePostCard() {
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();

    const form = useForm<PostFormValues>({
        resolver: zodResolver(postSchema),
        defaultValues: {
            title: '',
            content: '',
            topic: '',
            geography: '',
        },
    });

    if (!user) {
        return (
             <Card>
                <CardHeader>
                    <CardTitle>Join the Discussion</CardTitle>
                    <CardDescription>You must be logged in to raise an issue or create a new post.</CardDescription>
                </CardHeader>
                <CardFooter>
                    <Button asChild>
                        <Link href="/login">Login or Register</Link>
                    </Button>
                </CardFooter>
            </Card>
        )
    }

    const onSubmit = async (data: PostFormValues) => {
        if (!firestore) return;
        try {
            const postsCollection = collection(firestore, 'forums');
            await addDoc(postsCollection, {
                title: data.title,
                content: data.content,
                topic: data.topic,
                geography: data.geography,
                authorId: user.uid,
                authorName: user.displayName || user.email,
                authorAvatar: `https://picsum.photos/seed/${user.uid}/40/40`,
                upvotes: 0,
                comments: 0,
                createdAt: serverTimestamp(),
            });

            toast({
                title: 'Post Created!',
                description: 'Your issue has been successfully raised on the forum.',
            });
            form.reset();
        } catch (error) {
            console.error("Error creating post:", error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to create post. Please try again.',
            });
        }
    };
    
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <PlusCircle className="h-6 w-6 text-primary"/>
                    Raise an Issue or Create a Post
                </CardTitle>
                <CardDescription>Share your proposals, ideas, or concerns with the community.</CardDescription>
            </CardHeader>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., Proposal to fund local park cleanup" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Content</FormLabel>
                        <FormControl>
                            <Textarea placeholder="Describe your issue or proposal in detail..." {...field} rows={5} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <FormField
                        control={form.control}
                        name="topic"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Topic</FormLabel>
                             <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a topic" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {topics.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="geography"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Geography</FormLabel>
                             <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a geography level" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {geographyLevels.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </CardContent>
            <CardFooter>
                 <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? 'Submitting...' : 'Submit Post'}
                </Button>
            </CardFooter>
             </form>
            </Form>
        </Card>
    )
}

function PostSkeleton() {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-start gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-72" />
                        <Skeleton className="h-4 w-48" />
                    </div>
                </div>
            </CardHeader>
            <CardFooter className="flex justify-end gap-4">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-24" />
            </CardFooter>
        </Card>
    )
}

export default function ForumPage() {
    const firestore = useFirestore();

    const postsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'forums'), orderBy('createdAt', 'desc'));
    }, [firestore]);

    const { data: forumPosts, isLoading } = useCollection<ForumPost>(postsQuery);

  return (
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="font-headline text-3xl font-bold">Forum & Governance</h1>
          <p className="text-muted-foreground">
            Discuss proposals and shape the future of the platform.
          </p>
        </div>
        <CreatePostCard />
        <div className="space-y-6">
          {isLoading && (
              <>
                <PostSkeleton />
                <PostSkeleton />
                <PostSkeleton />
              </>
          )}
          {forumPosts && forumPosts.length > 0 ? (
            forumPosts.map(post => (
                <Card key={post.id}>
                <CardHeader>
                    <div className="flex items-start gap-4">
                    <Avatar>
                        <AvatarImage src={post.authorAvatar} alt={post.authorName} />
                        <AvatarFallback>{post.authorName?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle>{post.title}</CardTitle>
                        <CardDescription>
                        Posted by {post.authorName} in {post.topic} ({post.geography}) {' '}
                        - {post.createdAt ? new Date(post.createdAt.seconds * 1000).toLocaleDateString() : ''}
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
            ))
          ) : !isLoading && (
            <Card>
                <CardContent className="p-10 text-center text-muted-foreground">
                    <p>No posts have been created yet.</p>
                    <p>Be the first to raise an issue!</p>
                </CardContent>
            </Card>
          )}
        </div>
      </div>
  );
}
