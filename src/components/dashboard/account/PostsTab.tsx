
import { useEffect } from 'react';
import { CreatePostForm } from './posts/CreatePostForm';
import { PostList } from './posts/PostList';
import { usePostOperations } from '@/hooks/usePostOperations';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const PostsTab = () => {
  const { posts, isLoading, fetchPosts, handleLike, addNewPost, deletePost, handleCommentAdded } = usePostOperations();
  
  // Fetch posts on component mount
  useEffect(() => {
    fetchPosts();
  }, []);

  // Handler for manual refresh
  const handleRefresh = () => {
    fetchPosts();
  };

  return (
    <div className="space-y-6">
      <CreatePostForm onPostCreated={addNewPost} />
      
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Dènye Pòs yo</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Aktyalize
        </Button>
      </div>
      
      <PostList 
        posts={posts}
        isLoading={isLoading}
        onLikeToggle={handleLike}
        onDeletePost={deletePost}
        onCommentAdded={handleCommentAdded}
      />
    </div>
  );
};

export default PostsTab;
