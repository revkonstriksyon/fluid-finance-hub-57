
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, Loader2 } from "lucide-react";
import { UserSearchResult } from "@/types/messaging";
import { supabase } from "@/lib/supabase";

interface NewMessageModalProps {
  showModal: boolean;
  onClose: () => void;
  onStartConversation: (userId: string) => Promise<void>;
  currentUserId: string | undefined;
}

export const NewMessageModal = ({
  showModal,
  onClose,
  onStartConversation,
  currentUserId
}: NewMessageModalProps) => {
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [searchingUsers, setSearchingUsers] = useState(false);
  const [userSearchResults, setUserSearchResults] = useState<UserSearchResult[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserSearchResult | null>(null);

  // Search for users to message
  const searchUsers = async (query: string) => {
    if (!query.trim() || !currentUserId) return;
    
    try {
      setSearchingUsers(true);
      
      // Search for users by full_name or username
      const { data: usersData, error: usersError } = await supabase
        .from("profiles")
        .select("id, full_name, username, avatar_url")
        .or(`full_name.ilike.%${query}%,username.ilike.%${query}%`)
        .neq("id", currentUserId) // Exclude current user
        .limit(10);
      
      if (usersError) throw usersError;
      
      // Get current user's friend list to check friendship status
      const { data: friendsData, error: friendsError } = await supabase
        .from("friends")
        .select("*")
        .or(`user_id.eq.${currentUserId},friend_id.eq.${currentUserId}`);
      
      if (friendsError) throw friendsError;
      
      // Map user results with friendship status
      const resultsWithFriendStatus = usersData.map(userData => {
        const friend = friendsData?.find(
          f => (f.user_id === currentUserId && f.friend_id === userData.id) || 
               (f.friend_id === currentUserId && f.user_id === userData.id)
        );
        
        return {
          ...userData,
          isFriend: !!friend && friend.status === "accepted",
          friendStatus: friend?.status as "pending" | "accepted" | "rejected" | undefined
        };
      });
      
      setUserSearchResults(resultsWithFriendStatus);
    } catch (error) {
      console.error("Error searching users:", error);
    } finally {
      setSearchingUsers(false);
    }
  };

  // Search for users when userSearchTerm changes
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (userSearchTerm) {
        searchUsers(userSearchTerm);
      } else {
        setUserSearchResults([]);
      }
    }, 300);
    
    return () => clearTimeout(delayDebounce);
  }, [userSearchTerm, currentUserId]);

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-finance-navy rounded-lg max-w-md w-full p-4 m-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Nouvo Mesaj</h2>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => {
              onClose();
              setUserSearchTerm("");
              setUserSearchResults([]);
              setSelectedUser(null);
            }}
          >
            <X size={18} />
          </Button>
        </div>
        
        <div className="mb-4">
          {selectedUser ? (
            <div className="flex items-center justify-between bg-finance-lightGray/70 dark:bg-white/10 p-2 rounded">
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src={selectedUser.avatar_url || ""} />
                  <AvatarFallback className="bg-finance-blue text-white">
                    {selectedUser.full_name 
                      ? selectedUser.full_name.split(' ').map(n => n[0]).join('')
                      : selectedUser.username?.substring(0, 2) || "??"}
                  </AvatarFallback>
                </Avatar>
                <span>{selectedUser.full_name || selectedUser.username}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedUser(null)}
              >
                <X size={16} />
              </Button>
            </div>
          ) : (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-finance-charcoal/50 dark:text-white/50 h-4 w-4" />
              <Input 
                placeholder="Chèche itilizatè..." 
                className="pl-10"
                value={userSearchTerm}
                onChange={(e) => setUserSearchTerm(e.target.value)}
              />
            </div>
          )}
        </div>
        
        {!selectedUser && userSearchResults.length > 0 && (
          <div className="max-h-60 overflow-y-auto mb-4">
            {userSearchResults.map(user => (
              <div 
                key={user.id}
                className="flex items-center space-x-3 p-2 hover:bg-finance-lightGray/50 dark:hover:bg-white/5 cursor-pointer rounded"
                onClick={() => setSelectedUser(user)}
              >
                <Avatar>
                  <AvatarImage src={user.avatar_url || ""} />
                  <AvatarFallback className="bg-finance-blue text-white">
                    {user.full_name 
                      ? user.full_name.split(' ').map(n => n[0]).join('')
                      : user.username?.substring(0, 2) || "??"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user.full_name || "Itilizatè"}</p>
                  <p className="text-sm text-finance-charcoal/70 dark:text-white/70">
                    @{user.username || "username"}
                  </p>
                </div>
                {user.isFriend && (
                  <span className="ml-auto text-xs bg-finance-blue/10 text-finance-blue dark:bg-finance-blue/20 py-1 px-2 rounded-full">
                    Zanmi
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
        
        {!selectedUser && userSearchTerm && userSearchResults.length === 0 && !searchingUsers && (
          <div className="text-center py-4 text-finance-charcoal/70 dark:text-white/70">
            Pa gen rezilta pou "{userSearchTerm}"
          </div>
        )}
        
        {searchingUsers && (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-finance-blue" />
          </div>
        )}
        
        <div className="flex justify-end">
          <Button
            onClick={() => selectedUser && onStartConversation(selectedUser.id)}
            disabled={!selectedUser}
          >
            Kòmanse Konvèsasyon
          </Button>
        </div>
      </div>
    </div>
  );
};
