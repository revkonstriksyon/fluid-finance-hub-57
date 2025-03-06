
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { MessagingContainer } from "@/components/messaging/MessagingContainer";

const MessagesPage = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <MessagingContainer user={user} />
    </Layout>
  );
};

export default MessagesPage;
