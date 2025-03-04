
import { useState } from "react";
import Layout from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Search, Send } from "lucide-react";

interface Message {
  id: number;
  content: string;
  sender: string;
  time: string;
  isMe: boolean;
}

interface Conversation {
  id: number;
  user: {
    name: string;
    avatar: string;
    initials: string;
    status: "online" | "offline" | "away";
  };
  lastMessage: string;
  time: string;
  unread: number;
  messages: Message[];
}

const conversations: Conversation[] = [
  {
    id: 1,
    user: {
      name: "Marie Joseph",
      avatar: "",
      initials: "MJ",
      status: "online"
    },
    lastMessage: "Mèsi pou èd ou a!",
    time: "2m",
    unread: 2,
    messages: [
      { id: 1, content: "Bonjou, kijan ou ye?", sender: "Marie Joseph", time: "10:15", isMe: false },
      { id: 2, content: "Mwen byen, e ou menm?", sender: "Jean Baptiste", time: "10:18", isMe: true },
      { id: 3, content: "M'ap chèche enfòmasyon sou nouvo prè a", sender: "Marie Joseph", time: "10:20", isMe: false },
      { id: 4, content: "Wi. Ki kalite prè w'ap chèche?", sender: "Jean Baptiste", time: "10:25", isMe: true },
      { id: 5, content: "Mwen vle konnen kondisyon pou yon prè biznis", sender: "Marie Joseph", time: "10:28", isMe: false },
      { id: 6, content: "Mèsi pou èd ou a!", sender: "Marie Joseph", time: "10:35", isMe: false },
    ]
  },
  {
    id: 2,
    user: {
      name: "Pierre Louis",
      avatar: "",
      initials: "PL",
      status: "offline"
    },
    lastMessage: "Nou pral diskite sa demen",
    time: "1h",
    unread: 0,
    messages: [
      { id: 1, content: "Bonjou, m'ap chèche konnen plis sou envèstisman", sender: "Pierre Louis", time: "09:10", isMe: false },
      { id: 2, content: "Kisa w'ap chèche envesti ladan l?", sender: "Jean Baptiste", time: "09:15", isMe: true },
      { id: 3, content: "Mwen panse ak aksyon teknoloji", sender: "Pierre Louis", time: "09:20", isMe: false },
      { id: 4, content: "Sa se yon bon chwa. Nou ka gade opsyon yo.", sender: "Jean Baptiste", time: "09:25", isMe: true },
      { id: 5, content: "Nou pral diskite sa demen", sender: "Pierre Louis", time: "09:30", isMe: false },
    ]
  },
  {
    id: 3,
    user: {
      name: "Josette Michaud",
      avatar: "",
      initials: "JM",
      status: "away"
    },
    lastMessage: "Mwen pral tcheke kont mwen an",
    time: "1j",
    unread: 0,
    messages: [
      { id: 1, content: "Èske ou ka ede m ak yon pwoblèm sou kont mwen an?", sender: "Josette Michaud", time: "Yes", isMe: false },
      { id: 2, content: "Wi, kisa ki pwoblèm nan?", sender: "Jean Baptiste", time: "Yes", isMe: true },
      { id: 3, content: "Mwen pa ka wè dènye depo mwen an", sender: "Josette Michaud", time: "Yes", isMe: false },
      { id: 4, content: "Depo a pral parèt apre 24 èdtan", sender: "Jean Baptiste", time: "Yes", isMe: true },
      { id: 5, content: "Mwen pral tcheke kont mwen an", sender: "Josette Michaud", time: "Yes", isMe: false },
    ]
  }
];

const MessagesPage = () => {
  const [activeConversation, setActiveConversation] = useState<Conversation>(conversations[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    
    // Here you would typically send the message to a server
    // For now, we'll just simulate adding it to the conversation
    console.log("Sending message:", newMessage);
    
    setNewMessage("");
  };

  const filteredConversations = conversations.filter(convo => 
    convo.user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-green-500";
      case "away": return "bg-yellow-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <Layout>
      <div className="h-[calc(100vh-5rem)] overflow-hidden">
        <div className="grid md:grid-cols-3 h-full gap-4">
          {/* Left sidebar - conversation list */}
          <div className="md:col-span-1 finance-card overflow-hidden flex flex-col">
            <div className="p-4 border-b border-finance-midGray/30 dark:border-white/10">
              <h1 className="text-xl font-bold mb-3">Mesaj</h1>
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
              {filteredConversations.map(conversation => (
                <div 
                  key={conversation.id}
                  className={`p-3 border-b border-finance-midGray/10 dark:border-white/5 cursor-pointer hover:bg-finance-lightGray/50 dark:hover:bg-white/5 transition-colors ${activeConversation.id === conversation.id ? 'bg-finance-lightGray/70 dark:bg-white/10' : ''}`}
                  onClick={() => setActiveConversation(conversation)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={conversation.user.avatar} />
                        <AvatarFallback className="bg-finance-blue text-white">
                          {conversation.user.initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-finance-navy ${getStatusColor(conversation.user.status)}`}></span>
                    </div>
                    
                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium truncate">{conversation.user.name}</h3>
                        <span className="text-xs text-finance-charcoal/70 dark:text-white/70 whitespace-nowrap">{conversation.time}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-finance-charcoal/70 dark:text-white/70 truncate">
                          {conversation.lastMessage}
                        </p>
                        {conversation.unread > 0 && (
                          <span className="bg-finance-blue text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {conversation.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right side - active conversation */}
          <div className="md:col-span-2 finance-card overflow-hidden flex flex-col">
            {/* Conversation header */}
            <div className="p-4 border-b border-finance-midGray/30 dark:border-white/10 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={activeConversation.user.avatar} />
                  <AvatarFallback className="bg-finance-blue text-white">
                    {activeConversation.user.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-bold">{activeConversation.user.name}</h2>
                  <div className="flex items-center space-x-1">
                    <span className={`h-2 w-2 rounded-full ${getStatusColor(activeConversation.user.status)}`}></span>
                    <span className="text-xs text-finance-charcoal/70 dark:text-white/70">
                      {activeConversation.user.status === "online" ? "Anliy" : 
                       activeConversation.user.status === "away" ? "Absán" : "Òfliy"}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <Button variant="outline" size="sm">Wè Pwofil</Button>
              </div>
            </div>
            
            {/* Messages area */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
              {activeConversation.messages.map(message => (
                <div key={message.id} className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] ${message.isMe ? 
                    'bg-finance-blue text-white rounded-t-lg rounded-bl-lg' : 
                    'bg-finance-lightGray/70 dark:bg-white/10 text-finance-charcoal dark:text-white rounded-t-lg rounded-br-lg'
                  } p-3`}>
                    <p>{message.content}</p>
                    <p className={`text-xs mt-1 ${message.isMe ? 'text-white/70' : 'text-finance-charcoal/70 dark:text-white/70'}`}>{message.time}</p>
                  </div>
                </div>
              ))}
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
                />
                <Button 
                  className="self-end" 
                  onClick={handleSendMessage}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Voye
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MessagesPage;
