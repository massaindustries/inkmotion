"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  CheckCircle,
  Circle,
  Loader2,
  FileText,
  ImageIcon,
  Film,
  Video,
  Mic,
  Layers,
  Zap,
  X,
  Brain,
  Activity,
  Code,
  Terminal,
} from "lucide-react"

interface AILabProgressWindowProps {
  currentStep: number
  inputText: string
  isBookCoverMode: boolean
  onCancel: () => void
}

const editorialWorkflowSteps = [
  {
    id: "elaborating",
    title: "Elaborating Text",
    description: "Analyzing and expanding narrative content",
    icon: FileText,
    color: "text-blue-400",
    bgColor: "bg-blue-400/10",
    gradientColors: "from-blue-900/20 via-blue-600/5 to-transparent",
    reasoning: [
      "Parsing semantic structure of input text...",
      "Identifying key narrative elements and themes...",
      "Expanding context with literary analysis...",
      "Generating comprehensive story framework...",
    ],
  },
  {
    id: "descriptions",
    title: "Creating Image Descriptions",
    description: "Generating visual scene descriptions",
    icon: ImageIcon,
    color: "text-purple-400",
    bgColor: "bg-purple-400/10",
    gradientColors: "from-purple-900/20 via-purple-600/5 to-transparent",
    reasoning: [
      "Translating narrative into visual concepts...",
      "Defining cinematographic elements...",
      "Creating detailed scene compositions...",
      "Optimizing for visual storytelling...",
    ],
  },
  {
    id: "scenes",
    title: "Creating Scenes",
    description: "Building cinematic scene compositions",
    icon: Film,
    color: "text-green-400",
    bgColor: "bg-green-400/10",
    gradientColors: "from-green-900/20 via-green-600/5 to-transparent",
    reasoning: [
      "Structuring narrative flow and pacing...",
      "Designing visual transitions...",
      "Establishing mood and atmosphere...",
      "Coordinating scene sequences...",
    ],
  },
  {
    id: "videos",
    title: "Creating Videos",
    description: "Generating video content and animations",
    icon: Video,
    color: "text-orange-400",
    bgColor: "bg-orange-400/10",
    gradientColors: "from-orange-900/20 via-orange-600/5 to-transparent",
    reasoning: [
      "Rendering high-definition video segments...",
      "Applying cinematic effects and filters...",
      "Synchronizing visual elements...",
      "Optimizing frame rates and quality...",
    ],
  },
  {
    id: "vocals",
    title: "Creating Vocals",
    description: "Synthesizing narration and dialogue",
    icon: Mic,
    color: "text-pink-400",
    bgColor: "bg-pink-400/10",
    gradientColors: "from-pink-900/20 via-pink-600/5 to-transparent",
    reasoning: [
      "Analyzing text for vocal emphasis...",
      "Generating natural speech patterns...",
      "Applying emotional intonation...",
      "Synchronizing with video timing...",
    ],
  },
  {
    id: "merging",
    title: "Merging",
    description: "Combining all elements together",
    icon: Layers,
    color: "text-cyan-400",
    bgColor: "bg-cyan-400/10",
    gradientColors: "from-cyan-900/20 via-cyan-600/5 to-transparent",
    reasoning: [
      "Synchronizing audio and video tracks...",
      "Balancing sound levels and mixing...",
      "Applying final color grading...",
      "Ensuring seamless transitions...",
    ],
  },
  {
    id: "rendering",
    title: "Rendering the Video",
    description: "Final processing and optimization",
    icon: Zap,
    color: "text-yellow-400",
    bgColor: "bg-yellow-400/10",
    gradientColors: "from-yellow-900/20 via-yellow-600/5 to-transparent",
    reasoning: [
      "Compiling final video output...",
      "Optimizing for multiple formats...",
      "Applying compression algorithms...",
      "Generating delivery-ready file...",
    ],
  },
]

