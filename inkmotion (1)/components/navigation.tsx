"use client"

import { ArrowLeft, Book } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NavigationProps {
  onBackToHome?: () => void
}

export function Navigation({ onBackToHome }: NavigationProps) {
  return (
    <nav className="relative z-20 flex items-center justify-between p-6">
      <div className="flex items-center space-x-4">
        {onBackToHome && (
          <Button onClick={onBackToHome} variant="ghost" className="text-gray-400 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        )}

        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
            <Book className="w-6 h-6 text-white" />
          </div>
          <span className="text-white font-bold text-2xl">MondadorAI</span>
        </div>
      </div>

      <div className="hidden md:flex items-center space-x-6 text-sm text-gray-400">
        <span>AI Video Generation Platform</span>
      </div>
    </nav>
  )
}
