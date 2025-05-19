
CREATE OR REPLACE FUNCTION public.get_referral_stats(user_id UUID)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'total_referrals', (
      SELECT count(*) 
      FROM referral_invites 
      WHERE referrer_id = user_id
    ),
    'pending_referrals', (
      SELECT count(*) 
      FROM referral_invites 
      WHERE referrer_id = user_id AND status = 'pending'
    ),
    'completed_referrals', (
      SELECT count(*) 
      FROM referrals 
      WHERE referrer_id = user_id AND status = 'completed'
    ),
    'successful_conversions', (
      SELECT count(*) 
      FROM referrals 
      WHERE referrer_id = user_id AND discount_applied = true
    )
  ) INTO result;
  
  RETURN result;
END;
$$;
