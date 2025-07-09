/*
  # Create public profiles table for leaderboard usernames

  1. New Tables
    - `public_profiles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `username` (text, unique)
      - `display_name` (text)
      - `is_leaderboard_visible` (boolean, default false)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `public_profiles` table
    - Add policy for users to manage their own profile
    - Add policy for public read access to leaderboard-visible profiles

  3. Functions
    - Function to get username for leaderboard display
    - Function to toggle leaderboard visibility
*/

-- Create public_profiles table
CREATE TABLE IF NOT EXISTS public_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  display_name text,
  is_leaderboard_visible boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public_profiles ENABLE ROW LEVEL SECURITY;

-- Policies for public_profiles
CREATE POLICY "Users can manage their own profile"
  ON public_profiles
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Public read access to leaderboard-visible profiles"
  ON public_profiles
  FOR SELECT
  TO anon, authenticated
  USING (is_leaderboard_visible = true);

-- Function to get username for leaderboard (returns 'Anonymous' if not visible)
CREATE OR REPLACE FUNCTION get_leaderboard_username(p_user_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result_username text;
BEGIN
  SELECT 
    CASE 
      WHEN is_leaderboard_visible THEN COALESCE(display_name, username)
      ELSE 'Anonymous'
    END
  INTO result_username
  FROM public_profiles
  WHERE user_id = p_user_id;
  
  RETURN COALESCE(result_username, 'Anonymous');
END;
$$;

-- Function to toggle leaderboard visibility for a user
CREATE OR REPLACE FUNCTION toggle_leaderboard_visibility(p_nation_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  nation_user_id uuid;
  current_visibility boolean;
  profile_exists boolean;
BEGIN
  -- Get the user_id from the nation
  SELECT user_id INTO nation_user_id
  FROM saved_nations
  WHERE id = p_nation_id AND user_id = auth.uid() AND deleted_at IS NULL;
  
  IF nation_user_id IS NULL THEN
    RETURN false; -- Nation not found or not owned by user
  END IF;
  
  -- Check if profile exists
  SELECT is_leaderboard_visible, true INTO current_visibility, profile_exists
  FROM public_profiles
  WHERE user_id = nation_user_id;
  
  IF NOT profile_exists THEN
    -- Create profile if it doesn't exist
    INSERT INTO public_profiles (user_id, username, is_leaderboard_visible)
    VALUES (
      nation_user_id,
      COALESCE(
        (SELECT raw_user_meta_data->>'username' FROM auth.users WHERE id = nation_user_id),
        'User' || substr(nation_user_id::text, 1, 8)
      ),
      true
    );
    RETURN true;
  ELSE
    -- Toggle visibility
    UPDATE public_profiles
    SET 
      is_leaderboard_visible = NOT current_visibility,
      updated_at = now()
    WHERE user_id = nation_user_id;
    
    RETURN NOT current_visibility;
  END IF;
END;
$$;

-- Function to create profile on user signup (to be called by trigger or manually)
CREATE OR REPLACE FUNCTION create_public_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public_profiles (user_id, username)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'username',
      'User' || substr(NEW.id::text, 1, 8)
    )
  );
  RETURN NEW;
END;
$$;

-- Create trigger to auto-create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_public_profile();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_public_profiles_user_id ON public_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_public_profiles_leaderboard_visible ON public_profiles(is_leaderboard_visible) WHERE is_leaderboard_visible = true;
CREATE INDEX IF NOT EXISTS idx_public_profiles_username ON public_profiles(username);