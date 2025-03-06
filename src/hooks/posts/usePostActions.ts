
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { User } from '@/contexts/AuthContext';
import { PostData } from '@/types/posts';

export const usePostActions = (user: User | null, posts: PostData[], setPosts: (posts: PostData[]) => void) => {
  const { toast } = useToast();

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
    handleLike,
    deletePost,
    handleCommentAdded,
    addNewPost
  };
};
