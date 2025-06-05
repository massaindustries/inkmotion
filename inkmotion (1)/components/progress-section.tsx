"use client"

import { useEffect, useState } from "react"
import { CheckCircle, Circle, Loader2, Brain, FileText, Video, Sparkles, Zap } from "lucide-react"

interface ProgressSectionProps {
  currentStep: number
  inputText: string
}

const workflowSteps = [
  {
    id: "analysis",
    title: "Text Analysis",
    description: "Understanding your content and extracting key themes",
    icon: Brain,
    color: "text-blue-400",
    bgColor: "bg-blue-400/10",
  },
  {
    id: "planning",
    title: "Content Planning",
    description: "Creating a structured narrative and scene breakdown",
    icon: FileText,
    color: "text-purple-400",
    bgColor: "bg-purple-400/10",
  },
  {
    id: "generation",
    title: "Scene Generation",
    description: "Generating visual elements and scene compositions",
    icon: Sparkles,
    color: "text-green-400",
    bgColor: "bg-green-400/10",
  },
  {
    id: "rendering",
    title: "Video Rendering",
    description: "Assembling scenes and applying visual effects",
    icon: Video,
    color: "text-orange-400",
    bgColor: "bg-orange-400/10",
  },
  {
    id: "processing",
    title: "Final Processing",
    description: "Optimizing and preparing your video for delivery",
    icon: Zap,
    color: "text-pink-400",
    bgColor: "bg-pink-400/10",
  },
]

export function ProgressSection({ currentStep, inputText }: ProgressSectionProps) {
  const [animatedStep, setAnimatedStep] = useState(-1)
  const [dots, setDots] = useState("")

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

  const currentStepData = workflowSteps[currentStep]

  return (
    <div className="w-full max-w-4xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center space-x-2 text-orange-400 text-sm">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Processing Your Request</span>
        </div>

        <h2 className="text-4xl font-bold text-white">Creating Your Video{dots}</h2>

        <p className="text-gray-400 max-w-2xl mx-auto">
          Our AI workflow is transforming your text into a stunning video. Each step is carefully optimized for the best
          results.
        </p>
      </div>

      {/* Current Step Highlight */}
      {currentStepData && (
        <div className={`${currentStepData.bgColor} border border-gray-700 rounded-2xl p-8 text-center`}>
          <div className="flex justify-center mb-4">
            <div className={`${currentStepData.color} p-4 rounded-full bg-gray-900/50`}>
              <currentStepData.icon className="w-8 h-8" />
            </div>
          </div>
          <h3 className={`text-2xl font-bold ${currentStepData.color} mb-2`}>{currentStepData.title}</h3>
          <p className="text-gray-300">{currentStepData.description}</p>
        </div>
      )}

      {/* Progress Steps */}
      <div className="space-y-6">
        {workflowSteps.map((step, index) => {
          const isCompleted = index < animatedStep
          const isCurrent = index === animatedStep
          const isPending = index > animatedStep

          return (
            <div
              key={step.id}
              className={`flex items-center space-x-6 p-6 rounded-xl transition-all duration-700 ${
                isCurrent
                  ? `${step.bgColor} border border-gray-600 scale-105`
                  : isCompleted
                    ? "bg-gray-900/30 border border-gray-700"
                    : "bg-gray-900/10 border border-gray-800"
              }`}
            >
              <div className="flex-shrink-0">
                {isCompleted ? (
                  <CheckCircle className="w-8 h-8 text-green-400" />
                ) : isCurrent ? (
                  <Loader2 className={`w-8 h-8 ${step.color} animate-spin`} />
                ) : (
                  <Circle className="w-8 h-8 text-gray-600" />
                )}
              </div>

              <div className="flex-1">
                <div
                  className={`font-semibold text-lg ${
                    isCompleted ? "text-green-400" : isCurrent ? step.color : "text-gray-500"
                  }`}
                >
                  {step.title}
                </div>
                <div
                  className={`text-sm ${
                    isCompleted ? "text-green-300/70" : isCurrent ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {step.description}
                </div>
              </div>

              {isCurrent && (
                <div className="flex space-x-1">
                  <div className={`w-2 h-2 ${step.color.replace("text-", "bg-")} rounded-full animate-pulse`} />
                  <div
                    className={`w-2 h-2 ${step.color.replace("text-", "bg-")} rounded-full animate-pulse`}
                    style={{ animationDelay: "0.2s" }}
                  />
                  <div
                    className={`w-2 h-2 ${step.color.replace("text-", "bg-")} rounded-full animate-pulse`}
                    style={{ animationDelay: "0.4s" }}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Progress Bar */}
      <div className="space-y-3">
        <div className="flex justify-between text-sm text-gray-400">
          <span>Overall Progress</span>
          <span>{Math.round(((animatedStep + 1) / workflowSteps.length) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-orange-500 to-pink-500 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${((animatedStep + 1) / workflowSteps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Input Preview */}
      <div className="bg-gray-900/30 border border-gray-700 rounded-xl p-6">
        <h4 className="text-white font-semibold mb-3">Your Input:</h4>
        <p className="text-gray-300 text-sm leading-relaxed">
          {inputText.length > 200 ? `${inputText.substring(0, 200)}...` : inputText}
        </p>
      </div>
    </div>
  )
}
