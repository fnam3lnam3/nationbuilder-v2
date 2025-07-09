/*
  # Saved Nations System

  1. New Tables
    - `saved_nations`: Core table for storing nation assessments
      - Supports both temporary (session-based) and permanent (user-linked) storage
      - Includes assessment data, custom policies, and metadata
      - Implements soft delete and automatic cleanup

    - `assessment_sessions`: Tracks temporary assessment sessions
      - Links to saved_nations for temporary storage
      - Includes session expiration and cleanup mechanisms
      - Allows linking to users when they log in

  2. Security
    - Enable RLS on all tables
    - Policies for users to access their own nations
    - Policies for temporary session access
    - Automatic cleanup of expired sessions

  3. Functions
    - Cleanup function for expired sessions
    - Function to link temporary nations to users
*/

-- Create saved_nations table
CREATE TABLE IF NOT EXISTS saved_nations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  user_id uuid REFERENCES auth.users(id) DEFAULT NULL,
  session_id text DEFAULT NULL,
  assessment_data jsonb NOT NULL,
  custom_policies jsonb DEFAULT '{}',
  is_temporary boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  expires_at timestamptz DEFAULT NULL,
  deleted_at timestamptz DEFAULT NULL
);

-- Create assessment_sessions table
CREATE TABLE IF NOT EXISTS assessment_sessions (
  id text PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz DEFAULT (now() + interval '24 hours'),
  user_id uuid REFERENCES auth.users(id) DEFAULT NULL,
  linked_at timestamptz DEFAULT NULL
);

-- Enable RLS
ALTER TABLE saved_nations ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_sessions ENABLE ROW LEVEL SECURITY;

-- Policies for saved_nations
CREATE POLICY "Users can view their own nations"
  ON saved_nations
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() AND deleted_at IS NULL);

CREATE POLICY "Users can insert their own nations"
  ON saved_nations
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own nations"
  ON saved_nations
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid() AND deleted_at IS NULL);

CREATE POLICY "Users can delete their own nations"
  ON saved_nations
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Policy for temporary nations (accessible by session_id)
CREATE POLICY "Temporary nations accessible by session"
  ON saved_nations
  FOR ALL
  TO anon, authenticated
  USING (
    is_temporary = true 
    AND session_id IS NOT NULL 
    AND expires_at > now() 
    AND deleted_at IS NULL
  );

-- Policies for assessment_sessions
CREATE POLICY "Sessions accessible by authenticated users"
  ON assessment_sessions
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Sessions accessible by session id"
  ON assessment_sessions
  FOR SELECT
  TO anon, authenticated
  USING (expires_at > now());

-- Function to cleanup expired sessions and temporary nations
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete expired temporary nations
  DELETE FROM saved_nations 
  WHERE is_temporary = true 
    AND expires_at < now();
  
  -- Delete expired sessions
  DELETE FROM assessment_sessions 
  WHERE expires_at < now();
END;
$$;

-- Function to link temporary nation to user
CREATE OR REPLACE FUNCTION link_temporary_nation_to_user(
  p_session_id text,
  p_user_id uuid
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  nation_count integer;
BEGIN
  -- Update the temporary nation to be permanent
  UPDATE saved_nations 
  SET 
    user_id = p_user_id,
    is_temporary = false,
    expires_at = NULL,
    session_id = NULL,
    updated_at = now()
  WHERE session_id = p_session_id 
    AND is_temporary = true 
    AND expires_at > now()
    AND deleted_at IS NULL;
  
  -- Update the session
  UPDATE assessment_sessions 
  SET 
    user_id = p_user_id,
    linked_at = now()
  WHERE id = p_session_id;
  
  RETURN FOUND;
END;
$$;

-- Function to create temporary nation
CREATE OR REPLACE FUNCTION create_temporary_nation(
  p_session_id text,
  p_name text,
  p_assessment_data jsonb,
  p_custom_policies jsonb DEFAULT '{}'
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  nation_id uuid;
BEGIN
  -- Ensure session exists
  INSERT INTO assessment_sessions (id)
  VALUES (p_session_id)
  ON CONFLICT (id) DO NOTHING;
  
  -- Create temporary nation
  INSERT INTO saved_nations (
    name,
    session_id,
    assessment_data,
    custom_policies,
    is_temporary,
    expires_at
  )
  VALUES (
    p_name,
    p_session_id,
    p_assessment_data,
    p_custom_policies,
    true,
    now() + interval '24 hours'
  )
  RETURNING id INTO nation_id;
  
  RETURN nation_id;
END;
$$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_saved_nations_user_id ON saved_nations(user_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_saved_nations_session_id ON saved_nations(session_id) WHERE is_temporary = true;
CREATE INDEX IF NOT EXISTS idx_saved_nations_expires_at ON saved_nations(expires_at) WHERE is_temporary = true;
CREATE INDEX IF NOT EXISTS idx_assessment_sessions_expires_at ON assessment_sessions(expires_at);

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION cleanup_expired_sessions() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION link_temporary_nation_to_user(text, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION create_temporary_nation(text, text, jsonb, jsonb) TO authenticated, anon;