
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { PostData } from '@/components/dashboard/account/posts/Post';
import { useAuth } from '@/contexts/AuthContext';

// Define an interface for the post data returned from the join query
interface PostWithProfile {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: {
    full_name: string | null;
    username: string | null;
    avatar_url: string | null;
  } | null;
}

export const usePostOperations = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<PostData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Subscribe to realtime changes for posts
  useEffect(() => {
    if (!user) return;
    
    const channel = supabase
      .channel('posts-channel')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'posts' }, 
        (payload) => {
          console.log('Post change detected:', payload);
          fetchPosts();
        }
      )
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'post_likes' }, 
        (payload) => {
          console.log('Like change detected:', payload);
          fetchPosts();
        }
      )
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'post_comments' }, 
        (payload) => {
          console.log('Comment change detected:', payload);
          fetchPosts();
        }
      )
      .subscribe();

    // Clean up on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

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
            user_id: post.user_id, // Include user_id to identify post ownership
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

  const deletePost = async (postId: string) => {
    if (!user) {
      toast({
        title: 'Ou pa konekte',
        description: 'Ou dwe konekte pou w ka efase yon pòs',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Delete all likes for this post first (to avoid foreign key constraints)
      await supabase
        .from('post_likes')
        .delete()
        .eq('post_id', postId);
        
      // Delete all comments for this post (to avoid foreign key constraints)
      await supabase
        .from('post_comments')
        .delete()
        .eq('post_id', postId);
        
      // Now delete the post itself
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)
        .eq('user_id', user.id); // Ensure the user can only delete their own posts
        
      if (error) {
        console.error('Error deleting post:', error);
        throw error;
      }
      
      // Update local state to remove the deleted post
      setPosts(posts.filter(post => post.id !== postId));
      
    } catch (error) {
      console.error('Error in deletePost:', error);
      toast({
        title: 'Erè nan efase pòs la',
        description: 'Yon erè te fèt pandan efase pòs la.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const handleCommentAdded = async (postId: string) => {
    try {
      // Get updated comment count
      const { count: commentsCount, error } = await supabase
        .from('post_comments')
        .select('id', { count: 'exact', head: true })
        .eq('post_id', postId);
        
      if (error) {
        console.error('Error getting updated comment count:', error);
        return;
      }
      
      // Update the post in local state with the new comment count
      setPosts(posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: commentsCount || 0
          };
        }
        return post;
      }));
    } catch (error) {
      console.error('Error updating comment count:', error);
    }
  };

  const addNewPost = (newPost: PostData) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };

  return {
    posts,
    isLoading,
    fetchPosts,
    handleLike,
    addNewPost,
    deletePost,
    handleCommentAdded
  };
};
