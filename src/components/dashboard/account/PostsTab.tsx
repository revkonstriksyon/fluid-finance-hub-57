
import { useEffect, useState } from 'react';
import { CreatePostForm } from './posts/CreatePostForm';
import { PostList } from './posts/PostList';
import { usePostOperations } from '@/hooks/usePostOperations';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

const PostsTab = () => {
  const { posts, isLoading, fetchPosts, handleLike, addNewPost, deletePost, handleCommentAdded } = usePostOperations();
  const { toast } = useToast();
  const [dataLoaded, setDataLoaded] = useState(false);
  
  // Fetch posts on component mount with error handling
  useEffect(() => {
    const loadPosts = async () => {
      try {
        console.log("Fetching posts...");
        await fetchPosts();
        setDataLoaded(true);
        console.log("Posts fetched successfully");
      } catch (error) {
        console.error("Error fetching posts:", error);
        toast({
          title: 'Erè nan chajman pòs yo',
          description: 'Yon pwoblèm te rive pandan chajman pòs yo. Tanpri eseye ankò.',
          variant: 'destructive',
        });
      }
    };
    
    loadPosts();
  }, []);

  // Log the posts to help debug
  useEffect(() => {
    console.log("Current posts:", posts);
  }, [posts]);

  return (
    <div className="space-y-6">
      <CreatePostForm onPostCreated={addNewPost} />
      
      {isLoading && !dataLoaded ? (
        <div className="finance-card p-8 text-center">
          <p className="text-finance-charcoal/70 dark:text-white/70">
            Ap chaje pòs yo...
          </p>
        </div>
      ) : (
        <PostList 
          posts={posts}
          isLoading={isLoading}
          onLikeToggle={handleLike}
          onDeletePost={deletePost}
          onCommentAdded={handleCommentAdded}
        />
      )}

      {dataLoaded && posts.length === 0 && !isLoading && (
        <div className="finance-card p-8 text-center">
          <p className="text-finance-charcoal/70 dark:text-white/70">
            Pa gen okenn pòs ki disponib pou lemoman. Kreye premye pòs ou!
          </p>
        </div>
      )}
    </div>
  );
};

export default PostsTab;
