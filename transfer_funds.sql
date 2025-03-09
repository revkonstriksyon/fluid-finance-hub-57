
-- This SQL function must be executed separately, not part of the TypeScript codebase
CREATE OR REPLACE FUNCTION public.transfer_funds(
  p_sender_account_id UUID,
  p_receiver_id UUID,
  p_receiver_account_id UUID,
  p_amount NUMERIC,
  p_description TEXT,
  p_purpose TEXT DEFAULT 'transfer'
) RETURNS UUID AS $$
DECLARE
  v_sender_id UUID;
  v_receiver_account_id UUID;
  v_sent_transaction_id UUID;
  v_received_transaction_id UUID;
BEGIN
  -- Get sender's user ID
  SELECT user_id INTO v_sender_id
  FROM bank_accounts
  WHERE id = p_sender_account_id;
  
  IF v_sender_id IS NULL THEN
    RAISE EXCEPTION 'Invalid sender account';
  END IF;
  
  -- Check sufficient funds
  IF (SELECT balance FROM bank_accounts WHERE id = p_sender_account_id) < p_amount THEN
    RAISE EXCEPTION 'Insufficient funds';
  END IF;
  
  -- If receiver account ID not provided, try to find a primary account for the receiver
  IF p_receiver_account_id IS NULL AND p_receiver_id IS NOT NULL THEN
    SELECT id INTO v_receiver_account_id
    FROM bank_accounts
    WHERE user_id = p_receiver_id AND is_primary = true;
    
    IF v_receiver_account_id IS NULL THEN
      -- If no primary account, get any account
      SELECT id INTO v_receiver_account_id
      FROM bank_accounts
      WHERE user_id = p_receiver_id
      LIMIT 1;
    END IF;
    
    IF v_receiver_account_id IS NULL THEN
      RAISE EXCEPTION 'Recipient has no accounts';
    END IF;
  ELSE
    v_receiver_account_id := p_receiver_account_id;
  END IF;
  
  -- Create the "sent" transaction
  INSERT INTO transactions (
    user_id,
    account_id,
    transaction_type,
    amount,
    description,
    status
  ) VALUES (
    v_sender_id,
    p_sender_account_id,
    'transfer_sent',
    p_amount,
    p_description,
    'completed'
  )
  RETURNING id INTO v_sent_transaction_id;
  
  -- Deduct from sender's account
  UPDATE bank_accounts
  SET balance = balance - p_amount
  WHERE id = p_sender_account_id;

  -- If transferring to another user's account
  IF v_receiver_account_id IS NOT NULL THEN
    -- Create the "received" transaction
    INSERT INTO transactions (
      user_id,
      account_id,
      transaction_type,
      amount,
      description,
      status,
      reference_id
    ) VALUES (
      (SELECT user_id FROM bank_accounts WHERE id = v_receiver_account_id),
      v_receiver_account_id,
      'transfer_received',
      p_amount,
      'Transfè resevwa de ' || (SELECT email FROM auth.users WHERE id = v_sender_id),
      'completed',
      v_sent_transaction_id
    )
    RETURNING id INTO v_received_transaction_id;
    
    -- Add to receiver's account
    UPDATE bank_accounts
    SET balance = balance + p_amount
    WHERE id = v_receiver_account_id;
    
    -- Update the sent transaction with reference to received
    UPDATE transactions
    SET reference_id = v_received_transaction_id
    WHERE id = v_sent_transaction_id;
  END IF;
  
  -- Create a notification for the sender
  INSERT INTO notifications (
    user_id,
    message,
    type,
    read
  ) VALUES (
    v_sender_id,
    'Ou te voye $' || p_amount || ' - ' || p_description,
    'in-app',
    false
  );
  
  -- Create a notification for the receiver if applicable
  IF v_receiver_account_id IS NOT NULL THEN
    INSERT INTO notifications (
      user_id,
      message,
      type,
      read
    ) VALUES (
      (SELECT user_id FROM bank_accounts WHERE id = v_receiver_account_id),
      'Ou te resevwa $' || p_amount || ' de ' || (SELECT email FROM auth.users WHERE id = v_sender_id),
      'in-app',
      false
    );
  END IF;
  
  RETURN v_sent_transaction_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to finalize transactions (for payment gateway)
CREATE OR REPLACE FUNCTION public.finalize_transaction(
  p_transaction_id UUID,
  p_status TEXT
) RETURNS UUID AS $$
DECLARE
  v_transaction RECORD;
BEGIN
  -- Get the transaction
  SELECT * INTO v_transaction
  FROM transactions
  WHERE id = p_transaction_id;
  
  IF v_transaction IS NULL THEN
    RAISE EXCEPTION 'Transaction not found';
  END IF;
  
  -- Update transaction status
  UPDATE transactions
  SET status = p_status
  WHERE id = p_transaction_id;
  
  -- If completing a deposit or transfer_received, add to balance
  IF p_status = 'completed' AND v_transaction.transaction_type IN ('deposit', 'transfer_received') THEN
    UPDATE bank_accounts
    SET balance = balance + v_transaction.amount
    WHERE id = v_transaction.account_id;
  END IF;
  
  RETURN p_transaction_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create notifications table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('email', 'sms', 'in-app')),
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create policies for notifications
CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER TABLE public.notifications REPLICA IDENTITY FULL;
