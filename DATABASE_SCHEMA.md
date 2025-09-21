# Database Schema for User-Specific Data Isolation

## Overview

This document outlines the required database schema for implementing user-specific data isolation in MediSync. The schema ensures that each user only sees their own data by using `user_id` foreign keys and Row Level Security (RLS) policies.

## Required Tables

### 1. user_reports
Stores medical reports uploaded by users.

```sql
CREATE TABLE user_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL, -- 'PDF', 'Image', etc.
  date TIMESTAMPTZ NOT NULL,
  doctor TEXT,
  facility TEXT,
  notes TEXT,
  file_url TEXT,
  extracted_text TEXT, -- Raw text extracted from file
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED')),
  medical_data JSONB, -- AI analysis results with structured data
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for efficient user queries
CREATE INDEX idx_user_reports_user_id ON user_reports(user_id);
CREATE INDEX idx_user_reports_status ON user_reports(status);
CREATE INDEX idx_user_reports_created_at ON user_reports(created_at DESC);

-- Row Level Security
ALTER TABLE user_reports ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own reports
CREATE POLICY "Users can view own reports" ON user_reports
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can only insert their own reports
CREATE POLICY "Users can insert own reports" ON user_reports
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only update their own reports
CREATE POLICY "Users can update own reports" ON user_reports
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Users can only delete their own reports
CREATE POLICY "Users can delete own reports" ON user_reports
  FOR DELETE USING (auth.uid() = user_id);
```

### 2. user_reminders
Stores health reminders and tasks for users.

```sql
CREATE TABLE user_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  time TEXT NOT NULL, -- e.g., "8:00 AM", "May 15"
  color TEXT NOT NULL DEFAULT 'bg-blue-500',
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for efficient user queries
CREATE INDEX idx_user_reminders_user_id ON user_reminders(user_id);
CREATE INDEX idx_user_reminders_completed ON user_reminders(completed);

-- Row Level Security
ALTER TABLE user_reminders ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own reminders
CREATE POLICY "Users can view own reminders" ON user_reminders
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can only insert their own reminders
CREATE POLICY "Users can insert own reminders" ON user_reminders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only update their own reminders
CREATE POLICY "Users can update own reminders" ON user_reminders
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Users can only delete their own reminders
CREATE POLICY "Users can delete own reminders" ON user_reminders
  FOR DELETE USING (auth.uid() = user_id);
```

### 3. user_profiles (Optional Enhancement)
Extended user profile information.

```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  date_of_birth DATE,
  language TEXT DEFAULT 'en',
  timezone TEXT DEFAULT 'UTC',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for efficient user queries
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);

-- Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can only insert their own profile
CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only update their own profile
CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);
```

## Setup Instructions

### 1. Create Tables in Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Run the SQL commands above to create the tables
4. Verify that RLS policies are enabled

### 2. Verify Row Level Security

```sql
-- Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('user_reports', 'user_reminders', 'user_profiles');

-- Should show rowsecurity = true for all tables
```

### 3. Test User Isolation

```sql
-- Test as a specific user (replace with actual user ID)
SET LOCAL "request.jwt.claim.sub" TO 'your-user-id-here';

-- Should only return reports for that user
SELECT * FROM user_reports;
SELECT * FROM user_reminders;
```

## Data Migration (If Needed)

If you have existing data that needs to be migrated:

```sql
-- Example: Migrate existing reports to user-specific table
INSERT INTO user_reports (user_id, title, type, date, status, created_at)
SELECT 
  'default-user-id', -- Replace with actual user ID
  'Legacy Report',
  'PDF',
  NOW(),
  'COMPLETED',
  NOW()
FROM existing_reports_table;
```

## Security Considerations

1. **Row Level Security**: All tables have RLS enabled to ensure data isolation
2. **Foreign Key Constraints**: Proper relationships with cascade deletes
3. **Authentication**: All policies use `auth.uid()` to verify user identity
4. **Indexes**: Optimized for common query patterns
5. **Data Types**: Appropriate types for different data fields

## API Integration

The frontend data services in `src/lib/data-services.ts` are designed to work with this schema:

- All queries automatically filter by `user_id`
- Error handling for unauthorized access
- Type-safe interfaces matching the database schema
- React Query integration for caching and synchronization

## Testing User Isolation

1. **Create Test Users**: Sign up multiple test accounts
2. **Upload Different Data**: Each user uploads different reports
3. **Verify Isolation**: Ensure users only see their own data
4. **Test Permissions**: Verify users cannot access other users' data

This schema ensures complete data isolation between users while maintaining optimal performance and security.
