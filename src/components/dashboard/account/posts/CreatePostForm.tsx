
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { PostData } from './Post';

interface CreatePostFormProps {
  onPostCreated: (newPost: PostData) => void;
}

export const CreatePostForm = ({ onPostCreated }: CreatePostFormProps) => {
  const { user, profile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm({
    defaultValues: {
      content: '',
    },
  });

  const getInitials = (name: string) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };
  
  const createPost = async (values: { content: string }) => {
    if (!user) {
      toast({
        title: 'Ou pa konekte',
        description: 'Ou dwe konekte pou w ka pataje yon pòs',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Insert post into database
      const { data: newPost, error } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          content: values.content,
        })
        .select(`
          id,
          content,
          created_at,
          user_id
        `)
        .single();
        
      if (error) {
        console.error('Error creating post:', error);
        toast({
          title: 'Erè nan kreyasyon pòs la',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      // Create a new formatted post
      const newFormattedPost: PostData = {
        id: newPost.id,
        content: newPost.content,
        created_at: newPost.created_at,
        likes: 0,
        comments: 0,
        user_liked: false,
        user: {
          full_name: profile?.full_name || 'Unknown User',
          username: profile?.username || 'unknown',
          avatar_url: profile?.avatar_url || null,
        }
      };
      
      // Pass the new post to the parent component
      onPostCreated(newFormattedPost);
      
      // Reset form
      form.reset();
      
      toast({
        title: 'Pòs kreye',
        description: 'Pòs ou a te pataje avèk siksè',
      });
    } catch (error) {
      console.error('Error in createPost:', error);
      toast({
        title: 'Erè nan kreyasyon pòs la',
        description: 'Yon erè te fèt pandan kreyasyon pòs la',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="finance-card">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(createPost)} className="space-y-4">
          <div className="flex gap-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={profile?.avatar_url || ""} />
              <AvatarFallback className="bg-finance-blue text-white">
                {profile?.full_name ? getInitials(profile.full_name) : "??"}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea 
                        placeholder="Ki sa kap pase nan lespri w?"
                        className="mb-3 resize-none"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={isSubmitting || !form.watch('content').trim()}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Patajman...
                    </>
                  ) : (
                    'Pataje'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};
