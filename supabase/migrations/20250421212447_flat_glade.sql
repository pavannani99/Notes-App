/*
  # Create notes table schema

  1. New Tables
    - `notes`
      - `id` (uuid, primary key)
      - `created_at` (timestamp with time zone)
      - `updated_at` (timestamp with time zone)
      - `title` (text, not null)
      - `content` (text, not null)
      - `summary` (text, nullable)
      - `user_id` (uuid, foreign key to auth.users)
  
  2. Security
    - Enable RLS on `notes` table
    - Add policies for authenticated users to:
      - Select their own notes
      - Insert their own notes
      - Update their own notes
      - Delete their own notes
*/

-- Create the notes table
CREATE TABLE IF NOT EXISTS notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  title text NOT NULL,
  content text NOT NULL,
  summary text,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL
);

-- Enable row level security
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Create a function to set updated_at on update
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to set updated_at on update
CREATE TRIGGER set_notes_updated_at
BEFORE UPDATE ON notes
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- Create RLS policies
-- Allow users to select their own notes
CREATE POLICY "Users can view their own notes" 
  ON notes
  FOR SELECT 
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow users to insert their own notes
CREATE POLICY "Users can insert their own notes" 
  ON notes
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own notes
CREATE POLICY "Users can update their own notes" 
  ON notes
  FOR UPDATE 
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow users to delete their own notes
CREATE POLICY "Users can delete their own notes" 
  ON notes
  FOR DELETE 
  TO authenticated
  USING (auth.uid() = user_id);