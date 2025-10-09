-- Command Clipboard Database Setup
-- Run this in your Supabase SQL Editor

-- Create groups table
CREATE TABLE groups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  parent_id UUID REFERENCES groups(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create commands table
CREATE TABLE commands (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  command_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE commands ENABLE ROW LEVEL SECURITY;

-- Create policies for groups
CREATE POLICY "Users can view their own groups"
  ON groups FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own groups"
  ON groups FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own groups"
  ON groups FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own groups"
  ON groups FOR DELETE
  USING (auth.uid() = user_id);

-- Create policies for commands
CREATE POLICY "Users can view commands in their groups"
  ON commands FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM groups
    WHERE groups.id = commands.group_id
    AND groups.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert commands in their groups"
  ON commands FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM groups
    WHERE groups.id = commands.group_id
    AND groups.user_id = auth.uid()
  ));

CREATE POLICY "Users can update commands in their groups"
  ON commands FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM groups
    WHERE groups.id = commands.group_id
    AND groups.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete commands in their groups"
  ON commands FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM groups
    WHERE groups.id = commands.group_id
    AND groups.user_id = auth.uid()
  ));

-- Optional: Create indexes for better performance
CREATE INDEX idx_groups_user_id ON groups(user_id);
CREATE INDEX idx_groups_parent_id ON groups(parent_id);
CREATE INDEX idx_commands_group_id ON commands(group_id);
