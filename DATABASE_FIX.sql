-- Fix for MediWiseHealth database schema
-- Add missing columns to user_reports table

-- Add extracted_text column if it doesn't exist
ALTER TABLE user_reports 
ADD COLUMN IF NOT EXISTS extracted_text TEXT;

-- Verify the table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'user_reports' 
ORDER BY ordinal_position;
