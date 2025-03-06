
import { useAuth } from '@/contexts/AuthContext';
import { usePostRealtime } from './posts/usePostRealtime';
import { usePostFetching } from './posts/usePostFetching';
import { usePostActions } from './posts/usePostActions';
import { PostData } from '@/types/posts';

export const usePostOperations = () => {
  const { user } = useAuth();
  const { posts, setPosts, isLoading, fetchPosts } = usePostFetching(user);
  const { handleLike, deletePost, handleCommentAdded, addNewPost } = usePostActions(user, posts, setPosts);

  // Set up realtime subscriptions
  usePostRealtime(user, fetchPosts);

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
