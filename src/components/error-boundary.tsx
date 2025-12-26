'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, Send } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  isReporting: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    isReporting: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null, isReporting: false };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReportError = async () => {
    this.setState({ isReporting: true });
    try {
      const response = await fetch('/api/report-error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: this.state.error?.message || 'Unknown Error',
          stack: this.state.error?.stack || 'No stack trace available',
          componentStack: this.state.errorInfo?.componentStack || '',
          url: window.location.href,
          userAgent: navigator.userAgent,
        }),
      });

      if (response.ok) {
        toast({
          title: 'Error Reported',
          description: 'Thank you! Our team has been notified.',
        });
      } else {
        throw new Error('Failed to report error');
      }
    } catch (err) {
      toast({
        title: 'Reporting Failed',
        description: 'Could not send error report. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      this.setState({ isReporting: false });
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[400px] flex-col items-center justify-center p-6 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertCircle className="h-10 w-10" />
          </div>
          <h2 className="mb-2 text-2xl font-bold">Something went wrong</h2>
          <p className="mb-6 max-w-md text-muted-foreground">
            An unexpected error occurred. We've been notified and are working on it.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Reload Page
            </Button>
            <Button 
              onClick={this.handleReportError}
              disabled={this.state.isReporting}
              className="flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              {this.state.isReporting ? 'Reporting...' : 'Report Error'}
            </Button>
          </div>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <div className="mt-8 w-full max-w-3xl overflow-auto rounded-lg bg-muted p-4 text-left text-xs">
              <pre className="text-destructive font-mono">{this.state.error.stack}</pre>
            </div>
          )}
        </div>
      );
    }

    return this.children;
  }
}
