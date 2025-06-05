"use client"

import { Button } from "@/components/ui/button"
import { Download, Share2, RotateCcw, Play, CheckCircle, Info } from "lucide-react"

interface VideoResultSectionProps {
  videoUrl: string
  onReset: () => void
}

export function VideoResultSection({ videoUrl, onReset }: VideoResultSectionProps) {
  const handleDownload = () => {
    const link = document.createElement("a")
    link.href = videoUrl
    link.download = "ai-generated-video.mp4"
    link.click()
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My AI Generated Video",
          url: videoUrl,
        })
      } catch (error) {
        console.log("Share cancelled")
      }
    } else {
      navigator.clipboard.writeText(videoUrl)
      alert("Video link copied to clipboard!")
    }
  }

  // Check if this is a demo video
  const isDemoVideo = videoUrl.includes("commondatastorage.googleapis.com")

  return (
    <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-4xl mx-auto space-y-12">
        {/* Success Header */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center space-x-2 text-green-400 text-sm">
            <CheckCircle className="w-4 h-4" />
            <span>Video Generated Successfully</span>
          </div>

          <h2 className="text-5xl font-bold text-white">Your Video is Ready!</h2>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Your AI-generated video has been created and is ready for download. Share it with the world or create
            another masterpiece.
          </p>

          {/* Demo Mode Notice */}
          {isDemoVideo && (
            <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 text-blue-300">
              <Info className="w-4 h-8" />
              <span className="text-sm">Demo Mode - Configure n8n webhook for custom video generation</span>
            </div>
          )}
        </div>

        {/* Video Player */}
        <div className="bg-gray-900/30 border border-gray-700 rounded-2xl p-8 flex justify-center">
          <div className="w-full max-w-md">
            <div className="bg-gray-800 rounded-xl overflow-hidden relative group" style={{ aspectRatio: "9/16" }}>
              <video
                src={videoUrl}
                controls
                className="w-full h-full object-cover"
                poster="/placeholder.svg?height=640&width=360"
                playsInline
                preload="metadata"
              >
                Your browser does not support video playback.
              </video>

              {/* Play overlay for better UX */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <Play className="w-16 h-16 text-white/80" />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleDownload}
            className="px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl text-lg"
          >
            <Download className="w-5 h-5 mr-2" />
            Download Video
          </Button>

          <Button
            onClick={handleShare}
            variant="outline"
            className="px-8 py-4 border-gray-600 text-gray-300 hover:bg-gray-800 rounded-xl text-lg"
          >
            <Share2 className="w-5 h-5 mr-2" />
            Share Video
          </Button>

          <Button
            onClick={onReset}
            variant="outline"
            className="px-8 py-4 border-gray-600 text-gray-300 hover:bg-gray-800 rounded-xl text-lg"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Create New Video
          </Button>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-gray-800">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">✓</div>
            <div className="text-gray-400 text-sm">HD Quality</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">✓</div>
            <div className="text-gray-400 text-sm">AI Enhanced</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">✓</div>
            <div className="text-gray-400 text-sm">Ready to Share</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">✓</div>
            <div className="text-gray-400 text-sm">Commercial Use</div>
          </div>
        </div>

        {/* Configuration Help */}
        {isDemoVideo && (
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-6 text-center">
            <h3 className="text-blue-400 font-semibold mb-2">Configure Your n8n Webhook</h3>
            <p className="text-gray-400 text-sm mb-4">
              To generate custom videos from your content, configure your n8n webhook URL in the environment variables.
            </p>
            <div className="text-xs text-gray-500">
              Set N8N_WEBHOOK_URL in your Vercel environment variables to enable production video generation.
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
