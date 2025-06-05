"use client"

import { useEffect, useState } from "react"

export function FloatingElements() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating geometric shapes */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full blur-xl animate-pulse" />
      <div
        className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg rotate-45 animate-bounce"
        style={{ animationDuration: "3s" }}
      />
      <div
        className="absolute bottom-40 left-20 w-12 h-12 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full animate-ping"
        style={{ animationDuration: "4s" }}
      />
      <div
        className="absolute bottom-20 right-10 w-24 h-24 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-lg animate-pulse"
        style={{ animationDuration: "2s" }}
      />

      {/* Additional floating elements */}
      <div
        className="absolute top-1/3 left-1/4 w-8 h-8 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full animate-bounce"
        style={{ animationDuration: "5s", animationDelay: "1s" }}
      />
      <div
        className="absolute top-2/3 right-1/3 w-14 h-14 bg-gradient-to-r from-green-500/20 to-teal-500/20 rounded-lg rotate-12 animate-pulse"
        style={{ animationDuration: "3.5s" }}
      />

      {/* Gradient orbs */}
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-full blur-3xl animate-pulse"
        style={{ animationDuration: "6s" }}
      />
    </div>
  )
}
