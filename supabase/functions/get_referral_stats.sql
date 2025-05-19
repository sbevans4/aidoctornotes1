
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
    ),
    'earnings', (
      SELECT coalesce(sum(discount_percentage), 0)
      FROM referrals
      WHERE referrer_id = user_id AND status = 'completed'
    ),
    'recent_referrals', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'id', r.id,
          'status', r.status,
          'created_at', r.created_at,
          'email', i.email
        )
      )
      FROM referrals r
      JOIN referral_invites i ON i.referrer_id = r.referrer_id AND i.status = 'completed'
      WHERE r.referrer_id = user_id
      ORDER BY r.created_at DESC
      LIMIT 5
    )
  ) INTO result;
  
  RETURN result;
END;
$$;
