
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2 } from "lucide-react";

interface MessageInputProps {
  newMessage: string;
  setNewMessage: (value: string) => void;
  handleSendMessage: () => void;
  sendingMessage: boolean;
}

export const MessageInput = ({
  newMessage,
  setNewMessage,
  handleSendMessage,
  sendingMessage
}: MessageInputProps) => {
  return (
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
  );
};
