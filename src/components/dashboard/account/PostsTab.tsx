
import { useState, useEffect } from 'react';
import { MessageSquare, Heart, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Skeleton } from '@/components/ui/skeleton';

interface Post {
  id: string;
  content: string;
  created_at: string;
  likes: number;
  comments: number;
  user_liked: boolean;
  user: {
    full_name: string;
    username: string;
    avatar_url: string | null;
  };
}

const PostsTab = () => {
  const { user, profile } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm({
    defaultValues: {
      content: '',
    },
  });

  // Fetch posts on component mount
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      
      // First, get all posts
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (postsError) {
        console.error('Error fetching posts:', postsError);
        toast({
          title: 'Erè nan chajman pòs yo',
          description: postsError.message,
          variant: 'destructive',
        });
        return;
      }

      // Get user data for each post
      const postsWithUserData = await Promise.all(
        postsData.map(async (post) => {
          // Get user profile data
          const { data: userData } = await supabase
            .from('profiles')
            .select('full_name, username, avatar_url')
            .eq('id', post.user_id)
            .single();
            
          // Get likes count
          const { count: likesCount } = await supabase
            .from('post_likes')
            .select('id', { count: 'exact', head: true })
            .eq('post_id', post.id);
            
          // Get comments count
          const { count: commentsCount } = await supabase
            .from('post_comments')
            .select('id', { count: 'exact', head: true })
            .eq('post_id', post.id);
            
          // Check if current user liked this post
          let userLiked = false;
          if (user) {
            const { data: likeData } = await supabase
              .from('post_likes')
              .select('id')
              .eq('post_id', post.id)
              .eq('user_id', user.id)
              .maybeSingle();
              
            userLiked = !!likeData;
          }

          // Create a properly formatted post object that matches our Post interface
          const formattedPost: Post = {
            id: post.id,
            content: post.content,
            created_at: post.created_at,
            likes: likesCount || 0,
            comments: commentsCount || 0,
            user_liked: userLiked,
            user: {
              full_name: userData?.full_name || 'Unknown User',
              username: userData?.username || 'unknown',
              avatar_url: userData?.avatar_url || null,
            }
          };
            
          return formattedPost;
        })
      );
      
      setPosts(postsWithUserData);
    } catch (error) {
      console.error('Error in fetchPosts:', error);
      toast({
        title: 'Erè nan chajman pòs yo',
        description: 'Yon erè te fèt pandan chajman pòs yo.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createPost = async (values: { content: string }) => {
    if (!user) {
      toast({
        title: 'Ou pa konekte',
        description: 'Ou dwe konekte pou w ka pataje yon pòs',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Insert post into database
      const { data: newPost, error } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          content: values.content,
        })
        .select(`
          id,
          content,
          created_at,
          user_id
        `)
        .single();
        
      if (error) {
        console.error('Error creating post:', error);
        toast({
          title: 'Erè nan kreyasyon pòs la',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      // Instead of fetching all posts again, create a new formatted post and add it to the state
      const newFormattedPost: Post = {
        id: newPost.id,
        content: newPost.content,
        created_at: newPost.created_at,
        likes: 0,
        comments: 0,
        user_liked: false,
        user: {
          full_name: profile?.full_name || 'Unknown User',
          username: profile?.username || 'unknown',
          avatar_url: profile?.avatar_url || null,
        }
      };
      
      // Add the new post to the top of the posts array
      setPosts(prevPosts => [newFormattedPost, ...prevPosts]);
      
      // Reset form
      form.reset();
      
      toast({
        title: 'Pòs kreye',
        description: 'Pòs ou a te pataje avèk siksè',
      });
    } catch (error) {
      console.error('Error in createPost:', error);
      toast({
        title: 'Erè nan kreyasyon pòs la',
        description: 'Yon erè te fèt pandan kreyasyon pòs la',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (postId: string, currentlyLiked: boolean) => {
    if (!user) {
      toast({
        title: 'Ou pa konekte',
        description: 'Ou dwe konekte pou w ka renmen yon pòs',
        variant: 'destructive',
      });
      return;
    }

    try {
      if (currentlyLiked) {
        // Unlike - delete the like
        await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);
      } else {
        // Like - insert a new like
        await supabase
          .from('post_likes')
          .insert({
            post_id: postId,
            user_id: user.id,
          });
      }

      // Update local state to reflect the change
      setPosts(posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            likes: currentlyLiked ? post.likes - 1 : post.likes + 1,
            user_liked: !currentlyLiked,
          };
        }
        return post;
      }));
      
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: 'Erè',
        description: 'Yon erè te fèt pandan renmen pòs la',
        variant: 'destructive',
      });
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const secondsDiff = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (secondsDiff < 60) {
      return `${secondsDiff} segonn pase`;
    } else if (secondsDiff < 3600) {
      const minutes = Math.floor(secondsDiff / 60);
      return `${minutes} minit pase`;
    } else if (secondsDiff < 86400) {
      const hours = Math.floor(secondsDiff / 3600);
      return `${hours} èdtan pase`;
    } else {
      const days = Math.floor(secondsDiff / 86400);
      return `${days} jou pase`;
    }
  };

  const getInitials = (name: string) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="finance-card">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(createPost)} className="space-y-4">
            <div className="flex gap-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={profile?.avatar_url || ""} />
                <AvatarFallback className="bg-finance-blue text-white">
                  {profile?.full_name ? getInitials(profile.full_name) : "??"}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea 
                          placeholder="Ki sa kap pase nan lespri w?"
                          className="mb-3 resize-none"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting || !form.watch('content').trim()}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Patajman...
                      </>
                    ) : (
                      'Pataje'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </div>
      
      {isLoading ? (
        // Skeleton loader when loading posts
        Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="finance-card">
            <div className="flex gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-36" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-20 w-full" />
                <div className="flex gap-4">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>
            </div>
          </div>
        ))
      ) : posts.length === 0 ? (
        <div className="finance-card p-8 text-center">
          <p className="text-finance-charcoal/70 dark:text-white/70">
            Pa gen okenn pòs pou lemoman. Pataje premye pòs ou a!
          </p>
        </div>
      ) : (
        // Actual posts
        posts.map(post => (
          <div key={post.id} className="finance-card">
            <div className="flex gap-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={post.user.avatar_url || ""} />
                <AvatarFallback className="bg-finance-blue text-white">
                  {getInitials(post.user.full_name)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex justify-between">
                  <div>
                    <span className="font-bold mr-2">{post.user.full_name}</span>
                    <span className="text-finance-charcoal/70 dark:text-white/70 text-sm">
                      {post.user.username ? `@${post.user.username}` : ''}
                    </span>
                  </div>
                  <span className="text-finance-charcoal/70 dark:text-white/70 text-sm">
                    {formatTimeAgo(post.created_at)}
                  </span>
                </div>
                
                <p className="my-3 whitespace-pre-wrap">{post.content}</p>
                
                <div className="flex gap-4 text-finance-charcoal/70 dark:text-white/70">
                  <button 
                    className="flex items-center gap-1 text-sm hover:text-finance-blue transition-colors" 
                    onClick={() => toast({
                      title: 'Kòmantè yo',
                      description: 'Fonksyonalite kòmantè yo poko disponib',
                    })}
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>{post.comments}</span>
                  </button>
                  <button 
                    className={`flex items-center gap-1 text-sm hover:text-finance-danger transition-colors ${
                      post.user_liked ? 'text-finance-danger' : ''
                    }`}
                    onClick={() => handleLike(post.id, post.user_liked)}
                  >
                    <Heart className={`h-4 w-4 ${post.user_liked ? 'fill-finance-danger' : ''}`} />
                    <span>{post.likes}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default PostsTab;
