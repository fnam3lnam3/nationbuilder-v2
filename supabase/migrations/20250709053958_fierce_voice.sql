/*
  # Fix leaderboard relationship by creating missing profiles and adding foreign key

  1. Create missing public_profiles records for users who have saved_nations but no profile
  2. Add foreign key constraint between saved_nations and public_profiles
  3. This enables Supabase to understand the relationship for JOIN queries in leaderboards

  Note: This migration ensures data integrity by creating profiles for existing users
  before adding the foreign key constraint.
*/

-- First, create missing public_profiles records for users who have saved_nations
-- but don't have a corresponding profile entry
INSERT INTO public_profiles (user_id, username, display_name, is_leaderboard_visible)
SELECT DISTINCT 
  sn.user_id,
  COALESCE(u.raw_user_meta_data->>'username', split_part(u.email, '@', 1), 'User') as username,
  COALESCE(u.raw_user_meta_data->>'username', split_part(u.email, '@', 1), 'User') as display_name,
  false as is_leaderboard_visible
FROM saved_nations sn
JOIN auth.users u ON sn.user_id = u.id
LEFT JOIN public_profiles pp ON sn.user_id = pp.user_id
WHERE pp.user_id IS NULL
  AND sn.user_id IS NOT NULL
  AND sn.deleted_at IS NULL;

-- Now add the foreign key constraint to enable Supabase relationship understanding
ALTER TABLE saved_nations 
ADD CONSTRAINT fk_saved_nations_public_profiles 
FOREIGN KEY (user_id) 
REFERENCES public_profiles (user_id);