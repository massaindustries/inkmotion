"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Download, Share2, RotateCcw, Play, CheckCircle } from "lucide-react"

interface VideoResultProps {
  videoUrl: string
  onReset: () => void
}

export function VideoResult({ videoUrl, onReset }: VideoResultProps) {
  const handleDownload = () => {
    const link = document.createElement("a")
    link.href = videoUrl
    link.download = "generated-video.mp4"
    link.click()
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Il mio video generato con MondadorAI",
          url: videoUrl,
        })
      } catch (error) {
        console.log("Condivisione annullata")
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(videoUrl)
      alert("Link copiato negli appunti!")
    }
  }

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      {/* Vertical 9:16 Window */}
      <div
        className="bg-slate-900/90 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden"
        style={{
          width: "420px",
          height: "747px", // 9:16 aspect ratio (420 * 16/9 = 747)
          maxWidth: "90vw",
          maxHeight: "90vh",
        }}
      >
        {/* Header Section */}
        <div className="p-6 text-center space-y-4">
          {/* Success Badge */}
          <div className="inline-flex items-center space-x-2 bg-green-500/10 border border-green-500/30 rounded-full px-4 py-2 text-green-400">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Video Generated Successfully</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-white">Your Video is Ready!</h1>

          {/* Subtitle */}
          <p className="text-gray-400 text-sm leading-relaxed">
            Your AI-generated video has been created and is ready for download.
            <br />
            Share it with the world or create another masterpiece.
          </p>
        </div>

        {/* Video Player Section - Takes most of the vertical space */}
        <div className="px-6 flex-1">
          <Card className="bg-slate-800/50 border-slate-700/50 h-full">
            <CardContent className="p-4 h-full">
              <div
                className="bg-black rounded-lg overflow-hidden shadow-inner h-full relative"
                style={{ aspectRatio: "9/16" }}
              >
                <video
                  src={videoUrl}
                  controls
                  className="w-full h-full object-cover"
                  poster="/placeholder.svg?height=640&width=360"
                  playsInline
                  preload="metadata"
                >
                  Il tuo browser non supporta la riproduzione video.
                </video>

                {/* Play overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                  <div className="bg-black/60 rounded-full p-3">
                    <Play className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons Section */}
        <div className="p-6 space-y-3">
          {/* Primary Download Button */}
          <Button
            onClick={handleDownload}
            className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
          >
            <Download className="w-5 h-5 mr-2" />
            Download Video
          </Button>

          {/* Secondary Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleShare}
              variant="outline"
              className="flex-1 border-slate-600 text-white hover:bg-slate-700 py-3 px-4 rounded-xl bg-slate-800/50"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share Video
            </Button>

            <Button
              onClick={onReset}
              variant="outline"
              className="flex-1 border-slate-600 text-white hover:bg-slate-700 py-3 px-4 rounded-xl bg-slate-800/50"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Create New Video
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
