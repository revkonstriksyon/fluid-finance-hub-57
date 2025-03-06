
import { useState } from 'react';
import { MessageSquare, Heart } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

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
}

interface PostProps {
  post: PostData;
  onLikeToggle: (postId: string, currentlyLiked: boolean) => Promise<void>;
}

export const Post = ({ post, onLikeToggle }: PostProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
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
            <span className="text-finance-charcoal/70 dark:text-white/70 text-sm">
              {formatTimeAgo(post.created_at)}
            </span>
          </div>
          
          <p className="my-3 whitespace-pre-wrap">{post.content}</p>
          
          <div className="flex gap-4 text-finance-charcoal/70 dark:text-white/70">
            <button 
              className="flex items-center gap-1 text-sm hover:text-finance-blue transition-colors" 
              onClick={() => toast({
                title: 'Kòmantè yo',
                description: 'Fonksyonalite kòmantè yo poko disponib',
              })}
            >
              <MessageSquare className="h-4 w-4" />
              <span>{post.comments}</span>
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
        </div>
      </div>
    </div>
  );
};
