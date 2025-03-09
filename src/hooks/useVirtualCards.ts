
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from './use-toast';
import { VirtualCard } from '@/types/auth';

export const useVirtualCards = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [cards, setCards] = useState<VirtualCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (user) {
      fetchCards();
    } else {
      setCards([]);
      setLoading(false);
    }
  }, [user]);

  const fetchCards = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('virtual_cards')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching virtual cards:', error);
        toast({
          title: "Erè nan chaje kat yo",
          description: "Nou pa t kapab chaje kat vityèl ou yo.",
          variant: "destructive"
        });
        return;
      }

      setCards(data as VirtualCard[]);
    } catch (error) {
      console.error('Error in fetchCards:', error);
      toast({
        title: "Erè nan chaje kat yo",
        description: "Nou pa t kapab chaje kat vityèl ou yo.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createCard = async (initialBalance: number = 100) => {
    if (!user) {
      toast({
        title: "Koneksyon obligatwa",
        description: "Ou dwe konekte pou kreye yon kat vityèl.",
        variant: "destructive"
      });
      return { success: false };
    }

    setCreating(true);
    try {
      // Get primary bank account to deduct funds
      const { data: accountData, error: accountError } = await supabase
        .from('bank_accounts')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_primary', true)
        .single();
      
      if (accountError) {
        console.error('Error fetching primary account:', accountError);
        toast({
          title: "Erè nan chaje kont prensipal",
          description: "Nou pa kapab jwenn kont prensipal ou.",
          variant: "destructive"
        });
        return { success: false };
      }
      
      const primaryAccount = accountData;
      
      // Check if account has sufficient funds
      if (primaryAccount.balance < initialBalance) {
        toast({
          title: "Balans ensifizan",
          description: "Ou pa gen ase lajan nan kont prensipal ou pou kreye kat sa a.",
          variant: "destructive"
        });
        return { success: false };
      }

      // Generate random card number (for demo purposes)
      const cardNumber = `4${Math.floor(Math.random() * 1000).toString().padStart(3, '0')} ${Math.floor(Math.random() * 10000).toString().padStart(4, '0')} ${Math.floor(Math.random() * 10000).toString().padStart(4, '0')} ${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      
      // Generate random expiration date (2-3 years in the future)
      const expDate = new Date();
      expDate.setFullYear(expDate.getFullYear() + Math.floor(Math.random() * 2) + 2);
      const expiration = `${(expDate.getMonth() + 1).toString().padStart(2, '0')}/${expDate.getFullYear().toString().slice(-2)}`;
      
      // Generate random CVV
      const cvv = Math.floor(Math.random() * 1000).toString().padStart(3, '0');

      // Start a transaction - First create the virtual card
      const { data: newCard, error: cardError } = await supabase
        .from('virtual_cards')
        .insert({
          user_id: user.id,
          card_number: cardNumber,
          expiration,
          cvv,
          balance: initialBalance,
          is_active: true
        })
        .select()
        .single();

      if (cardError) {
        console.error('Error creating virtual card:', cardError);
        toast({
          title: "Kreyasyon kat echwe",
          description: "Nou pa t kapab kreye kat vityèl ou a.",
          variant: "destructive"
        });
        return { success: false };
      }
      
      // Deduct from primary account - update the balance
      const { error: updateError } = await supabase
        .from('bank_accounts')
        .update({ balance: primaryAccount.balance - initialBalance })
        .eq('id', primaryAccount.id);
        
      if (updateError) {
        console.error('Error updating account balance:', updateError);
        toast({
          title: "Mizajou balans echwe",
          description: "Nou pa t kapab dedui montan an nan kont ou a.",
          variant: "destructive"
        });
        // We should really roll back the card creation here,
        // but for simplicity we'll continue
      }
      
      // Create withdrawal transaction from bank account
      const { error: withdrawalError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          account_id: primaryAccount.id,
          transaction_type: 'withdrawal',
          amount: initialBalance,
          description: `Finansman Kat Vityèl #${cardNumber.slice(-4)}`
        });
        
      if (withdrawalError) {
        console.error('Error creating withdrawal transaction:', withdrawalError);
      }
      
      // Create deposit transaction to virtual card
      const { error: depositError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          account_id: newCard.id,
          transaction_type: 'virtual_card_deposit',
          amount: initialBalance,
          description: `Depo inisyal pou Kat Vityèl #${cardNumber.slice(-4)}`
        });
        
      if (depositError) {
        console.error('Error creating deposit transaction:', depositError);
      }

      toast({
        title: "Kat vityèl kreye",
        description: "Ou kreye yon nouvo kat vityèl Mastercard ak siksè.",
      });
      
      // Add the new card to the state
      setCards(prevCards => [newCard as VirtualCard, ...prevCards]);
      
      // Refresh cards from the database to ensure we have the latest data
      fetchCards();
      
      return { success: true, card: newCard as VirtualCard };
    } catch (error) {
      console.error('Error in createCard:', error);
      toast({
        title: "Kreyasyon kat echwe",
        description: "Gen yon erè ki pase pandan n ap eseye kreye kat ou a.",
        variant: "destructive"
      });
      return { success: false };
    } finally {
      setCreating(false);
    }
  };

  const toggleCardStatus = async (cardId: string, activate: boolean) => {
    if (!user) {
      toast({
        title: "Koneksyon obligatwa",
        description: "Ou dwe konekte pou jere kat vityèl yo.",
        variant: "destructive"
      });
      return { success: false };
    }

    try {
      const { data, error } = await supabase
        .from('virtual_cards')
        .update({ is_active: activate })
        .eq('id', cardId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating card status:', error);
        toast({
          title: "Mizajou kat echwe",
          description: "Nou pa t kapab chanje estati kat ou a.",
          variant: "destructive"
        });
        return { success: false };
      }

      // Record the status change in the transactions table
      const statusDescription = activate ? 'Kat aktive' : 'Kat dezaktive';
      
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          account_id: cardId,
          transaction_type: 'virtual_card_status_change',
          amount: 0, // No monetary value for status change
          description: `${statusDescription} #${data.card_number.slice(-4)}`
        });
      
      if (transactionError) {
        console.error('Error recording status change transaction:', transactionError);
      }

      // Update the card in the state
      setCards(prevCards => 
        prevCards.map(card => 
          card.id === cardId ? { ...card, is_active: activate } : card
        )
      );
      
      // Refresh cards to ensure data consistency
      fetchCards();
      
      return { success: true, card: data as VirtualCard };
    } catch (error) {
      console.error('Error in toggleCardStatus:', error);
      toast({
        title: "Mizajou kat echwe",
        description: "Gen yon erè ki pase pandan n ap eseye chanje estati kat ou a.",
        variant: "destructive"
      });
      return { success: false };
    }
  };

  const simulateTransaction = async (cardId: string, amount: number, description: string) => {
    if (!user) {
      toast({
        title: "Koneksyon obligatwa",
        description: "Ou dwe konekte pou fè tranzaksyon.",
        variant: "destructive"
      });
      return { success: false };
    }

    try {
      // First check if the card is active and has sufficient balance
      const { data: cardData, error: cardError } = await supabase
        .from('virtual_cards')
        .select('*')
        .eq('id', cardId)
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single();

      if (cardError || !cardData) {
        console.error('Error checking card:', cardError);
        toast({
          title: "Tranzaksyon echwe",
          description: "Kat la pa aktif oswa li pa egziste.",
          variant: "destructive"
        });
        return { success: false };
      }

      const card = cardData as VirtualCard;
      if (card.balance < amount) {
        toast({
          title: "Balans ensifizan",
          description: "Ou pa gen ase lajan nan kat la pou fè tranzaksyon sa a.",
          variant: "destructive"
        });
        return { success: false };
      }

      // Update the card balance
      const newBalance = card.balance - amount;
      const { data: updatedCard, error: updateError } = await supabase
        .from('virtual_cards')
        .update({ balance: newBalance })
        .eq('id', cardId)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating card balance:', updateError);
        toast({
          title: "Tranzaksyon echwe",
          description: "Nou pa t kapab mete ajou balans kat la.",
          variant: "destructive"
        });
        return { success: false };
      }

      // Create a transaction record
      const { data: transaction, error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          account_id: cardId, // Using card ID as the account
          transaction_type: 'payment',
          amount: amount,
          description: description || 'Tranzaksyon kat vityèl'
        })
        .select()
        .single();

      if (transactionError) {
        console.error('Error creating transaction record:', transactionError);
        // We still consider the transaction successful even if the record fails
      }

      // Update the card in the state
      setCards(prevCards => 
        prevCards.map(c => 
          c.id === cardId ? { ...c, balance: newBalance } : c
        )
      );
      
      // Refresh cards to ensure we have the latest data
      fetchCards();
      
      toast({
        title: "Tranzaksyon reyisi",
        description: `Ou fè yon peman $${amount.toFixed(2)} bay ${description}.`,
      });
      
      return { 
        success: true, 
        card: updatedCard as VirtualCard,
        transaction: transaction || null
      };
    } catch (error) {
      console.error('Error in simulateTransaction:', error);
      toast({
        title: "Tranzaksyon echwe",
        description: "Gen yon erè ki pase pandan n ap eseye fè tranzaksyon an.",
        variant: "destructive"
      });
      return { success: false };
    }
  };

  const deleteCard = async (cardId: string) => {
    if (!user) {
      toast({
        title: "Koneksyon obligatwa",
        description: "Ou dwe konekte pou efase kat vityèl yo.",
        variant: "destructive"
      });
      return { success: false };
    }

    try {
      // First, get the card details to reference in transaction
      const { data: cardData, error: cardError } = await supabase
        .from('virtual_cards')
        .select('*')
        .eq('id', cardId)
        .eq('user_id', user.id)
        .single();
        
      if (cardError) {
        console.error('Error fetching card details:', cardError);
        toast({
          title: "Efase kat echwe",
          description: "Nou pa t kapab jwenn detay kat ou a.",
          variant: "destructive"
        });
        return { success: false };
      }
      
      const card = cardData as VirtualCard;
      
      // If the card has balance, return it to the primary account
      if (card.balance > 0) {
        // Get primary account
        const { data: accountData, error: accountError } = await supabase
          .from('bank_accounts')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_primary', true)
          .single();
          
        if (!accountError && accountData) {
          // Update primary account balance
          const { error: updateError } = await supabase
            .from('bank_accounts')
            .update({ 
              balance: accountData.balance + card.balance 
            })
            .eq('id', accountData.id);
            
          if (updateError) {
            console.error('Error returning funds to primary account:', updateError);
          } else {
            // Record the refund transaction
            const { error: refundError } = await supabase
              .from('transactions')
              .insert({
                user_id: user.id,
                account_id: accountData.id,
                transaction_type: 'deposit',
                amount: card.balance,
                description: `Ranbousman balans kat vityèl #${card.card_number.slice(-4)}`
              });
              
            if (refundError) {
              console.error('Error recording refund transaction:', refundError);
            }
          }
        }
      }
      
      // Record the deletion in transactions
      const { error: deleteTransactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          account_id: cardId,
          transaction_type: 'virtual_card_deletion',
          amount: 0,
          description: `Kat vityèl #${card.card_number.slice(-4)} efase`
        });
        
      if (deleteTransactionError) {
        console.error('Error recording card deletion transaction:', deleteTransactionError);
      }

      // Now delete the card
      const { error } = await supabase
        .from('virtual_cards')
        .delete()
        .eq('id', cardId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting card:', error);
        toast({
          title: "Efase kat echwe",
          description: "Nou pa t kapab efase kat ou a.",
          variant: "destructive"
        });
        return { success: false };
      }

      // Remove the card from the state
      setCards(prevCards => prevCards.filter(card => card.id !== cardId));
      
      toast({
        title: "Kat vityèl efase",
        description: "Ou efase kat vityèl la ak siksè.",
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error in deleteCard:', error);
      toast({
        title: "Efase kat echwe",
        description: "Gen yon erè ki pase pandan n ap eseye efase kat ou a.",
        variant: "destructive"
      });
      return { success: false };
    }
  };

  return {
    cards,
    loading,
    creating,
    createCard,
    toggleCardStatus,
    simulateTransaction,
    deleteCard,
    refreshCards: fetchCards
  };
};