export function AILabProgressWindow({ currentStep, inputText, isBookCoverMode, onCancel }: AILabProgressWindowProps) {
  const [animatedStep, setAnimatedStep] = useState(-1)
  const [currentReasoning, setCurrentReasoning] = useState(0)
  const [systemMetrics, setSystemMetrics] = useState({
    cpu: 0,
    memory: 0,
    gpu: 0,
  })
  const [showWindow, setShowWindow] = useState(false)

  useEffect(() => {
    // Window opening animation
    setTimeout(() => {
      setShowWindow(true)
    }, 100)

    const timer = setTimeout(() => {
      setAnimatedStep(currentStep)
    }, 800)
    return () => clearTimeout(timer)
  }, [currentStep])

  // Simulate AI reasoning progression
  useEffect(() => {
    if (currentStep >= 0 && currentStep < editorialWorkflowSteps.length) {
      const interval = setInterval(() => {
        setCurrentReasoning((prev) => (prev + 1) % editorialWorkflowSteps[currentStep].reasoning.length)
      }, 2000)
      return () => clearInterval(interval)
    }
  }, [currentStep])

  // Simulate system metrics
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemMetrics({
        cpu: 60 + Math.random() * 30,
        memory: 45 + Math.random() * 25,
        gpu: 70 + Math.random() * 25,
      })
    }, 1500)
    return () => clearInterval(interval)
  }, [])

  const currentStepData = editorialWorkflowSteps[currentStep]
  const currentGradient = currentStepData?.gradientColors || "from-blue-900/20 via-blue-600/5 to-transparent"

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      {/* AI Lab Window */}
      <div
        className={`bg-black border border-gray-800 rounded-2xl w-full max-w-6xl h-[90vh] overflow-hidden shadow-2xl transition-all duration-700 ${
          showWindow ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        {/* Dynamic background gradient based on current step */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${currentStepData?.color.replace(
              "text-",
              "var(--",
            )}, transparent 70%)`,
          }}
        />

        {/* Window Header */}
        <div className="relative flex items-center justify-between p-6 border-b border-gray-800 bg-black">
          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="flex items-center space-x-3">
              <Brain className="w-6 h-6 text-orange-400" />
              <span className="text-white font-semibold text-lg">MondadorAI Lab - Video Generation Engine</span>
            </div>
          </div>

          <Button onClick={onCancel} variant="ghost" className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex h-full">
          {/* Left Panel - System Metrics */}
          <div className="w-80 bg-black border-r border-gray-800 p-6 space-y-6 relative">
            {/* Terminal-like header */}
            <div className="flex items-center space-x-2 mb-4">
              <Terminal className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-sm font-mono">mondador_ai_system</span>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4 flex items-center">
                <Activity className="w-4 h-4 mr-2 text-green-400" />
                System Status
              </h3>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">CPU Usage</span>
                    <span className="text-green-400">{systemMetrics.cpu.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div
                      className="bg-green-400 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${systemMetrics.cpu}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Memory</span>
                    <span className="text-blue-400">{systemMetrics.memory.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div
                      className="bg-blue-400 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${systemMetrics.memory}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">GPU</span>
                    <span className="text-purple-400">{systemMetrics.gpu.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div
                      className="bg-purple-400 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${systemMetrics.gpu}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* AI Reasoning Panel */}
            <div>
              <h3 className="text-white font-semibold mb-4 flex items-center">
                <Code className="w-4 h-4 mr-2 text-orange-400" />
                AI Reasoning
              </h3>

              {currentStepData && (
                <div className="bg-black border border-gray-800 rounded-lg p-4 space-y-3">
                  <div className="flex items-center space-x-2">
                    <currentStepData.icon className={`w-4 h-4 ${currentStepData.color}`} />
                    <span className="text-white text-sm font-medium">{currentStepData.title}</span>
                  </div>

                  <div className="space-y-2 font-mono">
                    {currentStepData.reasoning.map((reason, index) => (
                      <div
                        key={index}
                        className={`text-xs transition-all duration-500 ${
                          index === currentReasoning
                            ? `${currentStepData.color} font-medium`
                            : index < currentReasoning
                              ? "text-gray-400"
                              : "text-gray-600"
                        }`}
                      >
                        {index === currentReasoning && (
                          <span className="inline-block w-4">
                            <span className="animate-pulse">▶</span>
                          </span>
                        )}
                        {index !== currentReasoning && <span className="inline-block w-4">$</span>}
                        {reason}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Input Preview */}
            <div>
              <h3 className="text-white font-semibold mb-4">Input Data</h3>
              <div className="bg-black border border-gray-800 rounded-lg p-4">
                <div className="text-xs text-gray-400 mb-2">
                  {isBookCoverMode ? "Book Cover Analysis" : "Text Input"}
                </div>
                <div className="text-xs text-gray-300 leading-relaxed">
                  {inputText.length > 150 ? `${inputText.substring(0, 150)}...` : inputText}
                </div>
              </div>
            </div>

            {/* Animated code lines in background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="text-green-500/10 text-xs font-mono whitespace-nowrap"
                  style={{
                    position: "absolute",
                    top: `${10 + i * 8}%`,
                    left: 0,
                    animation: `slideRight ${5 + i * 2}s linear infinite`,
                    animationDelay: `${i * 0.5}s`,
                  }}
                >
                  {`function processContent() { analyzeText(); generateVisuals(); return new Promise((resolve) => { setTimeout(() => resolve(result), 1000); }); }`}
                </div>
              ))}
            </div>
          </div>

          {/* Main Panel - Progress Steps */}
          <div className="flex-1 p-8 overflow-y-auto relative">
            {/* Dynamic gradient background based on current step */}
            <div className={`absolute inset-0 bg-gradient-radial ${currentGradient} opacity-30 pointer-events-none`} />

            <div className="space-y-6 relative z-10">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">AI Video Generation in Progress</h2>
                <p className="text-gray-400">
                  Advanced neural networks are processing your {isBookCoverMode ? "book cover" : "narrative"}
                </p>
              </div>

              {/* Current Step Highlight */}
              {currentStepData && (
                <div
                  className={`border-2 border-gray-800 rounded-2xl p-8 mb-8 relative overflow-hidden`}
                  style={{
                    background: `linear-gradient(135deg, rgba(0,0,0,0.9) 0%, ${currentStepData.color
                      .replace("text", "rgba")
                      .replace("400", "900/30")} 100%)`,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse" />

                  <div className="relative z-10 text-center">
                    <div className="flex justify-center mb-6">
                      <div className={`${currentStepData.color} p-6 rounded-full bg-black/50 relative`}>
                        <currentStepData.icon className="w-12 h-12" />
                        <div className="absolute inset-0 rounded-full border-2 border-current animate-ping opacity-30" />
                        <div className="absolute inset-0 rounded-full border border-current animate-pulse" />
                      </div>
                    </div>
                    <h3 className={`text-3xl font-bold ${currentStepData.color} mb-3`}>{currentStepData.title}</h3>
                    <p className="text-gray-300 text-lg">{currentStepData.description}</p>
                  </div>
                </div>
              )}

              {/* Progress Steps */}
              <div className="space-y-4">
                {editorialWorkflowSteps.map((step, index) => {
                  const isCompleted = index < animatedStep
                  const isCurrent = index === animatedStep
                  const isPending = index > animatedStep

                  return (
                    <div
                      key={step.id}
                      className={`flex items-center space-x-6 p-6 rounded-xl transition-all duration-700 ${
                        isCurrent
                          ? `border-2 border-gray-700 scale-[1.01]`
                          : isCompleted
                            ? "bg-black/40 border border-gray-800"
                            : "bg-black/20 border border-gray-900"
                      }`}
                      style={{
                        background: isCurrent
                          ? `linear-gradient(90deg, ${step.color.replace("text", "rgba").replace("400", "900/20")} 0%, black 100%)`
                          : undefined,
                      }}
                    >
                      <div className="flex-shrink-0 relative">
                        {isCompleted ? (
                          <div className="relative">
                            <CheckCircle className="w-8 h-8 text-green-400" />
                            <div className="absolute inset-0 rounded-full bg-green-400/20 animate-ping" />
                          </div>
                        ) : isCurrent ? (
                          <div className="relative">
                            <Loader2 className={`w-8 h-8 ${step.color} animate-spin`} />
                            <div
                              className={`absolute inset-0 rounded-full border ${step.color.replace("text-", "border-")} animate-pulse opacity-50`}
                            />
                          </div>
                        ) : (
                          <Circle className="w-8 h-8 text-gray-700" />
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-1">
                          <step.icon
                            className={`w-5 h-5 ${isCompleted ? "text-green-400" : isCurrent ? step.color : "text-gray-600"}`}
                          />
                          <div
                            className={`font-semibold text-lg ${
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

              {/* Progress Bar */}
              <div className="mt-8 space-y-3">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Overall Progress</span>
                  <span>{Math.round(((animatedStep + 1) / editorialWorkflowSteps.length) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-900 rounded-full h-4 overflow-hidden relative">
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out relative"
                    style={{
                      width: `${((animatedStep + 1) / editorialWorkflowSteps.length) * 100}%`,
                      background: currentStepData
                        ? `linear-gradient(90deg, ${currentStepData.color.replace("text-", "var(--")}, ${currentStepData.color.replace("text-", "var(--").replace("400", "600")})`
                        : "linear-gradient(90deg, var(--orange-500), var(--purple-500))",
                    }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes slideRight {
            from { transform: translateX(-100%); }
            to { transform: translateX(100%); }
          }
        `}</style>
      </div>
    </div>
  )
}
