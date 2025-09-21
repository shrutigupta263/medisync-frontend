/**
 * Development Auth Bypass Service
 * Allows login without email confirmation in development mode only
 */

import { supabase } from './supabase'

interface DevAuthResult {
  user: any | null
  error: any | null
  bypassed: boolean
}

class AuthBypassService {
  private isDevelopment(): boolean {
    return (
      import.meta.env.DEV || 
      import.meta.env.MODE === 'development' ||
      import.meta.env.VITE_BYPASS_EMAIL_CONFIRMATION === 'true'
    )
  }

  private logBypassWarning(): void {
    if (this.isDevelopment()) {
      console.warn(
        '%c⚠️ Email confirmation bypass active (development mode only)',
        'color: orange; font-weight: bold; font-size: 14px;'
      )
      console.warn(
        '%cThis bypass is DISABLED in production for security.',
        'color: orange; font-size: 12px;'
      )
    }
  }

  /**
   * Attempt to sign in with email confirmation bypass in development
   */
  async signInWithBypass(email: string, password: string): Promise<DevAuthResult> {
    if (!this.isDevelopment()) {
      return { user: null, error: null, bypassed: false }
    }

    try {
      // First try normal login
      const { data: normalData, error: normalError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      // If normal login succeeds, return it
      if (!normalError && normalData.user) {
        return { user: normalData.user, error: null, bypassed: false }
      }

      // If error is email_not_confirmed, attempt bypass
      if (normalError && (
        normalError.message.includes('Email not confirmed') || 
        normalError.message.includes('email_not_confirmed')
      )) {
        this.logBypassWarning()
        
        // Create a mock user session for development
        const mockUser = {
          id: `dev-user-${Date.now()}`,
          email: email,
          email_confirmed_at: new Date().toISOString(), // Mock confirmation
          user_metadata: {
            email: email,
            email_verified: true, // Mock verification
          },
          app_metadata: {
            provider: 'email',
            providers: ['email']
          },
          aud: 'authenticated',
          role: 'authenticated',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_anonymous: false,
        }

        return { user: mockUser, error: null, bypassed: true }
      }

      // Return original error if not confirmation-related
      return { user: null, error: normalError, bypassed: false }

    } catch (error) {
      console.error('Auth bypass error:', error)
      return { 
        user: null, 
        error: { message: `Bypass failed: ${error instanceof Error ? error.message : 'Unknown error'}` }, 
        bypassed: false 
      }
    }
  }

  /**
   * Sign up with automatic confirmation in development
   */
  async signUpWithBypass(email: string, password: string, metadata?: any): Promise<DevAuthResult> {
    try {
      // Normal signup
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/login?confirmed=true`
        }
      })

      if (error) {
        return { user: null, error, bypassed: false }
      }

      // In development, if user is created but not confirmed, mock the confirmation
      if (this.isDevelopment() && data.user && !data.user.email_confirmed_at) {
        this.logBypassWarning()
        
        const bypassUser = {
          ...data.user,
          email_confirmed_at: new Date().toISOString(),
          user_metadata: {
            ...data.user.user_metadata,
            email_verified: true,
          }
        }

        return { user: bypassUser, error: null, bypassed: true }
      }

      return { user: data.user, error: null, bypassed: false }

    } catch (error) {
      console.error('Signup bypass error:', error)
      return { 
        user: null, 
        error: { message: `Signup failed: ${error instanceof Error ? error.message : 'Unknown error'}` }, 
        bypassed: false 
      }
    }
  }
}

export const authBypass = new AuthBypassService()
