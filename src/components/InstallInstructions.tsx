'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Smartphone, Monitor, Chrome, Safari } from 'lucide-react';

interface InstallInstructionsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InstallInstructions({
  open,
  onOpenChange,
}: InstallInstructionsProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Install Ahsan AI Hub</DialogTitle>
          <DialogDescription>
            Choose your device type to see installation instructions
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="mobile" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="mobile" className="gap-2">
              <Smartphone className="h-4 w-4" />
              Mobile
            </TabsTrigger>
            <TabsTrigger value="desktop" className="gap-2">
              <Monitor className="h-4 w-4" />
              Desktop
            </TabsTrigger>
          </TabsList>

          {/* Mobile Instructions */}
          <TabsContent value="mobile" className="space-y-4">
            <Tabs defaultValue="android" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="android">Android</TabsTrigger>
                <TabsTrigger value="ios">iOS</TabsTrigger>
              </TabsList>

              {/* Android Instructions */}
              <TabsContent value="android" className="space-y-4 mt-4">
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm">Chrome/Edge on Android</h3>
                  <ol className="space-y-2 text-sm">
                    <li className="flex gap-3">
                      <span className="font-bold text-blue-600 min-w-fit">1.</span>
                      <span>Open the app in Chrome or Edge browser</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-blue-600 min-w-fit">2.</span>
                      <span>Tap the menu icon (three dots) in the top right corner</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-blue-600 min-w-fit">3.</span>
                      <span>Select "Install app" or "Add to home screen"</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-blue-600 min-w-fit">4.</span>
                      <span>Confirm by tapping "Install" in the popup</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-blue-600 min-w-fit">5.</span>
                      <span>The app will be added to your home screen</span>
                    </li>
                  </ol>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-800">
                    <strong>Tip:</strong> You may also see an install prompt banner at the bottom of the screen.
                  </p>
                </div>
              </TabsContent>

              {/* iOS Instructions */}
              <TabsContent value="ios" className="space-y-4 mt-4">
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm">Safari on iOS</h3>
                  <ol className="space-y-2 text-sm">
                    <li className="flex gap-3">
                      <span className="font-bold text-blue-600 min-w-fit">1.</span>
                      <span>Open the app in Safari browser</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-blue-600 min-w-fit">2.</span>
                      <span>Tap the Share button (square with an arrow) at the bottom</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-blue-600 min-w-fit">3.</span>
                      <span>Scroll down and tap "Add to Home Screen"</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-blue-600 min-w-fit">4.</span>
                      <span>Name your app (default is fine) and tap "Add"</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-blue-600 min-w-fit">5.</span>
                      <span>The app will appear on your home screen</span>
                    </li>
                  </ol>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-800">
                    <strong>Note:</strong> iOS PWA support is limited but the app will work in full screen mode.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* Desktop Instructions */}
          <TabsContent value="desktop" className="space-y-4">
            <Tabs defaultValue="chrome" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="chrome" className="gap-1">
                  <Chrome className="h-4 w-4" />
                  Chrome
                </TabsTrigger>
                <TabsTrigger value="edge">Edge</TabsTrigger>
                <TabsTrigger value="other">Other</TabsTrigger>
              </TabsList>

              {/* Chrome/Edge Instructions */}
              <TabsContent value="chrome" className="space-y-4 mt-4">
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm">Chrome/Chromium Browsers</h3>
                  <ol className="space-y-2 text-sm">
                    <li className="flex gap-3">
                      <span className="font-bold text-blue-600 min-w-fit">1.</span>
                      <span>Look for the install icon in the address bar (computer icon with a down arrow)</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-blue-600 min-w-fit">2.</span>
                      <span>Click the install icon</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-blue-600 min-w-fit">3.</span>
                      <span>A dialog will appear asking to install "Ahsan AI Hub"</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-blue-600 min-w-fit">4.</span>
                      <span>Click "Install" to confirm</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-blue-600 min-w-fit">5.</span>
                      <span>The app will launch and a shortcut will be added to your desktop/menu</span>
                    </li>
                  </ol>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-800">
                    <strong>Alternative:</strong> Right-click the app tab and select "Create shortcut" or use the menu (three dots) → "Create shortcut".
                  </p>
                </div>
              </TabsContent>

              {/* Edge Instructions */}
              <TabsContent value="edge" className="space-y-4 mt-4">
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm">Microsoft Edge</h3>
                  <ol className="space-y-2 text-sm">
                    <li className="flex gap-3">
                      <span className="font-bold text-blue-600 min-w-fit">1.</span>
                      <span>Click the Settings and more menu (three dots) in the top right</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-blue-600 min-w-fit">2.</span>
                      <span>Hover over "Apps" and select "Install this site as an app"</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-blue-600 min-w-fit">3.</span>
                      <span>Review the details and click "Install"</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-blue-600 min-w-fit">4.</span>
                      <span>The app will open in its own window with a taskbar shortcut</span>
                    </li>
                  </ol>
                </div>
              </TabsContent>

              {/* Other Browsers */}
              <TabsContent value="other" className="space-y-4 mt-4">
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm">Firefox & Other Browsers</h3>
                  <ol className="space-y-2 text-sm">
                    <li className="flex gap-3">
                      <span className="font-bold text-blue-600 min-w-fit">1.</span>
                      <span>Right-click the page and select "Create shortcut"</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-blue-600 min-w-fit">2.</span>
                      <span>Or use the browser menu → "Create application shortcut"</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-blue-600 min-w-fit">3.</span>
                      <span>Choose where to save the shortcut (Desktop/Menu)</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-blue-600 min-w-fit">4.</span>
                      <span>A shortcut will be created on your desktop or applications menu</span>
                    </li>
                  </ol>
                </div>
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-4">
          <p className="text-xs text-amber-800">
            <strong>Benefits of installing:</strong> Faster access, works offline (cached content), and a dedicated app experience without browser tabs.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
