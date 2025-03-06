
import { useState } from 'react';
import { MessageSquare, Heart, Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Comments } from './Comments';

export interface PostData {
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
  user_id?: string; // Add user_id to identify if current user is the post creator
}

interface PostProps {
  post: PostData;
  onLikeToggle: (postId: string, currentlyLiked: boolean) => Promise<void>;
  onDeletePost?: (postId: string) => Promise<void>;
  onCommentAdded?: (postId: string) => Promise<void>;
}

export const Post = ({ post, onLikeToggle, onDeletePost, onCommentAdded }: PostProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const isPostOwner = user?.id === post.user_id;
  const [localCommentsCount, setLocalCommentsCount] = useState(post.comments);
  
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
  
  const handleDelete = async () => {
    if (!onDeletePost) return;
    
    try {
      await onDeletePost(post.id);
      toast({
        title: 'Siksè',
        description: 'Pòs la efase avèk siksè',
      });
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: 'Erè',
        description: 'Yon erè te fèt pandan efase pòs la',
        variant: 'destructive',
      });
    }
  };

  const handleCommentAdded = async () => {
    setLocalCommentsCount(prevCount => prevCount + 1);
    if (onCommentAdded) {
      await onCommentAdded(post.id);
    }
  };
  
  return (
    <div className="finance-card">
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
            <div className="flex items-center gap-2">
              <span className="text-finance-charcoal/70 dark:text-white/70 text-sm">
                {formatTimeAgo(post.created_at)}
              </span>
              
              {isPostOwner && onDeletePost && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <span className="sr-only">Opsyon pòs yo</span>
                      <svg width="15" height="3" viewBox="0 0 15 3" fill="none" xmlns="http://www.w3.org/2000/svg" className="fill-current">
                        <path d="M1.5 3C2.32843 3 3 2.32843 3 1.5C3 0.671573 2.32843 0 1.5 0C0.671573 0 0 0.671573 0 1.5C0 2.32843 0.671573 3 1.5 3Z" />
                        <path d="M7.5 3C8.32843 3 9 2.32843 9 1.5C9 0.671573 8.32843 0 7.5 0C6.67157 0 6 0.671573 6 1.5C6 2.32843 6.67157 3 7.5 3Z" />
                        <path d="M13.5 3C14.3284 3 15 2.32843 15 1.5C15 0.671573 14.3284 0 13.5 0C12.6716 0 12 0.671573 12 1.5C12 2.32843 12.6716 3 13.5 3Z" />
                      </svg>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="text-finance-danger flex items-center" onClick={handleDelete}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Efase pòs la</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
          
          <p className="my-3 whitespace-pre-wrap">{post.content}</p>
          
          <div className="flex gap-4 text-finance-charcoal/70 dark:text-white/70">
            <button 
              className="flex items-center gap-1 text-sm hover:text-finance-blue transition-colors" 
            >
              <MessageSquare className="h-4 w-4" />
              <span>{localCommentsCount}</span>
            </button>
            <button 
              className={`flex items-center gap-1 text-sm hover:text-finance-danger transition-colors ${
                post.user_liked ? 'text-finance-danger' : ''
              }`}
              onClick={() => onLikeToggle(post.id, post.user_liked)}
            >
              <Heart className={`h-4 w-4 ${post.user_liked ? 'fill-finance-danger' : ''}`} />
              <span>{post.likes}</span>
            </button>
          </div>

          {/* Comments section */}
          <Comments 
            postId={post.id}
            commentsCount={localCommentsCount}
            onCommentAdded={handleCommentAdded}
          />
        </div>
      </div>
    </div>
  );
};
