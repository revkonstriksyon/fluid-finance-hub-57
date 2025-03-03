
import { MessageSquare, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const FriendsTab = () => {
  return (
    <div className="space-y-4">
      <div className="finance-card">
        <h3 className="section-title mb-6">Zanmi ak Kontak</h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="flex items-center p-3 border border-finance-midGray/30 dark:border-white/10 rounded-lg hover:bg-finance-lightGray/50 dark:hover:bg-white/5 transition-colors">
              <Avatar className="h-12 w-12 mr-4">
                <AvatarFallback className="bg-finance-blue text-white">
                  {String.fromCharCode(64 + item)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <p className="font-medium">Friend {item}</p>
                <p className="text-sm text-finance-charcoal/70 dark:text-white/70">@username{item}</p>
              </div>
              
              <Button variant="ghost" size="icon">
                <MessageSquare className="h-5 w-5" />
              </Button>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center mt-6">
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Ajoute Kontak
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FriendsTab;
