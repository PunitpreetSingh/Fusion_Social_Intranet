/*
  # Update User Roles to Include Admin

  1. Changes
    - Drop existing role check constraint
    - Add new constraint allowing 'internal', 'external', and 'admin' roles
*/

-- Drop existing constraint
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;

-- Add new constraint with admin role
ALTER TABLE users ADD CONSTRAINT users_role_check 
  CHECK (role IN ('internal', 'external', 'admin'));