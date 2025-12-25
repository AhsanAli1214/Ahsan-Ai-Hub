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
import { CheckCircle2, AlertCircle, Info, TriangleAlert } from "lucide-react"
import { useEffect, useRef } from "react"

export function Toaster() {
  const { toasts } = useToast()
  const soundPlayedIds = useRef<Set<string>>(new Set())

  const getToastIcon = (title?: string) => {
    if (!title) return null
    const titleStr = String(title).toLowerCase()
    if (titleStr.includes('success') || titleStr.includes('copied')) {
      return <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
    }
    if (titleStr.includes('error') || titleStr.includes('failed')) {
      return <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
    }
    if (titleStr.includes('warning')) {
      return <TriangleAlert className="h-5 w-5 text-amber-500 shrink-0" />
    }
    return <Info className="h-5 w-5 text-blue-500 shrink-0" />
  }

  const playNotificationSound = (type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const now = audioContext.currentTime
      
      if (type === 'success') {
        // Success: Professional ascending chime (three tones)
        const frequencies = [523, 659, 784] // C5, E5, G5
        let delay = 0
        
        frequencies.forEach((freq, index) => {
          const osc = audioContext.createOscillator()
          const gain = audioContext.createGain()
          
          osc.connect(gain)
          gain.connect(audioContext.destination)
          
          osc.frequency.value = freq
          osc.type = 'sine'
          
          gain.gain.setValueAtTime(0.18, now + delay)
          gain.gain.exponentialRampToValueAtTime(0.01, now + delay + 0.15)
          
          osc.start(now + delay)
          osc.stop(now + delay + 0.15)
          delay += 0.08
        })
      } else if (type === 'error') {
        // Error: Professional descending alert (strong)
        const osc1 = audioContext.createOscillator()
        const osc2 = audioContext.createOscillator()
        const gain1 = audioContext.createGain()
        const gain2 = audioContext.createGain()
        
        osc1.connect(gain1)
        osc2.connect(gain2)
        gain1.connect(audioContext.destination)
        gain2.connect(audioContext.destination)
        
        // First tone
        osc1.frequency.setValueAtTime(600, now)
        osc1.frequency.exponentialRampToValueAtTime(400, now + 0.2)
        osc1.type = 'sine'
        gain1.gain.setValueAtTime(0.22, now)
        gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.2)
        
        // Second tone
        osc2.frequency.setValueAtTime(400, now + 0.15)
        osc2.frequency.exponentialRampToValueAtTime(300, now + 0.35)
        osc2.type = 'sine'
        gain2.gain.setValueAtTime(0, now + 0.15)
        gain2.gain.linearRampToValueAtTime(0.2, now + 0.2)
        gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.35)
        
        osc1.start(now)
        osc1.stop(now + 0.2)
        osc2.start(now + 0.15)
        osc2.stop(now + 0.35)
      } else if (type === 'warning') {
        // Warning: Double beep alert
        let startTime = now
        for (let i = 0; i < 2; i++) {
          const osc = audioContext.createOscillator()
          const gain = audioContext.createGain()
          
          osc.connect(gain)
          gain.connect(audioContext.destination)
          
          osc.frequency.value = 480
          osc.type = 'sine'
          
          gain.gain.setValueAtTime(0.2, startTime)
          gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.15)
          
          osc.start(startTime)
          osc.stop(startTime + 0.15)
          startTime += 0.25
        }
      } else {
        // Info: Single professional tone
        const osc = audioContext.createOscillator()
        const gain = audioContext.createGain()
        
        osc.connect(gain)
        gain.connect(audioContext.destination)
        
        osc.frequency.value = 440 // A4
        osc.type = 'sine'
        
        gain.gain.setValueAtTime(0.16, now)
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25)
        
        osc.start(now)
        osc.stop(now + 0.25)
      }
    } catch (e) {
      // Audio context not available - silent fail
    }
  }

  const getToastType = (title?: string): 'success' | 'error' | 'info' | 'warning' => {
    if (!title) return 'info'
    const titleStr = String(title).toLowerCase()
    if (titleStr.includes('success') || titleStr.includes('copied')) return 'success'
    if (titleStr.includes('error') || titleStr.includes('failed')) return 'error'
    if (titleStr.includes('warning')) return 'warning'
    return 'info'
  }

  // Play sound only once per toast when it first appears
  useEffect(() => {
    toasts.forEach((toast) => {
      if (!soundPlayedIds.current.has(toast.id)) {
        const toastType = getToastType(toast.title)
        playNotificationSound(toastType)
        soundPlayedIds.current.add(toast.id)
      }
    })
    
    // Cleanup: Remove IDs of closed toasts
    return () => {
      const currentIds = new Set(toasts.map(t => t.id))
      soundPlayedIds.current = new Set([...soundPlayedIds.current].filter(id => currentIds.has(id)))
    }
  }, [toasts])

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast 
            key={id} 
            {...props} 
            className="border border-border/50 shadow-xl bg-card rounded-2xl backdrop-blur-sm animate-in slide-in-from-right-full data-[state=closed]:slide-out-to-right-full duration-400 ease-out gap-4"
          >
            <div className="flex items-start gap-3 flex-1">
              <div className="mt-1 flex-shrink-0">{getToastIcon(title)}</div>
              <div className="grid gap-1.5 flex-1 pr-1">
                {title && (
                  <ToastTitle className="text-sm font-semibold text-foreground tracking-tight">
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
            <ToastClose className="text-muted-foreground/60 hover:text-foreground/80 transition-all duration-200 p-1 hover:bg-muted rounded-md" />
          </Toast>
        )
      })}
      <ToastViewport className="pointer-events-none" />
    </ToastProvider>
  )
}
