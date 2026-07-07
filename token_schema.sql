-- ============================================
-- Token Schema for AIOMS Account & Billing Portal
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Subscription tokens table
CREATE TABLE IF NOT EXISTS public.subscription_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token_code text NOT NULL UNIQUE,
  duration_days integer NOT NULL DEFAULT 30,
  is_used boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT NOW()
);

ALTER TABLE public.subscription_tokens ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own tokens via user_id link from profiles
CREATE POLICY "Users can view own tokens"
  ON public.subscription_tokens FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = subscription_tokens.user_id
      AND profiles.email = auth.email()
    )
  );

-- 2. Add user_id column to associate tokens with users
--    (run AFTER profiles table exists)
ALTER TABLE public.subscription_tokens
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- 3. Update handle_new_user trigger function
--    Generates a FREE-30D-XXXXXX token code on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  free_token_code text;
BEGIN
  -- Generate unique free token code: FREE-30D-<6 random chars>
  free_token_code := 'FREE-30D-' || upper(substr(md5(NEW.id::text || NOW()::text), 1, 6));

  -- Insert profile row with 30-day expiry
  INSERT INTO public.profiles (id, shop_name, email, token_balance, token_expiry)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'shop_name',
    NEW.email,
    1,
    NOW() + INTERVAL '30 days'
  );

  -- Insert welcome token (not yet redeemed — user must redeem it)
  INSERT INTO public.subscription_tokens (user_id, token_code, duration_days, is_used)
  VALUES (NEW.id, free_token_code, 30, false);

  RETURN NEW;
END;
$$;

-- 4. Re-attach trigger (safe to re-run)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
