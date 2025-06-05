"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Video,
  Brain,
  ArrowRight,
  Sparkles,
  Zap,
  BookOpen,
  ImageIcon,
  ChevronLeft,
  Play,
  MessageSquare,
} from "lucide-react"

interface ChoiceWindowProps {
  inputText: string
  isBookCoverMode: boolean
  onVideoGeneration: () => void
  onArnoldAnalysis: () => void
  onBack: () => void
}

export function ChoiceWindow({
  inputText,
  isBookCoverMode,
  onVideoGeneration,
  onArnoldAnalysis,
  onBack,
}: ChoiceWindowProps) {
  const [hoveredOption, setHoveredOption] = useState<string | null>(null)

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-gray-900/95 border border-gray-700 rounded-2xl p-8 max-w-4xl w-full backdrop-blur-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button onClick={onBack} variant="ghost" className="text-gray-400 hover:text-white p-2">
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <div>
              <h2 className="text-3xl font-bold text-white">Choose Your Next Step</h2>
              <p className="text-gray-400 mt-1">Select how you want to process your content</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-2">
            {isBookCoverMode ? (
              <ImageIcon className="w-4 h-4 text-orange-400" />
            ) : (
              <BookOpen className="w-4 h-4 text-orange-400" />
            )}
            <span className="text-orange-300 text-sm">{isBookCoverMode ? "Book Cover Analysis" : "Text Input"}</span>
          </div>
        </div>

        {/* Content Preview */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-3">Your Content:</h3>
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <div className="text-gray-300 leading-relaxed">
              {inputText.length > 200 ? `${inputText.substring(0, 200)}...` : inputText}
            </div>
            {inputText.length > 200 && (
              <div className="text-gray-500 text-sm mt-2">{inputText.length} characters total</div>
            )}
          </div>
        </div>

        {/* Choice Options */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Video Generation Option */}
          <Card
            className={`bg-gray-900/50 border-2 transition-all duration-300 cursor-pointer transform hover:scale-[1.02] ${
              hoveredOption === "video"
                ? "border-orange-500 bg-orange-500/10"
                : "border-gray-700 hover:border-orange-500/50"
            }`}
            onMouseEnter={() => setHoveredOption("video")}
            onMouseLeave={() => setHoveredOption(null)}
            onClick={onVideoGeneration}
          >
            <CardContent className="p-8 text-center space-y-6">
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto transition-all duration-300 ${
                  hoveredOption === "video" ? "bg-orange-500/20" : "bg-orange-500/10"
                }`}
              >
                <Video className="w-10 h-10 text-orange-400" />
              </div>

              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-white">Generate Video</h3>
                <p className="text-gray-400 leading-relaxed">
                  Transform your content into a stunning cinematic promotional video using our advanced AI video
                  generation pipeline.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-center space-x-2 text-orange-300">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm">AI Video Generation</span>
                </div>
                <div className="text-gray-500 text-sm">
                  • Scene creation & visual storytelling
                  <br />• Professional narration & vocals
                  <br />• Cinematic effects & transitions
                </div>
              </div>

              <Button
                className={`w-full px-6 py-3 font-semibold rounded-xl transition-all duration-300 ${
                  hoveredOption === "video"
                    ? "bg-orange-600 hover:bg-orange-700 text-white"
                    : "bg-orange-600/80 hover:bg-orange-600 text-white"
                }`}
              >
                <Play className="w-5 h-5 mr-2" />
                Start Video Generation
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Arnold Analysis Option */}
          <Card
            className={`bg-gray-900/50 border-2 transition-all duration-300 cursor-pointer transform hover:scale-[1.02] ${
              hoveredOption === "arnold"
                ? "border-purple-500 bg-purple-500/10"
                : "border-gray-700 hover:border-purple-500/50"
            }`}
            onMouseEnter={() => setHoveredOption("arnold")}
            onMouseLeave={() => setHoveredOption(null)}
            onClick={onArnoldAnalysis}
          >
            <CardContent className="p-8 text-center space-y-6">
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto transition-all duration-300 ${
                  hoveredOption === "arnold" ? "bg-purple-500/20" : "bg-purple-500/10"
                }`}
              >
                <Brain className="w-10 h-10 text-purple-400" />
              </div>

              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-white">Analyze with Arnold</h3>
                <p className="text-gray-400 leading-relaxed">
                  Get deep literary analysis and insights from Arnold, our specialized AI assistant for editorial
                  content and storytelling.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-center space-x-2 text-purple-300">
                  <Zap className="w-4 h-4" />
                  <span className="text-sm">AI Literary Analysis</span>
                </div>
                <div className="text-gray-500 text-sm">
                  • Character & plot analysis
                  <br />• Theme & narrative insights
                  <br />• Interactive conversation
                </div>
              </div>

              <Button
                className={`w-full px-6 py-3 font-semibold rounded-xl transition-all duration-300 ${
                  hoveredOption === "arnold"
                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                    : "bg-purple-600/80 hover:bg-purple-600 text-white"
                }`}
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Start Analysis
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            You can always switch between video generation and Arnold analysis later
          </p>
        </div>
      </div>
    </div>
  )
}
