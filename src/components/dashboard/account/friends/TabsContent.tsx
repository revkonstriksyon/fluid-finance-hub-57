
import { useState } from 'react';
import { TabsContent } from "@/components/ui/tabs";
import { Friend, UserSearchResult, FriendProfile } from "@/types/messaging";
import { getFriendProfile, switchToTab } from './utils';

// Import the friend-related components
import FriendsList from './FriendsList';
import FriendRequests from './FriendRequests';
import AddFriends from './AddFriends';
import SearchUsers from './SearchUsers';
import AllUsers from './AllUsers';

interface FriendsTabsContentProps {
  friends: Friend[];
  friendRequests: Friend[];
  isLoading: boolean;
  allUsers: UserSearchResult[];
  loadingAllUsers: boolean;
  fetchFriends: () => Promise<void>;
  fetchAllUsers: () => Promise<void>;
}

const FriendsTabsContent = ({
  friends,
  friendRequests,
  isLoading,
  allUsers,
  loadingAllUsers,
  fetchFriends,
  fetchAllUsers
}: FriendsTabsContentProps) => {
  const [userSearchTerm, setUserSearchTerm] = useState("");

  return (
    <>
      {/* Friends List */}
      <TabsContent value="friends">
        <FriendsList 
          friends={friends} 
          isLoading={isLoading} 
          getFriendProfile={getFriendProfile}
          switchToTab={switchToTab}
        />
      </TabsContent>
      
      {/* Friend Requests */}
      <TabsContent value="requests">
        <FriendRequests 
          friendRequests={friendRequests} 
          isLoading={isLoading} 
          getFriendProfile={getFriendProfile}
          fetchFriends={fetchFriends}
          fetchAllUsers={fetchAllUsers}
        />
      </TabsContent>
      
      {/* Add Friends */}
      <TabsContent value="add">
        <AddFriends 
          fetchAllUsers={fetchAllUsers}
        />
      </TabsContent>
      
      {/* Search Users Tab */}
      <TabsContent value="search">
        <SearchUsers 
          fetchAllUsers={fetchAllUsers}
        />
      </TabsContent>
      
      {/* All Users Tab */}
      <TabsContent value="all">
        <AllUsers 
          allUsers={allUsers}
          loadingAllUsers={loadingAllUsers}
          userSearchTerm={userSearchTerm}
          setUserSearchTerm={setUserSearchTerm}
          fetchAllUsers={fetchAllUsers}
        />
      </TabsContent>
    </>
  );
};

export default FriendsTabsContent;
