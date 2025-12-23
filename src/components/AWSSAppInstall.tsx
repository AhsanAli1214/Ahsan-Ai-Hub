'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, Smartphone, Monitor, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export function AWSAppInstall() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const apps = [
    {
      id: 'android',
      name: 'Android App',
      icon: Smartphone,
      description: 'Download for Android devices',
      setupSteps: [
        'Install AWS Amplify CLI: npm install -g @aws-amplify/cli',
        'Configure AWS: amplify configure',
        'Initialize Amplify: amplify init',
        'Push to AWS: amplify push',
      ],
      downloadLink: 'https://play.google.com/store/apps/details?id=com.ahsanaihub',
    },
    {
      id: 'desktop',
      name: 'Desktop Application',
      icon: Monitor,
      description: 'Download for Windows, Mac, and Linux',
      setupSteps: [
        'Download Electron app from releases',
        'Install dependencies: npm install',
        'Build app: npm run build',
        'Run: npm start',
      ],
      downloadLink: 'https://github.com/AhsanAli1214/Ahsan-Ai/releases',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 p-4 flex gap-3">
        <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-blue-900 dark:text-blue-300">AWS Integration Setup</h3>
          <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
            Follow the setup steps below to configure AWS backend for your apps.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {apps.map((app) => (
          <Card key={app.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <app.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{app.name}</h3>
                <p className="text-sm text-muted-foreground">{app.description}</p>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <p className="text-sm font-medium">Setup Instructions:</p>
              <ol className="text-sm space-y-2">
                {app.setupSteps.map((step, idx) => (
                  <li key={idx} className="flex gap-2 text-muted-foreground">
                    <span className="font-semibold text-primary min-w-5">{idx + 1}.</span>
                    <code className="bg-muted px-2 py-1 rounded text-xs flex-1 overflow-x-auto">
                      {step}
                    </code>
                    <button
                      onClick={() => copyToClipboard(step, `${app.id}-${idx}`)}
                      className="text-primary hover:underline text-xs whitespace-nowrap ml-2"
                    >
                      {copied === `${app.id}-${idx}` ? 'Copied!' : 'Copy'}
                    </button>
                  </li>
                ))}
              </ol>
            </div>

            <Button asChild className="w-full" size="sm">
              <a href={app.downloadLink} target="_blank" rel="noopener noreferrer">
                <Download className="h-4 w-4 mr-2" />
                {app.id === 'android' ? 'Get from Play Store' : 'Download from Releases'}
              </a>
            </Button>
          </Card>
        ))}
      </div>

      <Card className="p-6 bg-muted/50">
        <h3 className="font-semibold mb-4">AWS Configuration Steps</h3>
        <div className="space-y-3 text-sm">
          <div>
            <p className="font-medium text-primary mb-1">1. Create AWS Account</p>
            <p className="text-muted-foreground">Sign up at aws.amazon.com if you haven't already</p>
          </div>
          <div>
            <p className="font-medium text-primary mb-1">2. Set Up IAM User</p>
            <p className="text-muted-foreground">
              Create IAM user with programmatic access and attach AdministratorAccess policy
            </p>
          </div>
          <div>
            <p className="font-medium text-primary mb-1">3. Configure Amplify</p>
            <p className="text-muted-foreground">
              Use your AWS credentials when running `amplify configure`
            </p>
          </div>
          <div>
            <p className="font-medium text-primary mb-1">4. Deploy Services</p>
            <p className="text-muted-foreground">
              Add amplify services (Auth, API, Storage) and push to AWS
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
