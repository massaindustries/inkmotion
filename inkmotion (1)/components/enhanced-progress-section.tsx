"use client"

import { useEffect, useState } from "react"
import { CheckCircle, Circle, Loader2, FileText, ImageIcon, Film, Video, Mic, Layers, Zap } from "lucide-react"

interface EnhancedProgressSectionProps {
  currentStep: number
  inputText: string
  isBookCoverMode: boolean
}

const editorialWorkflowSteps = [
  {
    id: "elaborating",
    title: "Elaborating Text",
    description: "Analyzing and expanding narrative content",
    icon: FileText,
    color: "text-blue-400",
    bgColor: "bg-blue-400/10",
    details: "Processing story elements, characters, and themes",
  },
  {
    id: "descriptions",
    title: "Creating Image Descriptions",
    description: "Generating visual scene descriptions",
    icon: ImageIcon,
    color: "text-purple-400",
    bgColor: "bg-purple-400/10",
    details: "Crafting detailed visual narratives for each scene",
  },
  {
    id: "scenes",
    title: "Creating Scenes",
    description: "Building cinematic scene compositions",
    icon: Film,
    color: "text-green-400",
    bgColor: "bg-green-400/10",
    details: "Structuring visual storytelling sequences",
  },
  {
    id: "videos",
    title: "Creating Videos",
    description: "Generating video content and animations",
    icon: Video,
    color: "text-orange-400",
    bgColor: "bg-orange-400/10",
    details: "Producing high-quality video segments",
  },
  {
    id: "vocals",
    title: "Creating Vocals",
    description: "Synthesizing narration and dialogue",
    icon: Mic,
    color: "text-pink-400",
    bgColor: "bg-pink-400/10",
    details: "Adding professional voice-over and sound",
  },
  {
    id: "merging",
    title: "Merging",
    description: "Combining all elements together",
    icon: Layers,
    color: "text-cyan-400",
    bgColor: "bg-cyan-400/10",
    details: "Synchronizing video, audio, and effects",
  },
  {
    id: "rendering",
    title: "Rendering the Video",
    description: "Final processing and optimization",
    icon: Zap,
    color: "text-yellow-400",
    bgColor: "bg-yellow-400/10",
    details: "Exporting in high-definition format",
  },
]

