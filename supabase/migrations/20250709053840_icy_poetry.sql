/*
  # Add foreign key relationship for leaderboard queries

  1. Changes
    - Add foreign key constraint between saved_nations.user_id and public_profiles.user_id
    - This enables Supabase to understand the relationship for JOIN queries in the leaderboard

  2. Security
    - No changes to existing RLS policies
    - Maintains existing data integrity
*/

-- Add foreign key constraint to enable Supabase to understand the relationship
-- between saved_nations and public_profiles through their user_id columns
ALTER TABLE saved_nations 
ADD CONSTRAINT fk_saved_nations_public_profiles 
FOREIGN KEY (user_id) 
REFERENCES public_profiles (user_id);