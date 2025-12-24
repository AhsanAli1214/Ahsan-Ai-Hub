'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { useEffect } from 'react';

export default function SentryExamplePage() {
  const triggerClientError = () => {
    throw new Error('This is a test error from the client');
  };

  const triggerServerError = async () => {
    try {
      const response = await fetch('/api/test-error');
      if (!response.ok) {
        throw new Error('Server error triggered');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    console.log('Sentry Example Page loaded');
  }, []);

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Sentry Integration Test</h1>
          <p className="text-muted-foreground">
            Test your Sentry error tracking integration by triggering test errors below.
          </p>
        </div>

        <Card className="border-amber-500/20 bg-amber-500/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              <CardTitle>Test Error Triggers</CardTitle>
            </div>
            <CardDescription>
              Click the buttons below to trigger test errors and verify Sentry is capturing them.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={triggerClientError}
              variant="destructive"
              className="w-full"
            >
              Trigger Client Error
            </Button>
            <Button
              onClick={triggerServerError}
              variant="destructive"
              className="w-full"
            >
              Trigger Server Error
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>How to verify Sentry is working:</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <ol className="list-decimal list-inside space-y-2">
              <li>Click one of the error buttons above</li>
              <li>Log in to your Sentry dashboard</li>
              <li>Navigate to your project (javascript-nextjs)</li>
              <li>You should see the test error appear in the Issues tab</li>
            </ol>
          </CardContent>
        </Card>

        <Card className="bg-blue-500/5 border-blue-500/20">
          <CardHeader>
            <CardTitle className="text-blue-600 dark:text-blue-400">Next Steps</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2 text-muted-foreground">
            <p>1. Add your Sentry DSN to your environment variables</p>
            <p>2. Configure release and environment tracking</p>
            <p>3. Set up source map uploads for better error details</p>
            <p>4. Monitor your application errors in the Sentry dashboard</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
