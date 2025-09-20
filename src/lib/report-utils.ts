/**
 * Utility functions for report-related operations
 */

/**
 * Get CSS classes for report status badges
 */
export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'completed':
    case 'normal':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'pending':
    case 'processing':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'failed':
    case 'critical':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

/**
 * Get CSS classes for test result status
 */
export function getResultStatus(status: string): string {
  switch (status.toLowerCase()) {
    case 'normal':
      return 'text-success';
    case 'high':
    case 'low':
      return 'text-warning';
    case 'critical':
      return 'text-destructive';
    default:
      return 'text-muted-foreground';
  }
}

/**
 * Format file size in human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Format date for display
 */
export function formatReportDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format time for display
 */
export function formatReportTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}
