
import { useEffect } from 'react';
import { CreatePostForm } from './posts/CreatePostForm';
import { PostList } from './posts/PostList';
import { usePostOperations } from '@/hooks/usePostOperations';

const PostsTab = () => {
  const { posts, isLoading, fetchPosts, handleLike, addNewPost, deletePost, handleCommentAdded } = usePostOperations();
  
  // Fetch posts on component mount
  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="space-y-6">
      <CreatePostForm onPostCreated={addNewPost} />
      
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
