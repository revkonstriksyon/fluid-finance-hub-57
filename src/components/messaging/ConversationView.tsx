
import { useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2, Plus } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Conversation, Message } from "@/types/messaging";
import { User } from "@supabase/supabase-js";

interface ConversationViewProps {
  activeConversation: Conversation | null;
  messages: Message[];
  loading: boolean;
  user: User | null;
  newMessage: string;
  setNewMessage: (value: string) => void;
  handleSendMessage: () => void;
  sendingMessage: boolean;
  navigateToUserProfile: (userId: string) => void;
  onNewConversation: () => void;
}

export const ConversationView = ({
  activeConversation,
  messages,
  loading,
  user,
  newMessage,
  setNewMessage,
  handleSendMessage,
  sendingMessage,
  navigateToUserProfile,
  onNewConversation
}: ConversationViewProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  // Scroll to bottom of messages when new ones arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!activeConversation) {
    return (
      <div className="md:col-span-2 finance-card overflow-hidden flex flex-col">
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-lg font-medium mb-2">Pa gen konvèsasyon ki seleksyone</h3>
            <p className="text-finance-charcoal/70 dark:text-white/70 mb-4">
              Chwazi yon konvèsasyon oswa kòmanse yon nouvo konvèsasyon
            </p>
            <Button 
              onClick={onNewConversation}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouvo Mesaj
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="md:col-span-2 finance-card overflow-hidden flex flex-col">
      {/* Conversation header */}
      <div className="p-4 border-b border-finance-midGray/30 dark:border-white/10 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src={activeConversation.otherUser?.avatar_url || ""} />
            <AvatarFallback className="bg-finance-blue text-white">
              {activeConversation.otherUser?.full_name
                ? activeConversation.otherUser.full_name.split(' ').map(n => n[0]).join('')
                : "??"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-bold">{activeConversation.otherUser?.full_name || "Itilizatè"}</h2>
            <div className="flex items-center space-x-1">
              <span className={`h-2 w-2 rounded-full ${getStatusColor(activeConversation.otherUser?.status)}`}></span>
              <span className="text-xs text-finance-charcoal/70 dark:text-white/70">
                {activeConversation.otherUser?.status === "online" ? "Anliy" : 
                activeConversation.otherUser?.status === "away" ? "Absán" : "Òfliy"}
              </span>
            </div>
          </div>
        </div>
        <div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigateToUserProfile(activeConversation.otherUser?.id || "")}
          >
            Wè Pwofil
          </Button>
        </div>
      </div>
      
      {/* Messages area */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="h-6 w-6 animate-spin text-finance-blue" />
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center text-finance-charcoal/70 dark:text-white/70">
            <p>Pa gen mesaj yo. Kòmanse yon konvèsasyon!</p>
          </div>
        ) : (
          messages.map(message => (
            <div key={message.id} className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] ${message.sender_id === user?.id ? 
                'bg-finance-blue text-white rounded-t-lg rounded-bl-lg' : 
                'bg-finance-lightGray/70 dark:bg-white/10 text-finance-charcoal dark:text-white rounded-t-lg rounded-br-lg'
              } p-3`}>
                <p>{message.content}</p>
                <p className={`text-xs mt-1 ${message.sender_id === user?.id ? 'text-white/70' : 'text-finance-charcoal/70 dark:text-white/70'}`}>
                  {formatTime(message.created_at)}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Message input */}
      <div className="p-4 border-t border-finance-midGray/30 dark:border-white/10">
        <div className="flex space-x-2">
          <Textarea 
            placeholder="Tape mesaj ou a..." 
            className="min-h-[60px] resize-none"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={sendingMessage}
          />
          <Button 
            className="self-end" 
            onClick={handleSendMessage}
            disabled={sendingMessage || newMessage.trim() === ""}
          >
            {sendingMessage ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Send className="h-4 w-4 mr-2" />
            )}
            Voye
          </Button>
        </div>
      </div>
    </div>
  );
};
