"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { ProgressTracker } from "@/components/progress-tracker"
import { VideoResult } from "@/components/video-result"
import { Sparkles, Video } from "lucide-react"

type GenerationState = "idle" | "processing" | "completed" | "error"

export function VideoGenerator() {
  const [text, setText] = useState("")
  const [state, setState] = useState<GenerationState>("idle")
  const [currentStep, setCurrentStep] = useState(0)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!text.trim()) return

    setState("processing")
    setCurrentStep(0)

    try {
      // Simulate the n8n workflow steps
      const steps = [
        "Analisi del testo...",
        "Generazione script...",
        "Creazione scene...",
        "Rendering video...",
        "Finalizzazione...",
      ]

      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(i)
        await new Promise((resolve) => setTimeout(resolve, 2000))
      }

      // Simulate n8n webhook call
      const response = await fetch("/api/generate-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      })

      const result = await response.json()

      if (result.success) {
        setVideoUrl(result.videoUrl)
        setState("completed")
      } else {
        setState("error")
      }
    } catch (error) {
      setState("error")
    }
  }

  const resetGenerator = () => {
    setState("idle")
    setCurrentStep(0)
    setVideoUrl(null)
    setText("")
  }

  if (state === "completed" && videoUrl) {
    return <VideoResult videoUrl={videoUrl} onReset={resetGenerator} />
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center space-x-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2 text-purple-300">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm">Powered by AI</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
          Trasforma il tuo{" "}
          <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Testo</span> in
          Video
        </h1>

        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Crea video professionali in pochi secondi utilizzando l'intelligenza artificiale. Inserisci il tuo testo e
          lascia che la magia accada.
        </p>
      </div>

      {/* Input Section */}
      {state === "idle" && (
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-8 space-y-6">
            <div className="space-y-3">
              <label htmlFor="text-input" className="text-lg font-medium text-white block">
                Inserisci il tuo testo
              </label>
              <Textarea
                id="text-input"
                placeholder="Scrivi qui il contenuto che vuoi trasformare in video..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-[120px] bg-slate-900/50 border-slate-600 text-white placeholder:text-gray-400 resize-none text-lg"
              />
            </div>

            <Button
              onClick={handleGenerate}
              disabled={!text.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 text-lg"
            >
              <Video className="w-5 h-5 mr-2" />
              Genera Video
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Progress Section */}
      {state === "processing" && <ProgressTracker currentStep={currentStep} />}

      {/* Error State */}
      {state === "error" && (
        <Card className="bg-red-900/20 border-red-500/30">
          <CardContent className="p-8 text-center space-y-4">
            <div className="text-red-400 text-lg">Si è verificato un errore durante la generazione del video.</div>
            <Button
              onClick={resetGenerator}
              variant="outline"
              className="border-red-500/30 text-red-400 hover:bg-red-500/10"
            >
              Riprova
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
