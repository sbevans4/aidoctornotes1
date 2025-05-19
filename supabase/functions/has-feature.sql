
-- Create a function to check if a user has access to a specific feature based on their subscription tier
CREATE OR REPLACE FUNCTION public.has_feature(user_id UUID, feature_name TEXT) 
RETURNS BOOLEAN
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql AS $$
DECLARE
  user_tier subscription_tier;
  tier_level INT;
BEGIN
  -- Get the user's subscription tier
  SELECT sp.tier INTO user_tier
  FROM user_subscriptions us
  JOIN subscription_plans sp ON us.plan_id = sp.id
  WHERE us.user_id = $1
  AND us.status = 'active'
  LIMIT 1;

  -- If no active subscription is found, default to 'trial'
  IF user_tier IS NULL THEN
    user_tier := 'trial'::subscription_tier;
  END IF;
  
  -- Map subscription tier to a numeric level for easy comparison
  tier_level := CASE user_tier
    WHEN 'trial' THEN 1
    WHEN 'basic' THEN 2
    WHEN 'standard' THEN 3
    WHEN 'unlimited' THEN 4
    WHEN 'professional' THEN 5
    WHEN 'image_analysis' THEN 6
    WHEN 'enterprise' THEN 7
    ELSE 0
  END;

  -- Check feature access based on feature name and subscription tier level
  RETURN CASE feature_name
    -- Basic features (available to all tiers)
    WHEN 'soap_notes' THEN tier_level >= 1
    WHEN 'pdf_export' THEN tier_level >= 2
    
    -- Standard tier features
    WHEN 'unlimited_soap_notes' THEN tier_level >= 3
    WHEN 'code_suggestions' THEN tier_level >= 3
    WHEN 'ehr_format' THEN tier_level >= 3
    
    -- Unlimited tier features
    WHEN 'real_time_code_validation' THEN tier_level >= 4
    WHEN 'custom_templates' THEN tier_level >= 4
    WHEN 'limited_image_analysis' THEN tier_level >= 4
    
    -- Professional tier features
    WHEN 'ehr_integration' THEN tier_level >= 5
    WHEN 'team_accounts' THEN tier_level >= 5
    WHEN 'priority_processing' THEN tier_level >= 5
    WHEN 'searchable_code_db' THEN tier_level >= 5
    
    -- Image Analysis tier features
    WHEN 'unlimited_image_analysis' THEN tier_level >= 6
    WHEN 'image_interpretation' THEN tier_level >= 6
    WHEN 'specialist_templates' THEN tier_level >= 6
    
    -- Default: no access
    ELSE FALSE
  END;
END;
$$;
