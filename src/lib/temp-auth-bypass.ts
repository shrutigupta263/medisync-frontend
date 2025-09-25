/**
 * Temporary authentication bypass for development
 * This will be removed once Supabase is properly configured
 */

import { User } from '@supabase/supabase-js'

interface TempAuthResult {
  user: User | null
  error: any | null
  bypassed: boolean
}

class TempAuthBypassService {
  private isDevelopment(): boolean {
    return import.meta.env.DEV || import.meta.env.MODE === 'development'
  }

  /**
   * Get or create a persistent user ID for development
   */
  private getPersistentUserId(email: string): string {
    const storageKey = 'dev-user-id'
    const emailKey = `dev-user-${email}`
    
    // Try to get existing user ID for this email
    const existingUserId = localStorage.getItem(emailKey)
    if (existingUserId) {
      return existingUserId
    }
    
    // Create new persistent user ID
    const userId = 'dev-user-' + Date.now()
    localStorage.setItem(emailKey, userId)
    return userId
  }

  /**
   * Store user session in localStorage for persistence
   */
  private storeUserSession(user: User): void {
    try {
      localStorage.setItem('dev-user-session', JSON.stringify({
        user,
        timestamp: Date.now()
      }))
    } catch (error) {
      console.warn('Failed to store user session:', error)
    }
  }

  /**
   * Get stored user session from localStorage
   */
  private getStoredUserSession(): User | null {
    try {
      const stored = localStorage.getItem('dev-user-session')
      if (!stored) return null
      
      const session = JSON.parse(stored)
      // Check if session is still valid (24 hours)
      const isExpired = Date.now() - session.timestamp > 24 * 60 * 60 * 1000
      if (isExpired) {
        localStorage.removeItem('dev-user-session')
        return null
      }
      
      return session.user
    } catch (error) {
      console.warn('Failed to get stored user session:', error)
      return null
    }
  }

  /**
   * Clear stored user session
   */
  private clearUserSession(): void {
    localStorage.removeItem('dev-user-session')
  }

  /**
   * Temporary sign in bypass for development
   */
  async signInWithBypass(email: string, password: string): Promise<TempAuthResult> {
    try {
      // Only bypass in development mode
      if (!this.isDevelopment()) {
        return { user: null, error: null, bypassed: false }
      }

      // Check if user is already logged in
      const storedUser = this.getStoredUserSession()
      if (storedUser && storedUser.email === email) {
        console.log('✅ Using stored session for development')
        return { user: storedUser, error: null, bypassed: true }
      }

      // Create a mock user for development with persistent ID
      const persistentUserId = this.getPersistentUserId(email)
      const mockUser: User = {
        id: persistentUserId,
        email: email,
        email_confirmed_at: new Date().toISOString(),
        user_metadata: {
          name: email.split('@')[0],
          email_verified: true,
        },
        app_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      // Store the session for persistence
      this.storeUserSession(mockUser)

      console.warn('⚠️ Using temporary auth bypass for development')
      return { user: mockUser, error: null, bypassed: true }

    } catch (error) {
      console.error('Temp auth bypass error:', error)
      return { 
        user: null, 
        error: { message: `Auth error: ${error instanceof Error ? error.message : 'Unknown error'}` }, 
        bypassed: false 
      }
    }
  }

  /**
   * Temporary sign up bypass for development
   */
  async signUpWithBypass(email: string, password: string, metadata?: any): Promise<TempAuthResult> {
    try {
      // Only bypass in development mode
      if (!this.isDevelopment()) {
        return { user: null, error: null, bypassed: false }
      }

      // Create a mock user for development with persistent ID
      const persistentUserId = this.getPersistentUserId(email)
      const mockUser: User = {
        id: persistentUserId,
        email: email,
        email_confirmed_at: new Date().toISOString(),
        user_metadata: {
          name: metadata?.name || email.split('@')[0],
          firstName: metadata?.firstName,
          lastName: metadata?.lastName,
          email_verified: true,
        },
        app_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      // Store the session for persistence
      this.storeUserSession(mockUser)

      console.warn('⚠️ Using temporary auth bypass for development')
      return { user: mockUser, error: null, bypassed: true }

    } catch (error) {
      console.error('Temp auth bypass error:', error)
      return { 
        user: null, 
        error: { message: `Auth error: ${error instanceof Error ? error.message : 'Unknown error'}` }, 
        bypassed: false 
      }
    }
  }

  /**
   * Check if user has a valid stored session
   */
  async checkStoredSession(): Promise<User | null> {
    if (!this.isDevelopment()) {
      return null
    }

    return this.getStoredUserSession()
  }

  /**
   * Sign out and clear stored session
   */
  async signOutWithBypass(): Promise<{ error: any | null }> {
    try {
      this.clearUserSession()
      return { error: null }
    } catch (error) {
      return { error: { message: 'Failed to sign out' } }
    }
  }
}

export const tempAuthBypass = new TempAuthBypassService()