export function EnhancedProgressSection({ currentStep, inputText, isBookCoverMode }: EnhancedProgressSectionProps) {
  const [animatedStep, setAnimatedStep] = useState(-1)
  const [dots, setDots] = useState("")
  const [processingDetails, setProcessingDetails] = useState("")

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedStep(currentStep)
    }, 500)
    return () => clearTimeout(timer)
  }, [currentStep])

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."))
    }, 500)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (currentStep >= 0 && currentStep < editorialWorkflowSteps.length) {
      setProcessingDetails(editorialWorkflowSteps[currentStep].details)
    }
  }, [currentStep])

  const currentStepData = editorialWorkflowSteps[currentStep]

  return (
    <div className="w-full max-w-5xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center space-x-2 text-orange-400 text-sm">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>{isBookCoverMode ? "Processing Book Cover" : "Processing Text"}</span>
        </div>

        <h2 className="text-4xl md:text-5xl font-bold text-white">Creating Your Editorial Video{dots}</h2>

        <p className="text-gray-400 max-w-3xl mx-auto text-lg">
          Our advanced AI workflow is transforming your {isBookCoverMode ? "book cover" : "narrative"} into a
          professional promotional video with cinematic quality.
        </p>
      </div>

      {/* Current Step Highlight */}
      {currentStepData && (
        <div
          className={`${currentStepData.bgColor} border border-gray-600 rounded-2xl p-8 text-center relative overflow-hidden`}
        >
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse" />

          <div className="relative z-10">
            <div className="flex justify-center mb-6">
              <div className={`${currentStepData.color} p-6 rounded-full bg-gray-900/50 relative`}>
                <currentStepData.icon className="w-10 h-10" />
                <div className="absolute inset-0 rounded-full border-2 border-current animate-ping opacity-30" />
              </div>
            </div>
            <h3 className={`text-3xl font-bold ${currentStepData.color} mb-3`}>{currentStepData.title}</h3>
            <p className="text-gray-300 text-lg mb-2">{currentStepData.description}</p>
            <p className="text-gray-400 text-sm">{processingDetails}</p>
          </div>
        </div>
      )}

      {/* Progress Steps Grid */}
      <div className="grid gap-4">
        {editorialWorkflowSteps.map((step, index) => {
          const isCompleted = index < animatedStep
          const isCurrent = index === animatedStep
          const isPending = index > animatedStep

          return (
            <div
              key={step.id}
              className={`flex items-center space-x-6 p-6 rounded-xl transition-all duration-700 ${
                isCurrent
                  ? `${step.bgColor} border-2 border-gray-500 scale-[1.02] shadow-lg`
                  : isCompleted
                    ? "bg-gray-900/40 border border-gray-600"
                    : "bg-gray-900/20 border border-gray-800"
              }`}
            >
              <div className="flex-shrink-0 relative">
                {isCompleted ? (
                  <div className="relative">
                    <CheckCircle className="w-10 h-10 text-green-400" />
                    <div className="absolute inset-0 rounded-full bg-green-400/20 animate-ping" />
                  </div>
                ) : isCurrent ? (
                  <div className="relative">
                    <Loader2 className={`w-10 h-10 ${step.color} animate-spin`} />
                    <div
                      className={`absolute inset-0 rounded-full border-2 ${step.color.replace("text-", "border-")} animate-pulse opacity-50`}
                    />
                  </div>
                ) : (
                  <Circle className="w-10 h-10 text-gray-600" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3 mb-1">
                  <step.icon
                    className={`w-5 h-5 ${isCompleted ? "text-green-400" : isCurrent ? step.color : "text-gray-600"}`}
                  />
                  <div
                    className={`font-bold text-lg ${
                      isCompleted ? "text-green-400" : isCurrent ? step.color : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </div>
                </div>
                <div
                  className={`text-sm ${
                    isCompleted ? "text-green-300/80" : isCurrent ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {step.description}
                </div>
                {isCurrent && <div className="text-xs text-gray-400 mt-1 italic">{step.details}</div>}
              </div>

              {isCurrent && (
                <div className="flex space-x-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 ${step.color.replace("text-", "bg-")} rounded-full animate-pulse`}
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </div>
              )}

              {isCompleted && <div className="text-green-400 text-sm font-medium">✓ Complete</div>}
            </div>
          )
        })}
      </div>

      {/* Enhanced Progress Bar */}
      <div className="space-y-4">
        <div className="flex justify-between text-sm text-gray-400">
          <span>Editorial Processing Progress</span>
          <span>{Math.round(((animatedStep + 1) / editorialWorkflowSteps.length) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-4 overflow-hidden relative">
          <div
            className="h-full bg-gradient-to-r from-orange-500 via-purple-500 to-pink-500 rounded-full transition-all duration-1000 ease-out relative"
            style={{ width: `${((animatedStep + 1) / editorialWorkflowSteps.length) * 100}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Input Preview */}
      <div className="bg-gray-900/40 border border-gray-700 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-orange-500/10 rounded-lg flex items-center justify-center">
            {isBookCoverMode ? (
              <ImageIcon className="w-4 h-4 text-orange-400" />
            ) : (
              <FileText className="w-4 h-4 text-orange-400" />
            )}
          </div>
          <h4 className="text-white font-semibold">
            {isBookCoverMode ? "Extracted from Book Cover:" : "Your Story Input:"}
          </h4>
        </div>
        <p className="text-gray-300 text-sm leading-relaxed">
          {inputText.length > 300 ? `${inputText.substring(0, 300)}...` : inputText}
        </p>
      </div>
    </div>
  )
}
