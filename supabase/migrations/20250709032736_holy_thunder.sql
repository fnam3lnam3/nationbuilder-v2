/*
  # Fix RLS policy for saved_nations soft delete

  1. Policy Updates
    - Update the existing UPDATE policy to properly handle soft deletes
    - Ensure users can update their own records including setting deleted_at
    - Fix the WITH CHECK expression to allow soft delete operations

  2. Security
    - Maintain security by ensuring users can only update their own records
    - Allow setting deleted_at field for soft delete functionality
*/

-- Drop the existing UPDATE policy
DROP POLICY IF EXISTS "Users can update their own nations" ON saved_nations;

-- Create a new UPDATE policy that properly handles soft deletes
CREATE POLICY "Users can update their own nations"
  ON saved_nations
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Also ensure the DELETE policy exists for hard deletes if needed
DROP POLICY IF EXISTS "Users can delete their own nations" ON saved_nations;

CREATE POLICY "Users can delete their own nations"
  ON saved_nations
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());