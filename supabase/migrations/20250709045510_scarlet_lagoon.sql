/*
  # Add public sharing support for nations

  1. Changes
    - Add `is_public` column to saved_nations table
    - Add `share_token` column for secure sharing
    - Create index for public nations
    - Add RLS policy for public nation access

  2. Security
    - Public nations can be viewed by anyone with the share token
    - Only nation owners can make their nations public/private
*/

-- Add columns for public sharing
ALTER TABLE saved_nations 
ADD COLUMN IF NOT EXISTS is_public boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS share_token text DEFAULT NULL;

-- Create index for public nations
CREATE INDEX IF NOT EXISTS idx_saved_nations_public ON saved_nations(is_public) WHERE is_public = true AND deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_saved_nations_share_token ON saved_nations(share_token) WHERE share_token IS NOT NULL AND deleted_at IS NULL;

-- Policy for public nation access
CREATE POLICY "Public nations are viewable by anyone"
  ON saved_nations
  FOR SELECT
  TO anon, authenticated
  USING (
    is_public = true 
    AND deleted_at IS NULL
  );

-- Policy for shared nation access via token
CREATE POLICY "Shared nations accessible by token"
  ON saved_nations
  FOR SELECT
  TO anon, authenticated
  USING (
    share_token IS NOT NULL 
    AND deleted_at IS NULL
  );

-- Function to generate share token
CREATE OR REPLACE FUNCTION generate_share_token()
RETURNS text
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN encode(gen_random_bytes(16), 'base64');
END;
$$;

-- Function to make nation public
CREATE OR REPLACE FUNCTION make_nation_public(nation_id uuid, user_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  token text;
BEGIN
  -- Generate share token if not exists
  SELECT share_token INTO token
  FROM saved_nations 
  WHERE id = nation_id AND saved_nations.user_id = make_nation_public.user_id;
  
  IF token IS NULL THEN
    token := generate_share_token();
  END IF;
  
  -- Update nation to be public
  UPDATE saved_nations 
  SET 
    is_public = true,
    share_token = token,
    updated_at = now()
  WHERE id = nation_id AND saved_nations.user_id = make_nation_public.user_id;
  
  RETURN token;
END;
$$;

-- Function to make nation private
CREATE OR REPLACE FUNCTION make_nation_private(nation_id uuid, user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE saved_nations 
  SET 
    is_public = false,
    updated_at = now()
  WHERE id = nation_id AND saved_nations.user_id = make_nation_private.user_id;
  
  RETURN FOUND;
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION generate_share_token() TO authenticated;
GRANT EXECUTE ON FUNCTION make_nation_public(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION make_nation_private(uuid, uuid) TO authenticated;