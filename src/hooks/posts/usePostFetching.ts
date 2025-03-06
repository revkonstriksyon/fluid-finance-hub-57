
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { PostData, PostWithProfile } from '@/types/posts';
import { User } from '@/contexts/AuthContext';

export const usePostFetching = (user: User | null) => {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      
      // Get all posts with user profiles, not just the current user's posts
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select(`
          id,
          content,
          created_at,
          user_id,
          profiles (
            full_name,
            username,
            avatar_url
          )
        `)
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

      console.log('Raw posts data from database:', postsData);

      // Process posts and get additional data
      const processedPosts = await Promise.all(
        (postsData || []).map(async (post: any) => {
          // Get likes count
          const { count: likesCount, error: likesError } = await supabase
            .from('post_likes')
            .select('id', { count: 'exact', head: true })
            .eq('post_id', post.id);
            
          if (likesError) {
            console.error('Error fetching likes count:', likesError);
          }
            
          // Get comments count
          const { count: commentsCount, error: commentsError } = await supabase
            .from('post_comments')
            .select('id', { count: 'exact', head: true })
            .eq('post_id', post.id);
            
          if (commentsError) {
            console.error('Error fetching comments count:', commentsError);
          }
            
          // Check if current user liked this post
          let userLiked = false;
          if (user) {
            const { data: likeData, error: likeError } = await supabase
              .from('post_likes')
              .select('id')
              .eq('post_id', post.id)
              .eq('user_id', user.id)
              .maybeSingle();
              
            if (likeError) {
              console.error('Error checking if user liked post:', likeError);
            } else {
              userLiked = !!likeData;
            }
          }

          // Handle profile data, which could be null or an object
          const profileData = post.profiles;
          console.log('Profile data for post:', post.id, profileData);
          
          // Create formatted post with proper user information
          const formattedPost: PostData = {
            id: post.id,
            content: post.content,
            created_at: post.created_at,
            likes: likesCount || 0,
            comments: commentsCount || 0,
            user_liked: userLiked,
            user_id: post.user_id,
            user: {
              full_name: profileData?.full_name || 'Unknown User',
              username: profileData?.username || 'unknown',
              avatar_url: profileData?.avatar_url || null,
            }
          };
            
          return formattedPost;
        })
      );
      
      console.log('Processed posts:', processedPosts);
      setPosts(processedPosts);
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

  return {
    posts,
    setPosts,
    isLoading,
    fetchPosts
  };
};
