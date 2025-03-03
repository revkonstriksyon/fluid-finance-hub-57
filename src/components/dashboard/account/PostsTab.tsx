
import { MessageSquare } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from 'react';

interface PostsTabProps {
  tweets: Array<{
    id: number;
    user: {
      name: string;
      username: string;
      profilePic: string;
    };
    content: string;
    time: string;
    likes: number;
    comments: number;
  }>;
}

const PostsTab = ({ tweets }: PostsTabProps) => {
  const [tweet, setTweet] = useState('');

  return (
    <div className="space-y-6">
      <div className="finance-card">
        <div className="flex gap-4">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-finance-blue text-white">JB</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <Textarea 
              placeholder="Ki sa kap pase nan lespri w?"
              className="mb-3 resize-none"
              value={tweet}
              onChange={(e) => setTweet(e.target.value)}
            />
            
            <div className="flex justify-end">
              <Button disabled={!tweet.trim()}>
                Pataje
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {tweets.map(tweet => (
        <div key={tweet.id} className="finance-card">
          <div className="flex gap-4">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-finance-blue text-white">
                {tweet.user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex justify-between">
                <div>
                  <span className="font-bold mr-2">{tweet.user.name}</span>
                  <span className="text-finance-charcoal/70 dark:text-white/70 text-sm">{tweet.user.username}</span>
                </div>
                <span className="text-finance-charcoal/70 dark:text-white/70 text-sm">{tweet.time}</span>
              </div>
              
              <p className="my-3">{tweet.content}</p>
              
              <div className="flex gap-4 text-finance-charcoal/70 dark:text-white/70">
                <button className="flex items-center gap-1 text-sm hover:text-finance-blue transition-colors">
                  <MessageSquare className="h-4 w-4" />
                  <span>{tweet.comments}</span>
                </button>
                <button className="flex items-center gap-1 text-sm hover:text-finance-danger transition-colors">
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                    <path d="M7.5 1.5C7.5 1.5 7 3.5 3.5 3.5V7.5C3.5 11 7.5 13.5 7.5 13.5C7.5 13.5 11.5 11 11.5 7.5V3.5C8 3.5 7.5 1.5 7.5 1.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>{tweet.likes}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostsTab;
