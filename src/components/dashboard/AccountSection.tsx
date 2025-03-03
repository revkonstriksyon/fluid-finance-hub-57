
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileSidebar from './account/ProfileSidebar';
import PostsTab from './account/PostsTab';
import PortfolioTab from './account/PortfolioTab';
import FriendsTab from './account/FriendsTab';
import { userData, sampleTweets } from './account/accountData';

const AccountSection = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid md:grid-cols-3 gap-6">
        <div>
          <ProfileSidebar userData={userData} />
        </div>
        
        <div className="md:col-span-2">
          <Tabs defaultValue="posts" className="w-full">
            <TabsList className="w-full mb-4 bg-finance-lightGray/50 dark:bg-white/5">
              <TabsTrigger value="posts" className="flex-1">Pòs</TabsTrigger>
              <TabsTrigger value="portfolio" className="flex-1">Pòtfolyo</TabsTrigger>
              <TabsTrigger value="friends" className="flex-1">Zanmi</TabsTrigger>
            </TabsList>
            
            <TabsContent value="posts">
              <PostsTab tweets={sampleTweets} />
            </TabsContent>
            
            <TabsContent value="portfolio">
              <PortfolioTab />
            </TabsContent>
            
            <TabsContent value="friends">
              <FriendsTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AccountSection;
