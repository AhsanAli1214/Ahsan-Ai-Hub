"use client"

import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { CheckCircle2, AlertCircle, Lightbulb } from "lucide-react"

export function Toaster() {
  const { toasts } = useToast()

  const getToastIcon = (title?: string) => {
    if (!title) return null
    const titleStr = String(title).toLowerCase()
    if (titleStr.includes('success') || titleStr.includes('copied')) {
      return <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
    }
    if (titleStr.includes('error') || titleStr.includes('failed')) {
      return <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
    }
    return <Lightbulb className="h-5 w-5 text-blue-500 shrink-0" />
  }

  const playNotificationSound = (type: 'success' | 'error' | 'info' = 'info') => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const now = audioContext.currentTime
      
      if (type === 'success') {
        // Success: Two ascending tones (pleasant chime)
        const osc1 = audioContext.createOscillator()
        const osc2 = audioContext.createOscillator()
        const gain1 = audioContext.createGain()
        const gain2 = audioContext.createGain()
        
        osc1.connect(gain1)
        osc2.connect(gain2)
        gain1.connect(audioContext.destination)
        gain2.connect(audioContext.destination)
        
        osc1.frequency.value = 523 // C5
        osc2.frequency.value = 659 // E5
        osc1.type = 'sine'
        osc2.type = 'sine'
        
        gain1.gain.setValueAtTime(0.2, now)
        gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.2)
        gain2.gain.setValueAtTime(0, now)
        gain2.gain.linearRampToValueAtTime(0.2, now + 0.1)
        gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.35)
        
        osc1.start(now)
        osc1.stop(now + 0.2)
        osc2.start(now + 0.1)
        osc2.stop(now + 0.35)
      } else if (type === 'error') {
        // Error: Descending tone (alert)
        const osc = audioContext.createOscillator()
        const gain = audioContext.createGain()
        
        osc.connect(gain)
        gain.connect(audioContext.destination)
        
        osc.frequency.setValueAtTime(600, now)
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.3)
        osc.type = 'sine'
        
        gain.gain.setValueAtTime(0.25, now)
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3)
        
        osc.start(now)
        osc.stop(now + 0.3)
      } else {
        // Info: Single smooth tone
        const osc = audioContext.createOscillator()
        const gain = audioContext.createGain()
        
        osc.connect(gain)
        gain.connect(audioContext.destination)
        
        osc.frequency.value = 440 // A4
        osc.type = 'sine'
        
        gain.gain.setValueAtTime(0.15, now)
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25)
        
        osc.start(now)
        osc.stop(now + 0.25)
      }
    } catch (e) {
      // Audio context not available
    }
  }

  const getToastType = (title?: string): 'success' | 'error' | 'info' => {
    if (!title) return 'info'
    const titleStr = String(title).toLowerCase()
    if (titleStr.includes('success') || titleStr.includes('copied')) return 'success'
    if (titleStr.includes('error') || titleStr.includes('failed')) return 'error'
    return 'info'
  }

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        const toastType = getToastType(title)
        playNotificationSound(toastType)
        
        return (
          <Toast 
            key={id} 
            {...props} 
            className="border-2 border-border/40 shadow-2xl bg-card rounded-2xl animate-in slide-in-from-right-full duration-500 ease-out"
          >
            <div className="flex items-start gap-4 flex-1">
              <div className="mt-0.5">{getToastIcon(title)}</div>
              <div className="grid gap-1 flex-1 pr-2">
                {title && (
                  <ToastTitle className="text-sm font-bold text-foreground leading-tight tracking-tight">
                    {title}
                  </ToastTitle>
                )}
                {description && (
                  <ToastDescription className="text-xs text-muted-foreground font-medium leading-relaxed">
                    {description}
                  </ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose className="text-muted-foreground/50 hover:text-foreground transition-colors p-1" />
          </Toast>
        )
      })}
      <ToastViewport className="pointer-events-none" />
    </ToastProvider>
  )
}
