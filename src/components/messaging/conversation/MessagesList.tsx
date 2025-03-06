
import { useRef, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Message } from "@/types/messaging";
import { User } from "@supabase/supabase-js";
import { Loader2, X } from "lucide-react";

interface MessagesListProps {
  messages: Message[];
  loading: boolean;
  user: User | null;
  onDeleteMessage?: (messageId: string) => void;
}

export const MessagesList = ({
  messages,
  loading,
  user,
  onDeleteMessage
}: MessagesListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
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

  if (loading) {
    return (
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        <div className="flex items-center justify-center h-32">
          <Loader2 className="h-6 w-6 animate-spin text-finance-blue" />
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        <div className="h-full flex items-center justify-center text-center text-finance-charcoal/70 dark:text-white/70">
          <p>Pa gen mesaj yo. Kòmanse yon konvèsasyon!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow overflow-y-auto p-4 space-y-4">
      {messages.map(message => (
        <div key={message.id} className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}>
          <div className={`max-w-[75%] relative group ${message.sender_id === user?.id ? 
            'bg-finance-blue text-white rounded-t-lg rounded-bl-lg' : 
            'bg-finance-lightGray/70 dark:bg-white/10 text-finance-charcoal dark:text-white rounded-t-lg rounded-br-lg'
          } p-3`}>
            <p>{message.content}</p>
            <p className={`text-xs mt-1 ${message.sender_id === user?.id ? 'text-white/70' : 'text-finance-charcoal/70 dark:text-white/70'}`}>
              {formatTime(message.created_at)}
            </p>
            
            {message.sender_id === user?.id && onDeleteMessage && (
              <button 
                onClick={() => onDeleteMessage(message.id)}
                className="absolute opacity-0 group-hover:opacity-100 -right-3 -top-3 bg-white dark:bg-gray-800 rounded-full p-1 text-red-500 hover:text-red-700 transition-opacity"
                aria-label="Delete message"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};
