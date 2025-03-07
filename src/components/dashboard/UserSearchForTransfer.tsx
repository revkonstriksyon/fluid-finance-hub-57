
import { useState } from 'react';
import { Search, UserIcon } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/lib/supabase';

interface UserSearchForTransferProps {
  onUserSelect: (userId: string, userEmail: string) => void;
}

interface UserSearchResult {
  id: string;
  email: string;
  username?: string;
  full_name?: string;
}

export const UserSearchForTransfer = ({ onUserSelect }: UserSearchForTransferProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!searchQuery) {
      toast({
        title: "Antre enfòmasyon",
        description: "Tanpri antre imèl oswa non itilizatè a",
        variant: "destructive"
      });
      return;
    }

    setSearching(true);
    try {
      // Search for users by email or username
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, full_name')
        .or(`username.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`)
        .limit(5);

      if (error) {
        console.error('Error searching users:', error);
        toast({
          title: "Erè nan rechèch",
          description: "Nou pa t kapab chèche itilizatè yo. Tanpri eseye ankò.",
          variant: "destructive"
        });
        return;
      }

      // Get the email for each profile (requiring an Auth API call)
      const usersWithAuth = await Promise.all(
        (data || []).map(async (profile) => {
          // Get user email from auth (this is a mock since direct auth.users query isn't available)
          // In a real scenario, you'd store emails in profiles table or use a server function
          return {
            ...profile,
            email: profile.username ? `${profile.username}@example.com` : 'unknown@example.com'
          };
        })
      );

      setSearchResults(usersWithAuth);

      if (usersWithAuth.length === 0) {
        toast({
          title: "Okenn itilizatè pa jwenn",
          description: "Nou pa t jwenn okenn itilizatè ki koresponn ak rechèch ou a.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error in user search:', error);
      toast({
        title: "Erè nan rechèch",
        description: "Gen yon erè ki pase pandan n ap chèche itilizatè yo.",
        variant: "destructive"
      });
    } finally {
      setSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="user-search">Chèche Itilizatè</Label>
        <div className="flex space-x-2">
          <Input
            id="user-search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Imèl oswa non itilizatè"
            onKeyDown={handleKeyPress}
            className="flex-1"
          />
          <Button 
            onClick={handleSearch} 
            disabled={searching || !searchQuery}
            type="button"
          >
            <Search className="h-4 w-4 mr-2" />
            Chèche
          </Button>
        </div>
      </div>

      {searchResults.length > 0 && (
        <div className="border rounded-md p-2 space-y-2 max-h-60 overflow-y-auto">
          {searchResults.map(user => (
            <div 
              key={user.id}
              className="flex items-center p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md cursor-pointer transition-colors"
              onClick={() => onUserSelect(user.id, user.email)}
            >
              <div className="bg-slate-200 dark:bg-slate-700 p-2 rounded-full mr-3">
                <UserIcon className="h-4 w-4 text-slate-700 dark:text-slate-200" />
              </div>
              <div>
                <p className="font-medium">{user.full_name || user.username || 'Unknown'}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserSearchForTransfer;
