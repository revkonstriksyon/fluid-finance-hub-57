
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

export interface CommentData {
  id: string;
  content: string;
  created_at: string;
  user: {
    full_name: string;
    username: string;
    avatar_url: string | null;
  };
  user_id: string;
}

interface CommentsProps {
  postId: string;
  commentsCount: number;
  onCommentAdded: () => void;
}

export const Comments = ({ postId, commentsCount, onCommentAdded }: CommentsProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<CommentData[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCommentsLoading, setIsCommentsLoading] = useState(false);

  const toggleComments = async () => {
    const newShowState = !showComments;
    setShowComments(newShowState);
    
    if (newShowState && comments.length === 0) {
      await fetchComments();
    }
  };

  const fetchComments = async () => {
    try {
      setIsCommentsLoading(true);
      
      // Fetch comments for this post
      const { data: commentsData, error } = await supabase
        .from('post_comments')
        .select(`
          id,
          content,
          created_at,
          user_id,
          profiles(
            full_name,
            username,
            avatar_url
          )
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });
        
      if (error) {
        console.error('Error fetching comments:', error);
        toast({
          title: 'Erè nan chajman kòmantè yo',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      const processedComments = commentsData.map((comment: any) => {
        // Get the profile data
        const profileData = comment.profiles;
        
        return {
          id: comment.id,
          content: comment.content,
          created_at: comment.created_at,
          user_id: comment.user_id,
          user: {
            full_name: profileData?.full_name || 'User',
            username: profileData?.username || '',
            avatar_url: profileData?.avatar_url || null,
          }
        };
      });
      
      setComments(processedComments);
    } catch (error) {
      console.error('Error in fetchComments:', error);
      toast({
        title: 'Erè nan chajman kòmantè yo',
        description: 'Yon erè te fèt pandan chajman kòmantè yo.',
        variant: 'destructive',
      });
    } finally {
      setIsCommentsLoading(false);
    }
  };

  const addComment = async () => {
    if (!user) {
      toast({
        title: 'Ou pa konekte',
        description: 'Ou dwe konekte pou w ka ajoute yon kòmantè',
        variant: 'destructive',
      });
      return;
    }

    if (!newComment.trim()) {
      toast({
        title: 'Kòmantè vid',
        description: 'Ou pa ka ajoute yon kòmantè vid',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsLoading(true);
      
      // Insert new comment
      const { data: commentData, error } = await supabase
        .from('post_comments')
        .insert({
          post_id: postId,
          user_id: user.id,
          content: newComment,
        })
        .select(`
          id,
          content,
          created_at,
          user_id
        `)
        .single();
        
      if (error) {
        console.error('Error adding comment:', error);
        toast({
          title: 'Erè',
          description: 'Yon erè te fèt pandan ajoute kòmantè a',
          variant: 'destructive',
        });
        return;
      }

      // Get the current user's profile data
      const { data: profileData } = await supabase
        .from('profiles')
        .select('full_name, username, avatar_url')
        .eq('id', user.id)
        .single();

      // Create a new comment object
      const newCommentObj: CommentData = {
        id: commentData.id,
        content: commentData.content,
        created_at: commentData.created_at,
        user_id: commentData.user_id,
        user: {
          full_name: profileData?.full_name || 'User',
          username: profileData?.username || '',
          avatar_url: profileData?.avatar_url || null,
        }
      };
      
      // Add the new comment to the list
      setComments([...comments, newCommentObj]);
      
      // Clear the input field
      setNewComment('');
      
      // Notify the parent component that a comment was added
      onCommentAdded();
      
      toast({
        title: 'Siksè',
        description: 'Kòmantè a te ajoute avèk siksè',
      });
    } catch (error) {
      console.error('Error in addComment:', error);
      toast({
        title: 'Erè nan ajoute kòmantè a',
        description: 'Yon erè te fèt pandan ajoute kòmantè a.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-HT', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getInitials = (name: string) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="mt-2">
      <button 
        className="text-sm text-finance-charcoal/70 dark:text-white/70 hover:text-finance-blue transition-colors"
        onClick={toggleComments}
      >
        {showComments ? 'Kache kòmantè yo' : `Montre ${commentsCount} kòmantè yo`}
      </button>
      
      {showComments && (
        <div className="mt-4 space-y-4">
          {isCommentsLoading ? (
            <p className="text-sm text-center py-2">Chajman kòmantè yo...</p>
          ) : comments.length === 0 ? (
            <p className="text-sm text-center py-2 text-finance-charcoal/70 dark:text-white/70">
              Pa gen okenn kòmantè pou lemoman.
            </p>
          ) : (
            <div className="space-y-4">
              {comments.map(comment => (
                <div key={comment.id} className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.user.avatar_url || ""} />
                    <AvatarFallback className="bg-finance-blue text-white text-xs">
                      {getInitials(comment.user.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                    <div className="flex justify-between">
                      <span className="font-semibold text-sm">{comment.user.full_name}</span>
                      <span className="text-xs text-finance-charcoal/60 dark:text-white/60">
                        {formatDate(comment.created_at)}
                      </span>
                    </div>
                    <p className="text-sm mt-1">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {user && (
            <div className="flex gap-2 mt-4">
              <Input
                placeholder="Ekri yon kòmantè..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={addComment} 
                size="sm" 
                disabled={isLoading || !newComment.trim()}
                className="whitespace-nowrap"
              >
                {isLoading ? 'Ap voye...' : 'Voye'}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
