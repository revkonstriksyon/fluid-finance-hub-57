
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFriends } from "@/hooks/useFriends";
import FriendsTabsContent from './friends/TabsContent';

const FriendsTab = () => {
  const { 
    friends, 
    friendRequests, 
    isLoading, 
    allUsers, 
    loadingAllUsers,
    fetchFriends, 
    fetchAllUsers 
  } = useFriends();

  return (
    <div className="space-y-4">
      <div className="finance-card">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full mb-6 bg-finance-lightGray/50 dark:bg-white/5">
            <TabsTrigger value="friends" className="flex-1">Zanmi</TabsTrigger>
            <TabsTrigger value="requests" className="flex-1">
              Demann Zanmi
              {friendRequests.length > 0 && (
                <span className="ml-2 bg-finance-blue text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {friendRequests.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="add" className="flex-1">Ajoute Zanmi</TabsTrigger>
            <TabsTrigger value="search" className="flex-1">Chèche Itilizatè</TabsTrigger>
            <TabsTrigger value="all" className="flex-1">Tout Itilizatè</TabsTrigger>
          </TabsList>
          
          <FriendsTabsContent
            friends={friends}
            friendRequests={friendRequests}
            isLoading={isLoading}
            allUsers={allUsers}
            loadingAllUsers={loadingAllUsers}
            fetchFriends={fetchFriends}
            fetchAllUsers={fetchAllUsers}
          />
        </Tabs>
      </div>
    </div>
  );
};

export default FriendsTab;
