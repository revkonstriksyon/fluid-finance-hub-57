
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { PostData, PostWithProfile } from '@/types/posts';
import { User } from '@supabase/supabase-js';

export const usePostFetching = (user: User | null) => {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      console.log("Starting to fetch posts...");
      
      // Get all posts first, without trying to join with profiles
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

      console.log('Raw posts data from database:', postsData);

      // If no posts found, return early
      if (!postsData || postsData.length === 0) {
        console.log('No posts found in database');
        setPosts([]);
        return;
      }

      // Process posts and get additional data
      const processedPosts = await Promise.all(
        (postsData || []).map(async (post: any) => {
          // Fetch profile data separately
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('full_name, username, avatar_url')
            .eq('id', post.user_id)
            .single();
            
          if (profileError) {
            console.error(`Error fetching profile for post ${post.id}:`, profileError);
          }
          
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
