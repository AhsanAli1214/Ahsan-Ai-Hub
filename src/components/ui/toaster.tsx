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

  const playNotificationSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.value = 800
      oscillator.type = 'sine'
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.15)
    } catch (e) {
      console.log('Audio notification unavailable')
    }
  }

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        playNotificationSound()
        return (
          <Toast key={id} {...props}>
            <div className="flex items-start gap-3 flex-1">
              {getToastIcon(title)}
              <div className="grid gap-1.5 flex-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
