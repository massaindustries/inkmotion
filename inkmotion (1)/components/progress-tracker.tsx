"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Circle, Loader2 } from "lucide-react"

interface ProgressTrackerProps {
  currentStep: number
}

const steps = [
  {
    title: "Analisi del testo",
    description: "Elaborazione e comprensione del contenuto",
  },
  {
    title: "Generazione script",
    description: "Creazione della sceneggiatura per il video",
  },
  {
    title: "Creazione scene",
    description: "Generazione delle scene visive",
  },
  {
    title: "Rendering video",
    description: "Assemblaggio e rendering finale",
  },
  {
    title: "Finalizzazione",
    description: "Ottimizzazione e preparazione del video",
  },
]

export function ProgressTracker({ currentStep }: ProgressTrackerProps) {
  const [animatedStep, setAnimatedStep] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedStep(currentStep)
    }, 300)
    return () => clearTimeout(timer)
  }, [currentStep])

  return (
    <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
      <CardContent className="p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Generazione in corso...</h2>
          <p className="text-gray-300">Il tuo video sta prendendo forma</p>
        </div>

        <div className="space-y-6">
          {steps.map((step, index) => {
            const isCompleted = index < animatedStep
            const isCurrent = index === animatedStep
            const isPending = index > animatedStep

            return (
              <div
                key={index}
                className={`flex items-start space-x-4 transition-all duration-500 ${isCurrent ? "scale-105" : ""}`}
              >
                <div className="flex-shrink-0 mt-1">
                  {isCompleted ? (
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  ) : isCurrent ? (
                    <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-500" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div
                    className={`font-medium transition-colors duration-300 ${
                      isCompleted ? "text-green-400" : isCurrent ? "text-purple-400" : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </div>
                  <div
                    className={`text-sm transition-colors duration-300 ${
                      isCompleted ? "text-green-300/70" : isCurrent ? "text-purple-300/70" : "text-gray-400"
                    }`}
                  >
                    {step.description}
                  </div>
                </div>

                {isCurrent && (
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Progress Bar */}
        <div className="mt-8">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Progresso</span>
            <span>{Math.round((animatedStep / (steps.length - 1)) * 100)}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${(animatedStep / (steps.length - 1)) * 100}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
