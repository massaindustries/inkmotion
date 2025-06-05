"use client"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Sparkles, ArrowRight } from "lucide-react"

interface TextInputSectionProps {
  onSubmit: (text: string) => void
}

export function TextInputSection({ onSubmit }: TextInputSectionProps) {
  const [text, setText] = useState("")

  const handleSubmit = () => {
    if (text.trim()) {
      onSubmit(text.trim())
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto text-center space-y-12">
      {/* Hero Section */}
      <div className="space-y-6">
        <div className="inline-flex items-center space-x-2 text-orange-400 text-sm">
          <Sparkles className="w-4 h-4" />
          <span>AI-Powered Video Generation</span>
        </div>

        <h1 className="text-6xl md:text-7xl font-bold text-white leading-tight">
          Transform Your Ideas
          <br />
          <span className="text-gray-400">into Stunning Videos</span>
        </h1>

        <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Experience the power of AI-driven creativity. Simply describe your vision, and watch as our advanced workflow
          transforms your words into professional video content.
        </p>
      </div>

      {/* Input Section */}
      <div className="space-y-8">
        <div className="relative">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Describe the video you want to create... Be as detailed as possible for the best results."
            className="w-full min-h-[200px] bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 text-lg p-6 rounded-xl backdrop-blur-sm resize-none focus:border-orange-400 focus:ring-orange-400/20"
          />
          <div className="absolute bottom-4 right-4 text-gray-500 text-sm">{text.length} characters</div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleSubmit}
            disabled={!text.trim()}
            className="px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Generate Video
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>

          <Button
            variant="outline"
            className="px-8 py-4 border-gray-600 text-gray-300 hover:bg-gray-800 rounded-xl text-lg"
          >
            View Examples
          </Button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-gray-800">
        <div className="text-center">
          <div className="text-3xl font-bold text-white">1000+</div>
          <div className="text-gray-400 text-sm">Videos Generated</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-white">50+</div>
          <div className="text-gray-400 text-sm">Happy Creators</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-white">99%</div>
          <div className="text-gray-400 text-sm">Success Rate</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-white">24/7</div>
          <div className="text-gray-400 text-sm">AI Processing</div>
        </div>
      </div>
    </div>
  )
}
