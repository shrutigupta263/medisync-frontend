import React from 'react'
import { AlertTriangle, Settings } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

export function DevModeNotice() {
  const bypassEnabled = import.meta.env.VITE_BYPASS_EMAIL_CONFIRMATION === 'true'
  const isDev = import.meta.env.DEV || import.meta.env.MODE === 'development'

  if (bypassEnabled && isDev) {
    return (
      <div className="fixed top-4 left-4 right-4 z-50 max-w-2xl mx-auto">
        <Alert className="border-green-200 bg-green-50">
          <Settings className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Development Mode - Email Bypass Active</AlertTitle>
          <AlertDescription className="text-green-700 mt-2">
            <p className="mb-2">
              ✅ <strong>Email confirmation bypass is ACTIVE</strong>
            </p>
            <p className="text-sm mb-3">
              You can now signup and login immediately without email confirmation.
              This bypass only works in development mode.
            </p>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="text-green-700 border-green-300 hover:bg-green-100"
                onClick={() => window.location.reload()}
              >
                Refresh Page
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="fixed top-4 left-4 right-4 z-50 max-w-2xl mx-auto">
      <Alert className="border-yellow-200 bg-yellow-50">
        <AlertTriangle className="h-4 w-4 text-yellow-600" />
        <AlertTitle className="text-yellow-800">Development Mode - Email Confirmation Required</AlertTitle>
        <AlertDescription className="text-yellow-700 mt-2">
          <p className="mb-3">
            Your Supabase project requires email confirmation. To fix login/signup issues:
          </p>
          
          <div className="space-y-2 mb-4 text-sm">
            <p><strong>Quick Fix (Recommended):</strong></p>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>Go to <a href="https://app.supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Supabase Dashboard</a></li>
              <li>Navigate to <strong>Authentication → Settings</strong></li>
              <li>Turn OFF <strong>"Enable email confirmations"</strong></li>
              <li>Click <strong>Save</strong></li>
              <li>Refresh this page</li>
            </ol>
          </div>

          <div className="space-y-2 text-sm">
            <p><strong>Alternative:</strong> Use a real email address for signup and check your email for confirmation.</p>
          </div>
          
          <div className="flex gap-2 mt-4">
            <Button 
              size="sm" 
              variant="outline" 
              className="text-yellow-700 border-yellow-300 hover:bg-yellow-100"
              onClick={() => window.open('https://app.supabase.com', '_blank')}
            >
              <Settings className="h-3 w-3 mr-1" />
              Open Supabase Dashboard
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="text-yellow-700 border-yellow-300 hover:bg-yellow-100"
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  )
}
