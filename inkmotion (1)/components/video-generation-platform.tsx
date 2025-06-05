"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { EnhancedTextInputSection } from "@/components/enhanced-text-input-section"
import { EnhancedProgressSection } from "@/components/enhanced-progress-section"
import { VideoResultSection } from "@/components/video-result-section"

type AppState = "input" | "processing" | "completed" | "error"

interface VideoGenerationPlatformProps {
  onBackToHome: () => void
}

export function VideoGenerationPlatform({ onBackToHome }: VideoGenerationPlatformProps) {
  const [appState, setAppState] = useState<AppState>("input")
  const [inputText, setInputText] = useState("")
  const [currentStep, setCurrentStep] = useState(0)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isBookCoverMode, setIsBookCoverMode] = useState(false)

  const handleTextSubmit = async (text: string, fromBookCover = false) => {
    setInputText(text)
    setAppState("processing")
    setCurrentStep(0)
    setError(null)
    setIsBookCoverMode(fromBookCover)

    console.log("🚀 Starting video generation process...")
    console.log("📝 Text:", text.substring(0, 100) + (text.length > 100 ? "..." : ""))
    console.log("📚 Book cover mode:", fromBookCover)

    try {
      // Enhanced workflow steps for editorial content
      const steps = [
        { name: "Elaborating Text", duration: 2500 },
        { name: "Creating Image Descriptions", duration: 3000 },
        { name: "Creating Scenes", duration: 3500 },
        { name: "Creating Videos", duration: 4000 },
        { name: "Creating Vocals", duration: 3000 },
        { name: "Merging", duration: 2500 },
        { name: "Rendering the Video", duration: 4000 },
      ]

      // Start visual steps immediately while n8n processes
      const stepPromise = (async () => {
        for (let i = 0; i < steps.length; i++) {
          setCurrentStep(i)
          await new Promise((resolve) => setTimeout(resolve, steps[i].duration))
        }
      })()

      console.log("📡 Sending request to n8n and starting visual steps...")

      // Call n8n workflow (this will also start polling for the result)
      const response = await fetch("/api/generate-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          isBookCover: fromBookCover,
          type: fromBookCover ? "book_cover_analysis" : "text_input",
        }),
      })

      const result = await response.json()

      // Wait for visual steps to complete
      await stepPromise

      console.log("📊 API Response:", result)

      if (result.success) {
        console.log("✅ Video generation completed successfully!")
        console.log("🎬 Video URL:", result.videoUrl)
        setVideoUrl(result.videoUrl)
        setAppState("completed")
      } else {
        throw new Error(result.error || "Video generation failed")
      }
    } catch (err) {
      console.error("❌ Video generation error:", err)
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
      setAppState("error")
    }
  }

  const handleReset = () => {
    setAppState("input")
    setInputText("")
    setCurrentStep(0)
    setVideoUrl(null)
    setError(null)
    setIsBookCoverMode(false)
  }

  return (
    <div className="relative z-10 min-h-screen flex flex-col">
      <Navigation onBackToHome={onBackToHome} />

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        {appState === "input" && <EnhancedTextInputSection onSubmit={handleTextSubmit} />}

        {appState === "processing" && (
          <EnhancedProgressSection currentStep={currentStep} inputText={inputText} isBookCoverMode={isBookCoverMode} />
        )}

        {appState === "completed" && videoUrl && <VideoResultSection videoUrl={videoUrl} onReset={handleReset} />}

        {appState === "error" && (
          <div className="text-center space-y-6">
            <div className="text-red-400 text-xl">{error}</div>
            <button
              onClick={handleReset}
              className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
