-- ============================================
-- AIOMS Complete Setup Migration
-- Run this once in Supabase SQL Editor
-- ============================================

-- 1. Add telegram_id for bot linking
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS telegram_id bigint UNIQUE;

-- 2. Create subscription_tokens table (safe to re-run)
CREATE TABLE IF NOT EXISTS public.subscription_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  token_code text NOT NULL UNIQUE,
  duration_days integer NOT NULL DEFAULT 30,
  is_used boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT NOW()
);

ALTER TABLE public.subscription_tokens ENABLE ROW LEVEL SECURITY;

-- 3. Updated trigger: auto-create profile + free token on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  free_token_code text;
BEGIN
  free_token_code := 'FREE-30D-' || upper(substr(md5(NEW.id::text || NOW()::text), 1, 6));
  INSERT INTO public.profiles (id, shop_name, email, token_balance, token_expiry)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'shop_name', NEW.email, 1, NOW() + INTERVAL '30 days');
  INSERT INTO public.subscription_tokens (user_id, token_code, duration_days, is_used)
  VALUES (NEW.id, free_token_code, 30, false);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 4. Backfill FREE-30D tokens for existing users
INSERT INTO public.subscription_tokens (user_id, token_code, duration_days, is_used)
SELECT
  p.id,
  'FREE-30D-' || upper(substr(md5(p.id::text || p.created_at::text), 1, 6)),
  30,
  false
FROM public.profiles p
LEFT JOIN public.subscription_tokens t ON t.user_id = p.id
WHERE t.id IS NULL
  AND p.id IS NOT NULL;
