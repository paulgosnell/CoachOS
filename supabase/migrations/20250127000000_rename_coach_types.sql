-- Rename legacy coach types in profiles.coach_preference
-- 'standard' -> 'business'
-- 'adhd' -> 'adhd-business'

-- Update profiles where coach_type is 'standard'
UPDATE profiles
SET coach_preference = jsonb_set(
  coach_preference,
  '{coach_type}',
  '"business"'::jsonb
)
WHERE coach_preference->>'coach_type' = 'standard';

-- Update profiles where coach_type is 'adhd'
UPDATE profiles
SET coach_preference = jsonb_set(
  coach_preference,
  '{coach_type}',
  '"adhd-business"'::jsonb
)
WHERE coach_preference->>'coach_type' = 'adhd';
