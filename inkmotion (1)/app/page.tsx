"use client"
import { useState } from "react"
import { EnhancedLandingPage } from "@/components/enhanced-landing-page"
import { ChoiceWindow } from "@/components/choice-window"
import { AILabProgressWindow } from "@/components/ai-lab-progress-window"
import { VideoResultSection } from "@/components/video-result-section"
import { EnhancedGridOverlay } from "@/components/enhanced-grid-overlay"
import { FloatingEditorialElements } from "@/components/floating-editorial-elements"
import { ArnoldAILab } from "@/components/arnold-ai-lab"

type AppState = "landing" | "choice" | "processing" | "completed" | "error" | "arnold"

export default function HomePage() {
  const [appState, setAppState] = useState<AppState>("landing")
  const [inputText, setInputText] = useState("")
  const [currentStep, setCurrentStep] = useState(0)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isBookCoverMode, setIsBookCoverMode] = useState(false)

  const handleTextSubmit = async (text: string, fromBookCover = false) => {
    setInputText(text)
    setIsBookCoverMode(fromBookCover)
    setAppState("choice") // Show choice window instead of going directly to processing
  }

  const handleVideoGeneration = async () => {
    setAppState("processing")
    setCurrentStep(0)
    setError(null)

    try {
      const steps = [
        { name: "Elaborating Text", duration: 2500 },
        { name: "Creating Image Descriptions", duration: 3000 },
        { name: "Creating Scenes", duration: 3500 },
        { name: "Creating Videos", duration: 4000 },
        { name: "Creating Vocals", duration: 3000 },
        { name: "Merging", duration: 2500 },
        { name: "Rendering the Video", duration: 4000 },
      ]

      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(i)
        await new Promise((resolve) => setTimeout(resolve, steps[i].duration))
      }

      const response = await fetch("/api/generate-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: inputText,
          isBookCover: isBookCoverMode,
          type: isBookCoverMode ? "book_cover_analysis" : "text_input",
        }),
      })

      const result = await response.json()

      if (result.success) {
        setVideoUrl(result.videoUrl)
        setAppState("completed")
      } else {
        throw new Error(result.error || "Video generation failed")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
      setAppState("error")
    }
  }

  const handleArnoldAnalysis = () => {
    setAppState("arnold")
    // Arnold analysis functionality will be implemented next
  }

  const handleBackToChoice = () => {
    setAppState("choice")
  }

  const handleReset = () => {
    setAppState("landing")
    setInputText("")
    setCurrentStep(0)
    setVideoUrl(null)
    setError(null)
    setIsBookCoverMode(false)
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <EnhancedGridOverlay />
      <FloatingEditorialElements />

      {appState === "landing" && <EnhancedLandingPage onSubmit={handleTextSubmit} />}

      {appState === "choice" && (
        <ChoiceWindow
          inputText={inputText}
          isBookCoverMode={isBookCoverMode}
          onVideoGeneration={handleVideoGeneration}
          onArnoldAnalysis={handleArnoldAnalysis}
          onBack={handleReset}
        />
      )}

      {appState === "processing" && (
        <AILabProgressWindow
          currentStep={currentStep}
          inputText={inputText}
          isBookCoverMode={isBookCoverMode}
          onCancel={handleReset}
        />
      )}

      {appState === "completed" && videoUrl && <VideoResultSection videoUrl={videoUrl} onReset={handleReset} />}

      {appState === "arnold" && (
        <ArnoldAILab initialText={inputText} isBookCoverMode={isBookCoverMode} onClose={handleBackToChoice} />
      )}

      {appState === "error" && (
        <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
          <div className="text-center space-y-6">
            <div className="text-red-400 text-xl">{error}</div>
            <button
              onClick={handleReset}
              className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
