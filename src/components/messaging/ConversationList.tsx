
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Loader2, Users } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Conversation } from "@/types/messaging";
import { User } from "@supabase/supabase-js";

interface ConversationListProps {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  setActiveConversation: (conversation: Conversation) => void;
  loading: boolean;
  user: User | null;
  messages: any[];
  onNewConversation: () => void;
}

export const ConversationList = ({ 
  conversations, 
  activeConversation, 
  setActiveConversation, 
  loading, 
  user,
  messages,
  onNewConversation 
}: ConversationListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  console.log("ConversationList rendered with", conversations.length, "conversations");

  // Filter conversations based on search term
  const filteredConversations = conversations.filter(convo => 
    convo.otherUser?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    convo.otherUser?.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to get status color
  const getStatusColor = (status?: string) => {
    switch (status) {
      case "online": return "bg-green-500";
      case "away": return "bg-yellow-500";
      default: return "bg-gray-500";
    }
  };

  // Function to format time
  const formatTime = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), {
        addSuffix: false,
        locale: fr
      });
    } catch (e) {
      return "jodi a";
    }
  };

  // Calculate unread counts for each conversation
  const getUnreadCount = (conversationId: string) => {
    if (!user) return 0;
    
    // Only count unread messages for the current conversation
    const conversationMessages = messages.filter(msg => 
      (msg.sender_id === activeConversation?.otherUser?.id && 
       msg.receiver_id === user.id) ||
      (msg.receiver_id === activeConversation?.otherUser?.id && 
       msg.sender_id === user.id)
    );
    
    return conversationMessages.filter(
      msg => msg.receiver_id === user.id && !msg.read
    ).length;
  };

  return (
    <div className="md:col-span-1 finance-card overflow-hidden flex flex-col">
      <div className="p-4 border-b border-finance-midGray/30 dark:border-white/10">
        <div className="flex justify-between items-center mb-3">
          <h1 className="text-xl font-bold">Mesaj</h1>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onNewConversation}
          >
            <Plus className="h-4 w-4 mr-1" />
            Nouvo
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-finance-charcoal/50 dark:text-white/50 h-4 w-4" />
          <Input 
            placeholder="Chèche konvèsasyon..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="overflow-y-auto flex-grow">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="h-6 w-6 animate-spin text-finance-blue" />
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="p-4 text-center text-finance-charcoal/70 dark:text-white/70">
            <p className="mb-2">Pa gen konvèsasyon pou montre</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onNewConversation}
              className="mx-auto"
            >
              <Users className="h-4 w-4 mr-2" />
              Kòmanse yon konvèsasyon
            </Button>
          </div>
        ) : (
          filteredConversations.map(conversation => {
            const unreadCount = getUnreadCount(conversation.id);
            
            return (
              <div 
                key={conversation.id}
                className={`p-3 border-b border-finance-midGray/10 dark:border-white/5 cursor-pointer hover:bg-finance-lightGray/50 dark:hover:bg-white/5 transition-colors ${activeConversation?.id === conversation.id ? 'bg-finance-lightGray/70 dark:bg-white/10' : ''}`}
                onClick={() => setActiveConversation(conversation)}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={conversation.otherUser?.avatar_url || ""} />
                      <AvatarFallback className="bg-finance-blue text-white">
                        {conversation.otherUser?.full_name 
                          ? conversation.otherUser.full_name.split(' ').map(n => n[0]).join('')
                          : "??"}
                      </AvatarFallback>
                    </Avatar>
                    <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-finance-navy ${getStatusColor(conversation.otherUser?.status)}`}></span>
                  </div>
                  
                  <div className="flex-grow min-w-0">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium truncate">
                        {conversation.otherUser?.full_name || "Itilizatè"}
                      </h3>
                      <span className="text-xs text-finance-charcoal/70 dark:text-white/70 whitespace-nowrap">
                        {conversation.lastMessage 
                          ? formatTime(conversation.lastMessage.created_at)
                          : formatTime(conversation.created_at)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-finance-charcoal/70 dark:text-white/70 truncate">
                        {conversation.lastMessage?.content || "Pa gen mesaj"}
                      </p>
                      {unreadCount > 0 && (
                        <span className="bg-finance-blue text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
