'use client';

import { useState } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronDown, Smartphone, Monitor, Chrome, Apple } from 'lucide-react';

export function InstallGuide() {
  const [openSections, setOpenSections] = useState<string[]>(['android']);

  const toggleSection = (id: string) => {
    setOpenSections((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="space-y-4 w-full">
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
        <TabsContent value="mobile" className="space-y-4 mt-4">
          {/* Android */}
          <Collapsible
            open={openSections.includes('android')}
            onOpenChange={() => toggleSection('android')}
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between"
                size="sm"
              >
                <span className="flex items-center gap-2">
                  <Chrome className="h-4 w-4" />
                  Android (Chrome/Edge)
                </span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    openSections.includes('android') ? 'rotate-180' : ''
                  }`}
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-3 space-y-2">
              <ol className="space-y-2 text-sm">
                <li className="flex gap-3">
                  <span className="font-bold text-blue-600 min-w-fit">1.</span>
                  <span>Open the app in Chrome or Edge browser</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-600 min-w-fit">2.</span>
                  <span>Tap the menu icon (three dots) in the top right</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-600 min-w-fit">3.</span>
                  <span>Select "Install app" or "Add to home screen"</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-600 min-w-fit">4.</span>
                  <span>Confirm by tapping "Install"</span>
                </li>
              </ol>
            </CollapsibleContent>
          </Collapsible>

          {/* iOS */}
          <Collapsible
            open={openSections.includes('ios')}
            onOpenChange={() => toggleSection('ios')}
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between"
                size="sm"
              >
                <span className="flex items-center gap-2">
                  <Apple className="h-4 w-4" />
                  iOS (Safari)
                </span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    openSections.includes('ios') ? 'rotate-180' : ''
                  }`}
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-3 space-y-2">
              <ol className="space-y-2 text-sm">
                <li className="flex gap-3">
                  <span className="font-bold text-blue-600 min-w-fit">1.</span>
                  <span>Open the app in Safari browser</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-600 min-w-fit">2.</span>
                  <span>Tap the Share button (square with arrow) at the bottom</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-600 min-w-fit">3.</span>
                  <span>Scroll down and tap "Add to Home Screen"</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-600 min-w-fit">4.</span>
                  <span>Name your app and tap "Add"</span>
                </li>
              </ol>
            </CollapsibleContent>
          </Collapsible>
        </TabsContent>

        {/* Desktop Instructions */}
        <TabsContent value="desktop" className="space-y-4 mt-4">
          {/* Chrome */}
          <Collapsible
            open={openSections.includes('chrome')}
            onOpenChange={() => toggleSection('chrome')}
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between"
                size="sm"
              >
                <span className="flex items-center gap-2">
                  <Chrome className="h-4 w-4" />
                  Chrome/Edge
                </span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    openSections.includes('chrome') ? 'rotate-180' : ''
                  }`}
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-3 space-y-2">
              <ol className="space-y-2 text-sm">
                <li className="flex gap-3">
                  <span className="font-bold text-blue-600 min-w-fit">1.</span>
                  <span>Look for the install icon in the address bar</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-600 min-w-fit">2.</span>
                  <span>Click the install icon</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-600 min-w-fit">3.</span>
                  <span>Click "Install" in the dialog</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-600 min-w-fit">4.</span>
                  <span>The app will launch with a desktop shortcut</span>
                </li>
              </ol>
            </CollapsibleContent>
          </Collapsible>

          {/* Firefox */}
          <Collapsible
            open={openSections.includes('firefox')}
            onOpenChange={() => toggleSection('firefox')}
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between"
                size="sm"
              >
                <span>Firefox & Other Browsers</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    openSections.includes('firefox') ? 'rotate-180' : ''
                  }`}
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-3 space-y-2">
              <ol className="space-y-2 text-sm">
                <li className="flex gap-3">
                  <span className="font-bold text-blue-600 min-w-fit">1.</span>
                  <span>Right-click the page and select "Create shortcut"</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-600 min-w-fit">2.</span>
                  <span>Choose where to save (Desktop/Menu)</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-600 min-w-fit">3.</span>
                  <span>A shortcut will be created</span>
                </li>
              </ol>
            </CollapsibleContent>
          </Collapsible>
        </TabsContent>
      </Tabs>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-xs text-blue-800">
          <strong>Benefits:</strong> Faster access, offline support, and dedicated app experience without browser tabs.
        </p>
      </div>
    </div>
  );
}
