"use client"

import { Clock } from "lucide-react"

interface TimerProps {
  seconds: number
}

export function Timer({ seconds }: TimerProps) {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60

  const formattedTime = `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`

  // Determine color based on time remaining
  let textColor = "text-green-500"
  if (seconds < 60) {
    textColor = "text-red-500"
  } else if (seconds < 120) {
    textColor = "text-yellow-500"
  }

  return (
    <div className={`flex items-center gap-1 font-mono font-medium ${textColor}`}>
      <Clock className="h-4 w-4" />
      <span>{formattedTime}</span>
    </div>
  )
}

