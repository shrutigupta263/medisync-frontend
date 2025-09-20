# Supabase Authentication Setup Guide

## Overview

This guide explains how to set up Supabase authentication for the MediSync frontend application. The implementation includes user registration, login, logout, password reset, and protected routes.

## Prerequisites

1. **Supabase Account**: Create a free account at [supabase.com](https://supabase.com)
2. **Supabase Project**: Create a new project in your Supabase dashboard
3. **Environment Variables**: Configure the required environment variables

## Setup Steps

### 1. Supabase Project Configuration

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Copy the following values:
   - **Project URL** (will be used as `VITE_SUPABASE_URL`)
   - **anon public** key (will be used as `VITE_SUPABASE_ANON_KEY`)

### 2. Environment Variables

Create a `.env.local` file in the project root:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Important**: 
- Replace `your-project-id` with your actual Supabase project ID
- Replace `your-anon-key-here` with your actual anon key
- Never commit `.env.local` to version control
- The `.env.example` file is provided as a template

### 3. Authentication Features Implemented

#### ✅ User Registration
- Email and password signup
- Email confirmation required
- Form validation (password length, matching passwords)
- Terms of service acceptance

#### ✅ User Login
- Email and password authentication
- Remember me functionality (via Supabase session)
- Redirect to intended page after login
- Error handling with user-friendly messages

#### ✅ Password Reset
- Email-based password reset
- Secure token-based reset links
- User-friendly confirmation flow

#### ✅ Protected Routes
- All main application routes require authentication
- Automatic redirect to login page for unauthenticated users
- Loading states during authentication checks

#### ✅ User Session Management
- Persistent login sessions
- Automatic session refresh
- Secure logout functionality
- User information display in UI

## File Structure

```
src/
├── contexts/
│   └── AuthContext.tsx          # Authentication context and provider
├── components/
│   ├── ProtectedRoute.tsx       # Route protection component
│   └── TopBar.tsx              # Updated with auth-aware logout
├── lib/
│   └── supabase.ts             # Supabase client configuration
├── pages/
│   ├── Login.tsx               # Updated with Supabase auth
│   ├── Signup.tsx              # Updated with Supabase auth
│   └── ForgotPassword.tsx      # Updated with Supabase auth
└── App.tsx                     # Updated with AuthProvider
```

## Key Components

### AuthContext (`src/contexts/AuthContext.tsx`)
- Manages user session state
- Provides authentication methods (signIn, signUp, signOut, resetPassword)
- Handles authentication state changes
- Exposes user information and loading states

### ProtectedRoute (`src/components/ProtectedRoute.tsx`)
- Wraps protected routes
- Shows loading spinner during auth checks
- Redirects unauthenticated users to login
- Preserves intended destination for post-login redirect

### Supabase Client (`src/lib/supabase.ts`)
- Configures Supabase client with environment variables
- Validates required environment variables
- Exports configured client for use throughout the app

## Usage Examples

### Using Authentication in Components

```tsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, loading, signOut } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {user ? (
        <div>
          <p>Welcome, {user.email}!</p>
          <button onClick={() => signOut()}>Logout</button>
        </div>
      ) : (
        <p>Please log in</p>
      )}
    </div>
  );
}
```

### Protecting Routes

```tsx
import { ProtectedRoute } from '@/components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      {/* Protected routes */}
      <Route element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/reports" element={<Reports />} />
        {/* ... other protected routes */}
      </Route>
    </Routes>
  );
}
```

## Testing the Authentication Flow

### 1. User Registration
1. Navigate to `/signup`
2. Fill in the registration form
3. Check your email for confirmation link
4. Click the confirmation link
5. Navigate to `/login` and sign in

### 2. User Login
1. Navigate to `/login`
2. Enter your credentials
3. You should be redirected to the dashboard
4. User information should appear in the top navigation

### 3. Protected Routes
1. Try accessing `/reports` or `/settings` without logging in
2. You should be redirected to `/login`
3. After logging in, you should be redirected back to the intended page

### 4. Password Reset
1. Navigate to `/forgot-password`
2. Enter your email address
3. Check your email for the reset link
4. Follow the link to reset your password

### 5. Logout
1. Click on your user avatar in the top navigation
2. Click "Logout"
3. You should be redirected to the login page

## Error Handling

The implementation includes comprehensive error handling:

- **Network errors**: Graceful fallback with user-friendly messages
- **Invalid credentials**: Clear error messages for failed login attempts
- **Email confirmation**: Instructions for users who haven't confirmed their email
- **Password requirements**: Validation for password strength and matching
- **Session expiration**: Automatic redirect to login for expired sessions

## Security Considerations

- **Environment Variables**: Sensitive keys are stored in environment variables
- **Client-side Security**: Only the anon key is exposed to the client
- **HTTPS**: Always use HTTPS in production
- **Session Management**: Sessions are managed securely by Supabase
- **Password Policies**: Enforce strong password requirements

## Troubleshooting

### Common Issues

1. **"Missing Supabase environment variables"**
   - Ensure `.env.local` file exists with correct variables
   - Restart the development server after adding environment variables

2. **"Invalid login credentials"**
   - Verify email and password are correct
   - Check if email has been confirmed
   - Ensure the user exists in Supabase

3. **"Redirect loop"**
   - Check that protected routes are properly wrapped
   - Verify the authentication state is being managed correctly

4. **"Environment variables not loading"**
   - Ensure variables start with `VITE_`
   - Restart the development server
   - Check that `.env.local` is in the project root

### Development vs Production

- **Development**: Uses `.env.local` for local environment variables
- **Production**: Set environment variables in your hosting platform
- **Vercel**: Add environment variables in project settings
- **Netlify**: Add environment variables in site settings

## Next Steps

1. **Backend Integration**: Set up backend authentication guards
2. **User Profiles**: Implement user profile management
3. **Role-based Access**: Add role-based permissions
4. **Social Auth**: Add Google, GitHub, or other social providers
5. **Email Templates**: Customize Supabase email templates

## Support

For issues related to:
- **Supabase**: Check the [Supabase documentation](https://supabase.com/docs)
- **React Integration**: Check the [Supabase Auth React guide](https://supabase.com/docs/guides/auth/auth-helpers/react)
- **This Implementation**: Check the code comments and this documentation
