import { User } from '@supabase/supabase-js'

/**
 * Get the display name for a user with fallback logic
 * Priority: user_metadata.name -> user_metadata.full_name -> user.email -> 'User'
 */
export function getUserDisplayName(user: User | null): string {
  if (!user) return 'User'
  
  // Try user_metadata.name first (our custom field)
  if (user.user_metadata?.name) {
    return user.user_metadata.name
  }
  
  // Try user_metadata.full_name (Supabase default)
  if (user.user_metadata?.full_name) {
    return user.user_metadata.full_name
  }
  
  // Fallback to email
  if (user.email) {
    return user.email
  }
  
  // Final fallback
  return 'User'
}

/**
 * Get the first letter of the display name for avatar initials
 */
export function getUserInitials(user: User | null): string {
  const displayName = getUserDisplayName(user)
  
  // If it's an email, use the first letter
  if (displayName.includes('@')) {
    return displayName.charAt(0).toUpperCase()
  }
  
  // For names, try to get first letter of each word
  const words = displayName.trim().split(' ')
  if (words.length >= 2) {
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase()
  }
  
  // Single word, use first letter
  return displayName.charAt(0).toUpperCase()
}
