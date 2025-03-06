
import { Post, PostData } from './Post';
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";

interface PostListProps {
  posts: PostData[];
  isLoading: boolean;
  onLikeToggle: (postId: string, currentlyLiked: boolean) => Promise<void>;
  onDeletePost?: (postId: string) => Promise<void>;
  onCommentAdded?: (postId: string) => Promise<void>;
}

export const PostList = ({ posts, isLoading, onLikeToggle, onDeletePost, onCommentAdded }: PostListProps) => {
  if (isLoading) {
    return (
      <>
        {Array.from({ length: 3 }).map((_, index) => (
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
        ))}
      </>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="finance-card p-8 text-center">
        <div className="flex flex-col items-center gap-2">
          <AlertCircle className="h-10 w-10 text-finance-charcoal/50 dark:text-white/50" />
          <p className="text-finance-charcoal/70 dark:text-white/70">
            Pa gen okenn pòs pou lemoman. Pataje premye pòs ou a!
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {posts.map(post => (
        <Post 
          key={post.id} 
          post={post} 
          onLikeToggle={onLikeToggle}
          onDeletePost={onDeletePost}
          onCommentAdded={onCommentAdded}
        />
      ))}
    </>
  );
};
