
import { useState, useEffect } from 'react';
import { useBankData } from './useBankData';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { VirtualCard as VirtualCardType } from '@/types/auth';

export const useVirtualCard = () => {
  const { toast } = useToast();
  const { fetchBankAccounts } = useBankData();
  const [cards, setCards] = useState<VirtualCardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingCreate, setProcessingCreate] = useState(false);
  const [processingTopUp, setProcessingTopUp] = useState(false);
  const [processingDeactivate, setProcessingDeactivate] = useState(false);

  const fetchVirtualCards = async () => {
    try {
      setLoading(true);
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('virtual_cards')
        .select('*')
        .eq('user_id', user.user.id);

      if (error) {
        throw error;
      }

      setCards(data || []);
    } catch (error) {
      console.error('Error fetching virtual cards:', error);
      toast({
        title: 'Error fetching cards',
        description: 'Could not retrieve your virtual cards. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createVirtualCard = async (initialBalance = 1000) => {
    try {
      setProcessingCreate(true);
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user) {
        throw new Error('User not authenticated');
      }

      // Generate a random card number (this is just for demo purposes - in production, this would be handled securely on the backend)
      const cardNumber = `4500 ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}`;
      const expiry = new Date();
      expiry.setFullYear(expiry.getFullYear() + 3); // 3 years validity
      const expiryDate = `${String(expiry.getMonth() + 1).padStart(2, '0')}/${String(expiry.getFullYear()).slice(-2)}`;
      const cvv = `${Math.floor(100 + Math.random() * 900)}`; // 3-digit CVV

      // Get user's full name for the card
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.user.id)
        .single();

      const { data, error } = await supabase
        .from('virtual_cards')
        .insert([
          {
            user_id: user.user.id,
            card_number: cardNumber,
            expiration: expiryDate,
            cvv: cvv,
            balance: initialBalance,
            is_active: true
          }
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Also create a transaction for this creation
      await supabase.rpc('create_transaction', {
        p_user_id: user.user.id,
        p_account_id: data.id, // Using card ID as account ID for reference
        p_transaction_type: 'virtual_card_create',
        p_amount: initialBalance,
        p_description: 'Virtual card creation'
      });

      toast({
        title: 'Virtual card created',
        description: `Your new virtual card has been created with $${initialBalance} balance.`
      });

      await fetchVirtualCards();
      return data;
    } catch (error) {
      console.error('Error creating virtual card:', error);
      toast({
        title: 'Card creation failed',
        description: 'Could not create virtual card. Please try again.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setProcessingCreate(false);
    }
  };

  const topUpVirtualCard = async (cardId: string, amount: number, sourceAccountId: string) => {
    try {
      setProcessingTopUp(true);
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user) {
        throw new Error('User not authenticated');
      }

      // First withdraw from bank account
      await supabase.rpc('create_transaction', {
        p_user_id: user.user.id,
        p_account_id: sourceAccountId,
        p_transaction_type: 'virtual_card_topup',
        p_amount: amount,
        p_description: `Top up virtual card ending in ${cardId.slice(-4)}`
      });

      // Then add to virtual card
      const { data: cardData } = await supabase
        .from('virtual_cards')
        .select('balance')
        .eq('id', cardId)
        .eq('user_id', user.user.id)
        .single();

      const newBalance = (cardData?.balance || 0) + amount;

      const { data, error } = await supabase
        .from('virtual_cards')
        .update({ balance: newBalance })
        .eq('id', cardId)
        .eq('user_id', user.user.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast({
        title: 'Card topped up',
        description: `Your virtual card has been topped up with $${amount}.`
      });

      await fetchVirtualCards();
      return data;
    } catch (error) {
      console.error('Error topping up virtual card:', error);
      toast({
        title: 'Top up failed',
        description: 'Could not top up your virtual card. Please try again.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setProcessingTopUp(false);
    }
  };

  const deactivateVirtualCard = async (cardId: string) => {
    try {
      setProcessingDeactivate(true);
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('virtual_cards')
        .update({ is_active: false })
        .eq('id', cardId)
        .eq('user_id', user.user.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast({
        title: 'Card deactivated',
        description: 'Your virtual card has been deactivated successfully.'
      });

      await fetchVirtualCards();
      return data;
    } catch (error) {
      console.error('Error deactivating virtual card:', error);
      toast({
        title: 'Deactivation failed',
        description: 'Could not deactivate your virtual card. Please try again.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setProcessingDeactivate(false);
    }
  };

  // Fetch virtual cards on mount
  useEffect(() => {
    fetchVirtualCards();
  }, []);

  return {
    cards,
    loading,
    processingCreate,
    processingTopUp,
    processingDeactivate,
    createVirtualCard,
    topUpVirtualCard,
    deactivateVirtualCard
  };
};
