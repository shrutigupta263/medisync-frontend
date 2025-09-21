import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { authBypass } from '@/lib/auth-bypass'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  userId: string | null
  signUp: (email: string, password: string, metadata?: { firstName?: string; lastName?: string }) => Promise<{ user: User | null; error: AuthError | null }>
  signIn: (email: string, password: string) => Promise<{ user: User | null; error: AuthError | null }>
  signOut: () => Promise<{ error: AuthError | null }>
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>
  updateUser: (data: { name?: string }) => Promise<{ user: User | null; error: AuthError | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true;
    
    // Get initial session with timeout
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (!isMounted) return;
        
        if (error) {
          console.error('Session error:', error)
        }
        
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      } catch (error) {
        console.error('Session initialization error:', error)
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    // Add timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (isMounted) {
        console.warn('Auth initialization timeout, continuing without session')
        setLoading(false)
      }
    }, 5000) // 5 second timeout

    initializeAuth()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    })

    return () => {
      isMounted = false;
      clearTimeout(timeoutId)
      subscription.unsubscribe()
    }
  }, [])

  const signUp = async (email: string, password: string, metadata?: { firstName?: string; lastName?: string }) => {
    try {
      const signupMetadata = {
        name: metadata ? `${metadata.firstName} ${metadata.lastName}`.trim() : undefined,
        firstName: metadata?.firstName,
        lastName: metadata?.lastName,
      }

      // Try bypass signup first
      const bypassResult = await authBypass.signUpWithBypass(email, password, signupMetadata)
      
      if (bypassResult.bypassed) {
        return { user: bypassResult.user, error: bypassResult.error }
      }

      // Fallback to normal signup if bypass not used
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: signupMetadata,
          emailRedirectTo: `${window.location.origin}/login?confirmed=true`
        }
      })
      return { user: data.user, error }
    } catch (error) {
      console.error('SignUp error:', error)
      return { user: null, error: { message: `Authentication error: ${error instanceof Error ? error.message : 'Unknown error'}` } as any }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      // Try bypass signin first
      const bypassResult = await authBypass.signInWithBypass(email, password)
      
      if (bypassResult.bypassed) {
        // Manually set the user and session for bypassed login
        setUser(bypassResult.user)
        setSession({
          access_token: 'dev-bypass-token',
          refresh_token: 'dev-bypass-refresh',
          expires_in: 3600,
          expires_at: Math.floor(Date.now() / 1000) + 3600,
          token_type: 'bearer',
          user: bypassResult.user
        } as any)
        return { user: bypassResult.user, error: bypassResult.error }
      }

      // Normal signin if no bypass
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      return { user: data.user, error }
    } catch (error) {
      console.error('SignIn error:', error)
      return { user: null, error: { message: `Authentication error: ${error instanceof Error ? error.message : 'Unknown error'}` } as any }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      return { error }
    } catch (error) {
      return { error: { message: 'Supabase not configured. Please set up your environment variables.' } as any }
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      return { error }
    } catch (error) {
      return { error: { message: 'Supabase not configured. Please set up your environment variables.' } as any }
    }
  }

  const updateUser = async (data: { name?: string }) => {
    try {
      const { data: updateData, error } = await supabase.auth.updateUser({
        data: {
          name: data.name,
        }
      })
      return { user: updateData.user, error }
    } catch (error) {
      return { user: null, error: { message: 'Supabase not configured. Please set up your environment variables.' } as any }
    }
  }

  const value = {
    user,
    session,
    loading,
    userId: user?.id || null,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
