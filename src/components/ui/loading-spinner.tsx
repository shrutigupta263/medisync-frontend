import React from 'react';
import { Activity } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface LoadingSpinnerProps {
  message?: string;
  description?: string;
}

export function LoadingSpinner({ 
  message = "Loading...", 
  description 
}: LoadingSpinnerProps) {
  return (
    <Card>
      <CardContent className="flex items-center justify-center h-48">
        <div className="text-center">
          <Activity className="mx-auto h-12 w-12 text-muted-foreground mb-4 animate-spin" />
          <p className="text-lg font-medium mb-2">{message}</p>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
