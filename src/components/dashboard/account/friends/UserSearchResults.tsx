
import { Clock, UserPlus, MessageSquare } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserSearchResult } from "@/types/messaging";

interface UserSearchResultsProps {
  results: UserSearchResult[];
  isLoading: boolean;
  searchTerm: string;
  sendFriendRequest: (friendId: string) => Promise<void>;
  startConversation: (friendId: string) => Promise<void>;
  emptyMessage?: string;
}

const UserSearchResults = ({
  results,
  isLoading,
  searchTerm,
  sendFriendRequest,
  startConversation,
  emptyMessage = "Chèche itilizatè pou ajoute kòm zanmi.",
}: UserSearchResultsProps) => {
  
  return (
    <div className="space-y-3">
      {results.length === 0 ? (
        <p className="text-center py-4 text-finance-charcoal/70 dark:text-white/70">
          {searchTerm ? "Nou pa jwenn okenn itilizatè. Eseye chanje tèm rechèch la." : emptyMessage}
        </p>
      ) : (
        results.map((result) => (
          <div key={result.id} className="flex items-center p-3 border border-finance-midGray/30 dark:border-white/10 rounded-lg">
            <Avatar className="h-12 w-12 mr-4">
              <AvatarImage src={result.avatar_url || ""} />
              <AvatarFallback className="bg-finance-blue text-white">
                {result.full_name 
                  ? result.full_name.split(' ').map(n => n[0]).join('')
                  : "??"}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <p className="font-medium">{result.full_name || "Itilizatè"}</p>
              <p className="text-sm text-finance-charcoal/70 dark:text-white/70">
                @{result.username || "username"}
              </p>
            </div>
            
            <div>
              {result.isFriend ? (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => startConversation(result.id)}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Mesaj
                </Button>
              ) : result.friendStatus === 'pending' ? (
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Annatant
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => sendFriendRequest(result.id)}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Ajoute
                </Button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default UserSearchResults;
