import React from 'react'
import { AlertTriangle, ExternalLink } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

export function SupabaseConfigNotice() {
  const hasValidConfig = import.meta.env.VITE_SUPABASE_URL && 
    import.meta.env.VITE_SUPABASE_URL !== 'https://placeholder.supabase.co' &&
    import.meta.env.VITE_SUPABASE_ANON_KEY && 
    import.meta.env.VITE_SUPABASE_ANON_KEY !== 'placeholder-key'

  if (hasValidConfig) {
    return null
  }

  return (
    <div className="fixed top-4 left-4 right-4 z-50 max-w-md mx-auto">
      <Alert className="border-yellow-200 bg-yellow-50">
        <AlertTriangle className="h-4 w-4 text-yellow-600" />
        <AlertTitle className="text-yellow-800">Supabase Not Configured</AlertTitle>
        <AlertDescription className="text-yellow-700 mt-2">
          <p className="mb-3">
            Authentication features require Supabase configuration. 
            Create a <code className="bg-yellow-100 px-1 rounded">.env.local</code> file with your Supabase credentials.
          </p>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="text-yellow-700 border-yellow-300 hover:bg-yellow-100"
              onClick={() => window.open('https://supabase.com', '_blank')}
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Setup Supabase
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="text-yellow-700 border-yellow-300 hover:bg-yellow-100"
              onClick={() => window.location.reload()}
            >
              Reload App
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  )
}
