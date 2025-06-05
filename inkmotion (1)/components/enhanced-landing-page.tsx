"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import {
  ArrowRight,
  Book,
  Video,
  Zap,
  Brain,
  BookOpen,
  ImageIcon,
  Upload,
  Camera,
  Wand2,
  Play,
  Sparkles,
  X,
  AlertCircle,
  FileText,
  Loader2,
  PenTool,
  Quote,
  Type,
  Edit3,
  Feather,
  BookMarked,
  Scroll,
  Bookmark,
  Trash2,
  CheckCircle,
} from "lucide-react"

interface EnhancedLandingPageProps {
  onSubmit: (text: string, fromBookCover?: boolean) => void
}

interface PdfAttachment {
  file: File
  summary: string
  filename: string
  fileSize: number
}

export function EnhancedLandingPage({ onSubmit }: EnhancedLandingPageProps) {
  const [text, setText] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [showDemo, setShowDemo] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [cameraLoading, setCameraLoading] = useState(false)

  const [isPdfLoading, setIsPdfLoading] = useState(false)
  const [pdfError, setPdfError] = useState<string | null>(null)
  const [pdfAttachment, setPdfAttachment] = useState<PdfAttachment | null>(null)
  const pdfInputRef = useRef<HTMLInputElement>(null)

  // Typewriter animation states
  const [displayText, setDisplayText] = useState("words")
  const [isDeleting, setIsDeleting] = useState(false)
  const [loopNum, setLoopNum] = useState(0)
  const [typingSpeed, setTypingSpeed] = useState(150)

  const words = ["words", "articles", "books", "thoughts", "poems"]

  useEffect(() => {
    const handleTyping = () => {
      // Current word based on loop number
      const i = loopNum % words.length
      const fullWord = words[i]

      // Set the display text based on whether we're deleting or typing
      setDisplayText((prev) => {
        if (isDeleting) {
          // Remove one character
          return fullWord.substring(0, prev.length - 1)
        } else {
          // Add one character
          return fullWord.substring(0, prev.length + 1)
        }
      })

      // Determine typing speed
      if (isDeleting) {
        setTypingSpeed(80) // Faster when deleting
      } else {
        setTypingSpeed(150) // Normal speed when typing
      }

      // If word is complete and not deleting, start deleting after a pause
      if (!isDeleting && displayText === fullWord) {
        setTimeout(() => {
          setIsDeleting(true)
        }, 1500) // Pause at complete word
      }

      // If finished deleting, move to next word
      if (isDeleting && displayText === "") {
        setIsDeleting(false)
        setLoopNum(loopNum + 1)
      }
    }

    // Set up the timer for the typing effect
    const timer = setTimeout(handleTyping, typingSpeed)

    // Clean up the timer
    return () => clearTimeout(timer)
  }, [displayText, isDeleting, loopNum, typingSpeed, words])

  const handleSubmit = () => {
    let contentToSubmit = text.trim()

    // Se c'è un allegato PDF, usa il suo riassunto invece del testo
    if (pdfAttachment) {
      contentToSubmit = pdfAttachment.summary
    }

    if (contentToSubmit) {
      onSubmit(contentToSubmit, false)
    }
  }

  const handleImageUpload = async (file: File) => {
    setIsAnalyzing(true)

    try {
      const formData = new FormData()
      formData.append("image", file)

      const response = await fetch("/api/analyze-book-cover", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (result.success) {
        onSubmit(result.extractedText, true)
      } else {
        alert("Failed to analyze book cover: " + result.error)
      }
    } catch (error) {
      alert("Error analyzing book cover")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handlePdfUpload = async (file: File) => {
    if (!file.type.includes("pdf")) {
      setPdfError("Please upload a PDF file")
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setPdfError("File size must be less than 10MB")
      return
    }

    setIsPdfLoading(true)
    setPdfError(null)

    try {
      const formData = new FormData()
      formData.append("pdf", file)

      const response = await fetch("/api/analyze-pdf", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (result.success) {
        setPdfAttachment({
          file,
          summary: result.summary,
          filename: result.filename,
          fileSize: result.fileSize,
        })
        // Pulisci il testo quando viene caricato un PDF
        setText("")
      } else {
        setPdfError(result.error || "Failed to process PDF file")
      }
    } catch (error) {
      console.error("Error processing PDF:", error)
      setPdfError("Failed to process PDF file")
    } finally {
      setIsPdfLoading(false)
    }
  }

  const handlePdfButtonClick = () => {
    pdfInputRef.current?.click()
  }

  const removePdfAttachment = () => {
    setPdfAttachment(null)
    setPdfError(null)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const startCamera = async () => {
    try {
      setCameraError(null)
      setCameraLoading(true)
      setShowCamera(true)

      console.log("🎥 Starting camera initialization...")

      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera not supported on this device or browser")
      }

      // Check if we're on HTTPS or localhost
      if (location.protocol !== "https:" && location.hostname !== "localhost" && location.hostname !== "127.0.0.1") {
        throw new Error("Camera requires HTTPS or localhost for security reasons")
      }

      const constraints = {
        video: {
          facingMode: "environment", // Prefer back camera
          width: { ideal: 1280, min: 640, max: 1920 },
          height: { ideal: 720, min: 480, max: 1080 },
        },
        audio: false,
      }

      console.log("📱 Requesting camera access with constraints:", constraints)

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      console.log("✅ Camera stream obtained successfully")

      if (videoRef.current) {
        videoRef.current.srcObject = stream

        // Create a promise to handle video loading
        const videoLoadPromise = new Promise<void>((resolve, reject) => {
          if (!videoRef.current) {
            reject(new Error("Video element not available"))
            return
          }

          const video = videoRef.current

          const onLoadedMetadata = () => {
            console.log("📹 Video metadata loaded successfully")
            video.removeEventListener("loadedmetadata", onLoadedMetadata)
            video.removeEventListener("error", onError)
            resolve()
          }

          const onError = (error: Event) => {
            console.error("❌ Video loading error:", error)
            video.removeEventListener("loadedmetadata", onLoadedMetadata)
            video.removeEventListener("error", onError)
            reject(new Error("Failed to load video"))
          }

          video.addEventListener("loadedmetadata", onLoadedMetadata)
          video.addEventListener("error", onError)

          // Set video properties
          video.playsInline = true
          video.muted = true
          video.autoplay = true
        })

        // Wait for video to load
        await videoLoadPromise

        // Now try to play the video
        try {
          await videoRef.current.play()
          console.log("▶️ Video playing successfully")
          setCameraStream(stream)
          setCameraLoading(false)
        } catch (playError) {
          console.error("❌ Error playing video:", playError)
          throw new Error("Failed to start video playback")
        }
      } else {
        throw new Error("Video element not found")
      }
    } catch (error) {
      console.error("❌ Camera initialization error:", error)
      setCameraLoading(false)

      let errorMessage = "Camera access failed"

      if (error instanceof Error) {
        switch (error.name) {
          case "NotAllowedError":
            errorMessage = "Camera permission denied. Please allow camera access and try again."
            break
          case "NotFoundError":
            errorMessage = "No camera found on this device."
            break
          case "NotSupportedError":
            errorMessage = "Camera not supported on this device."
            break
          case "NotReadableError":
            errorMessage = "Camera is already in use by another application."
            break
          case "OverconstrainedError":
            errorMessage = "Camera constraints could not be satisfied."
            break
          default:
            errorMessage = error.message
        }
      }

      setCameraError(errorMessage)

      // Clean up any partial stream
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop())
        setCameraStream(null)
      }
    }
  }

  const stopCamera = () => {
    console.log("🛑 Stopping camera...")

    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => {
        console.log("🔌 Stopping track:", track.kind, track.label)
        track.stop()
      })
      setCameraStream(null)
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null
      videoRef.current.load() // Reset video element
    }

    setShowCamera(false)
    setCameraError(null)
    setCameraLoading(false)
    console.log("✅ Camera stopped successfully")
  }

  const capturePhoto = () => {
    console.log("📸 Attempting to capture photo...")

    if (!videoRef.current || !canvasRef.current) {
      console.error("❌ Video or canvas ref not available")
      setCameraError("Camera not ready. Please try again.")
      return
    }

    const canvas = canvasRef.current
    const video = videoRef.current
    const context = canvas.getContext("2d")

    if (!context) {
      console.error("❌ Could not get canvas context")
      setCameraError("Canvas not supported")
      return
    }

    // Check if video is ready and has data
    if (video.readyState < 2) {
      console.error("❌ Video not ready, readyState:", video.readyState)
      setCameraError("Video not ready. Please wait a moment and try again.")
      return
    }

    if (video.videoWidth === 0 || video.videoHeight === 0) {
      console.error("❌ Video has no dimensions")
      setCameraError("Video not properly loaded. Please try again.")
      return
    }

    console.log("📐 Video dimensions:", video.videoWidth, "x", video.videoHeight)

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    try {
      // Clear canvas first
      context.clearRect(0, 0, canvas.width, canvas.height)

      // Draw the current video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height)
      console.log("🎨 Image drawn to canvas successfully")

      // Convert canvas to blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            console.log("📦 Blob created successfully:", blob.size, "bytes")
            const file = new File([blob], "book-cover.jpg", { type: "image/jpeg" })
            handleImageUpload(file)
            stopCamera()
          } else {
            console.error("❌ Failed to create blob from canvas")
            setCameraError("Failed to capture photo. Please try again.")
          }
        },
        "image/jpeg",
        0.9,
      )
    } catch (error) {
      console.error("❌ Error during photo capture:", error)
      setCameraError("Error capturing photo: " + (error instanceof Error ? error.message : "Unknown error"))
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type.startsWith("image/")) {
        handleImageUpload(file)
      }
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleImageUpload(e.target.files[0])
    }
  }

  // Cleanup camera on component unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [cameraStream])

  return (
    <div className="relative z-10 min-h-screen overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Floating Books */}
        <div className="absolute top-20 left-10 animate-float-slow opacity-20">
          <Book className="w-8 h-8 text-orange-400" />
        </div>
        <div className="absolute top-40 right-20 animate-float-medium opacity-15">
          <BookOpen className="w-12 h-12 text-purple-400" />
        </div>
        <div className="absolute bottom-40 left-20 animate-float-fast opacity-25">
          <BookMarked className="w-6 h-6 text-blue-400" />
        </div>

        {/* Floating Pens and Writing Tools */}
        <div className="absolute top-60 left-1/4 animate-drift-left opacity-20">
          <PenTool className="w-10 h-10 text-green-400" />
        </div>
        <div className="absolute top-80 right-1/3 animate-drift-right opacity-15">
          <Edit3 className="w-8 h-8 text-yellow-400" />
        </div>
        <div className="absolute bottom-60 right-10 animate-float-slow opacity-30">
          <Feather className="w-14 h-14 text-pink-400" />
        </div>

        {/* Typography Elements */}
        <div className="absolute top-32 left-1/2 animate-pulse-slow opacity-10">
          <Type className="w-16 h-16 text-indigo-400" />
        </div>
        <div className="absolute bottom-32 left-1/3 animate-bounce-slow opacity-20">
          <Quote className="w-12 h-12 text-red-400" />
        </div>

        {/* Scrolls and Documents */}
        <div className="absolute top-1/2 left-5 animate-sway opacity-15">
          <Scroll className="w-10 h-10 text-amber-400" />
        </div>
        <div className="absolute top-1/3 right-5 animate-rotate-slow opacity-20">
          <Bookmark className="w-8 h-8 text-cyan-400" />
        </div>

        {/* Floating Words */}
        <div className="absolute top-24 left-1/3 animate-fade-in-out opacity-30">
          <span className="text-2xl font-bold text-orange-300/40">Story</span>
        </div>
        <div className="absolute top-1/2 right-1/4 animate-fade-in-out-delayed opacity-25">
          <span className="text-xl font-bold text-purple-300/40">Create</span>
        </div>
        <div className="absolute bottom-1/3 left-1/2 animate-fade-in-out-slow opacity-20">
          <span className="text-3xl font-bold text-blue-300/40">Write</span>
        </div>

        {/* Punctuation Marks */}
        <div className="absolute top-1/4 right-1/2 animate-spin-slow opacity-15">
          <span className="text-6xl text-green-300/30">?</span>
        </div>
        <div className="absolute bottom-1/4 left-1/4 animate-bounce-gentle opacity-20">
          <span className="text-4xl text-yellow-300/40">!</span>
        </div>
        <div className="absolute top-3/4 right-1/3 animate-wiggle opacity-25">
          <span className="text-5xl text-pink-300/35">;</span>
        </div>

        {/* Additional Literary Elements */}
        <div className="absolute top-16 right-1/4 animate-float-medium opacity-10">
          <span className="text-lg font-serif text-indigo-300/50">"Once upon a time..."</span>
        </div>
        <div className="absolute bottom-16 left-1/2 animate-drift-left opacity-15">
          <span className="text-xl font-serif text-red-300/40">"The End"</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 relative z-20">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
            <Book className="w-6 h-6 text-white" />
          </div>
          <span className="text-white font-bold text-2xl">InkMotion</span>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-gray-300 hover:text-white transition-colors">
            Features
          </a>
          <a href="#technology" className="text-gray-300 hover:text-white transition-colors">
            Technology
          </a>
          <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">
            Pricing
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-12 text-center relative z-20">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="inline-flex items-center space-x-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-6 py-3 text-orange-300">
            <Zap className="w-5 h-5" />
            <span>Revolutionary Editorial AI Technology</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
            Transform your{" "}
            <span className="relative">
              <span className="inline-block min-w-[120px] md:min-w-[180px] text-left">
                <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                  {displayText}
                </span>
                <span className="animate-blink ml-1 border-r-4 border-orange-400"></span>
              </span>
            </span>
            <br />
            <span className="text-white">into</span>{" "}
            <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              Experiences
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Harness the power of AI to convert book covers and narratives into stunning promotional videos. Perfect for
            publishers, authors, and literary enthusiasts.
          </p>

          {/* Watch Demo Button */}
          <div className="pt-4">
            <Button
              onClick={() => setShowDemo(true)}
              className="px-8 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 rounded-xl text-lg transition-all duration-300"
            >
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Functional Section */}
      <section className="px-6 py-12 relative z-20">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Start Creating Now</h2>
            <p className="text-gray-400 text-lg">Choose your preferred method to begin video generation</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Text Input */}
            <Card className="bg-gray-900/50 border-gray-700 hover:border-orange-500/50 transition-all duration-300 backdrop-blur-sm">
              <CardContent className="p-8 space-y-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-orange-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Write Your Story</h3>
                </div>

                <div className="space-y-6">
                  {/* PDF Attachment Display */}
                  {pdfAttachment && (
                    <div className="bg-gray-800/50 border border-gray-600 rounded-xl p-4">
                      <div className="flex items-start space-x-3 mb-3">
                        <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5 text-green-400" />
                        </div>
                        <div className="flex-1 min-w-0 pr-4">
                          <div className="text-white font-medium break-words">{pdfAttachment.filename}</div>
                          <div className="text-gray-400 text-sm">{formatFileSize(pdfAttachment.fileSize)}</div>
                        </div>
                      </div>
                      <div className="mb-4 text-sm text-gray-300 bg-gray-700/30 rounded-lg p-3">
                        <strong>AI Summary:</strong> {pdfAttachment.summary}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-5 h-5 text-green-400" />
                          <span className="text-green-400 text-sm font-medium">PDF processed successfully</span>
                        </div>
                        <Button
                          onClick={removePdfAttachment}
                          variant="ghost"
                          size="sm"
                          className="text-gray-400 hover:text-red-400 hover:bg-red-400/10"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Text Area - disabled when PDF is attached */}
                  <Textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={
                      pdfAttachment
                        ? "PDF attached - AI summary will be used for video generation"
                        : "Describe your book, story, or narrative... Include plot details, characters, themes, and the mood you want to convey in the video."
                    }
                    disabled={!!pdfAttachment}
                    className={`w-full min-h-[160px] bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-500 text-lg p-6 rounded-xl resize-none focus:border-orange-400 focus:ring-orange-400/20 ${
                      pdfAttachment ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  />

                  <input
                    type="file"
                    ref={pdfInputRef}
                    accept=".pdf"
                    onChange={(e) => e.target.files?.[0] && handlePdfUpload(e.target.files[0])}
                    className="hidden"
                  />

                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>
                      {pdfAttachment
                        ? "PDF content will be analyzed by AI"
                        : "Be as detailed as possible for best results"}
                    </span>
                    {!pdfAttachment && <span>{text.length} characters</span>}
                  </div>

                  <div className="flex gap-4 items-center">
                    <Button
                      onClick={handlePdfButtonClick}
                      variant="outline"
                      className="flex items-center gap-2 bg-gray-800/50 border-gray-600 text-white hover:bg-orange-700/50 hover:border-orange-400/50 hover:text-white"
                      disabled={isPdfLoading}
                    >
                      {isPdfLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Analyzing PDF...
                        </>
                      ) : (
                        <>
                          <FileText className="w-4 h-4" />
                          {pdfAttachment ? "Replace PDF" : "Upload PDF"}
                        </>
                      )}
                    </Button>

                    {pdfError && <span className="text-red-400 text-sm">{pdfError}</span>}
                  </div>

                  <Button
                    onClick={handleSubmit}
                    disabled={!text.trim() && !pdfAttachment}
                    variant="orange"
                    className="w-full px-8 py-4 font-semibold rounded-xl text-lg transition-all duration-200 disabled:opacity-50"
                  >
                    <Wand2 className="w-5 h-5 mr-2" />
                    {pdfAttachment ? "Generate Video from PDF" : "Generate Video from Text"}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Book Cover Upload */}
            <Card className="bg-gray-900/50 border-gray-700 hover:border-purple-500/50 transition-all duration-300 backdrop-blur-sm">
              <CardContent className="p-8 space-y-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                    <ImageIcon className="w-5 h-5 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Upload or Capture Book Cover</h3>
                </div>

                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                    dragActive ? "border-purple-400 bg-purple-400/10" : "border-gray-600 hover:border-purple-400/50"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {isAnalyzing ? (
                    <div className="space-y-4">
                      <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto">
                        <Sparkles className="w-8 h-8 text-purple-400 animate-spin" />
                      </div>
                      <div className="text-purple-400 font-medium">Analyzing book cover...</div>
                      <div className="text-gray-400 text-sm">Extracting plot and themes</div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto">
                        <Upload className="w-8 h-8 text-purple-400" />
                      </div>
                      <div className="text-white font-medium">Drop your book cover here</div>
                      <div className="text-gray-400 text-sm">or use the buttons below</div>
                      <div className="text-xs text-gray-500">Supports JPG, PNG, WebP</div>
                    </div>
                  )}
                </div>

                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                <canvas ref={canvasRef} className="hidden" />

                <div className="grid grid-cols-2 gap-4">
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isAnalyzing}
                    variant="purple"
                    className="px-6 py-3 rounded-xl"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>

                  <Button
                    onClick={startCamera}
                    disabled={isAnalyzing}
                    variant="purple"
                    className="px-6 py-3 rounded-xl"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Camera
                  </Button>
                </div>

                <div className="text-xs text-gray-500 text-center">
                  AI will analyze the cover to extract story details and generate video content
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-20 relative z-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Powerful Features for Publishers</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Everything you need to create compelling video content from your literary works
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gray-900/50 border-gray-700 hover:border-orange-500/50 transition-all duration-300">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto">
                  <Book className="w-8 h-8 text-orange-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Book Cover Analysis</h3>
                <p className="text-gray-400">
                  Upload book covers and let AI extract plot details, themes, and visual elements automatically
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700 hover:border-orange-500/50 transition-all duration-300">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto">
                  <Brain className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white">AI Story Understanding</h3>
                <p className="text-gray-400">
                  Advanced AI comprehends narrative structure, characters, and emotional arcs
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700 hover:border-orange-500/50 transition-all duration-300">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                  <Video className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Cinematic Production</h3>
                <p className="text-gray-400">
                  Generate professional-quality videos with scenes, vocals, and cinematic effects
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section id="technology" className="px-6 py-20 bg-gray-900/30 relative z-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Cutting-Edge Technology Stack</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Built with the latest AI and web technologies for optimal performance
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: "OpenAI GPT-4",
                description: "Advanced text understanding",
                color: "bg-green-500/10 text-green-400",
              },
              {
                name: "Computer Vision",
                description: "Image analysis & recognition",
                color: "bg-purple-500/10 text-purple-400",
              },
              {
                name: "n8n Workflows",
                description: "Automated processing pipeline",
                color: "bg-orange-500/10 text-orange-400",
              },
              { name: "Next.js 15", description: "Modern React framework", color: "bg-pink-500/10 text-pink-400" },
            ].map((tech, index) => (
              <Card key={index} className="bg-gray-900/50 border-gray-700">
                <CardContent className="p-6 text-center space-y-3">
                  <div
                    className={`w-12 h-12 ${tech.color.split(" ")[0]} rounded-lg flex items-center justify-center mx-auto`}
                  >
                    <Zap className={`w-6 h-6 ${tech.color.split(" ")[1]}`} />
                  </div>
                  <h4 className="font-bold text-white">{tech.name}</h4>
                  <p className="text-sm text-gray-400">{tech.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 py-20 relative z-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold text-orange-400">1000+</div>
              <div className="text-gray-400">Videos Generated</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold text-purple-400">50+</div>
              <div className="text-gray-400">Publishers</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold text-green-400">99%</div>
              <div className="text-gray-400">Success Rate</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold text-yellow-400">24/7</div>
              <div className="text-gray-400">AI Processing</div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Modal */}
      {showDemo && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 max-w-4xl w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">Demo Video</h3>
              <Button onClick={() => setShowDemo(false)} variant="ghost" className="text-gray-400">
                <X className="w-6 h-6" />
              </Button>
            </div>
            <div className="aspect-video bg-gray-800 rounded-xl flex items-center justify-center">
              <div className="text-gray-400 text-center">
                <Video className="w-16 h-16 mx-auto mb-4" />
                <p>Demo video would be displayed here</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Camera Modal */}
      {showCamera && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-gray-900/95 border border-gray-700 rounded-2xl p-8 max-w-lg w-full backdrop-blur-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">Capture Book Cover</h3>
              <Button onClick={stopCamera} variant="destructive" className="rounded-lg p-2">
                <X className="w-6 h-6" />
              </Button>
            </div>

            <div className="relative rounded-xl overflow-hidden bg-black mb-8 border border-gray-700 aspect-[2/3] max-h-[400px] mx-auto">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                playsInline
                autoPlay
                muted
                style={{ transform: "scaleX(-1)" }} // Mirror for better UX
              />

              {/* Loading/Error overlay */}
              {(cameraLoading || cameraError || !cameraStream) && (
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                  <div className="text-center space-y-4 max-w-xs">
                    {cameraError ? (
                      <>
                        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
                          <AlertCircle className="w-8 h-8 text-red-400" />
                        </div>
                        <div className="text-red-400 font-medium">Camera Error</div>
                        <div className="text-gray-400 text-sm">{cameraError}</div>
                        <Button onClick={startCamera} variant="purple" className="px-4 py-2 rounded-lg">
                          Try Again
                        </Button>
                      </>
                    ) : cameraLoading ? (
                      <>
                        <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <div className="text-white font-medium">Starting camera...</div>
                        <div className="text-gray-400 text-sm">Please allow camera access</div>
                      </>
                    ) : (
                      <>
                        <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto">
                          <Camera className="w-8 h-8 text-purple-400" />
                        </div>
                        <div className="text-white font-medium">Camera Ready</div>
                        <div className="text-gray-400 text-sm">Position your book cover in the frame</div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Camera overlay guides */}
              {cameraStream && !cameraError && !cameraLoading && (
                <div className="absolute inset-0 pointer-events-none">
                  {/* Main capture frame */}
                  <div className="absolute inset-6 border-2 border-dashed border-purple-400/60 rounded-lg">
                    {/* Center content */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center space-y-3">
                        <BookOpen className="w-10 h-10 mx-auto text-purple-400/80" />
                        <div className="text-purple-400/80 text-sm font-medium">Position book cover here</div>
                      </div>
                    </div>
                  </div>

                  {/* Corner brackets */}
                  <div className="absolute top-6 left-6 w-8 h-8">
                    <div className="absolute top-0 left-0 w-6 h-1 bg-purple-400"></div>
                    <div className="absolute top-0 left-0 w-1 h-6 bg-purple-400"></div>
                  </div>
                  <div className="absolute top-6 right-6 w-8 h-8">
                    <div className="absolute top-0 right-0 w-6 h-1 bg-purple-400"></div>
                    <div className="absolute top-0 right-0 w-1 h-6 bg-purple-400"></div>
                  </div>
                  <div className="absolute bottom-6 left-6 w-8 h-8">
                    <div className="absolute bottom-0 left-0 w-6 h-1 bg-purple-400"></div>
                    <div className="absolute bottom-0 left-0 w-1 h-6 bg-purple-400"></div>
                  </div>
                  <div className="absolute bottom-6 right-6 w-8 h-8">
                    <div className="absolute bottom-0 right-0 w-6 h-1 bg-purple-400"></div>
                    <div className="absolute bottom-0 right-0 w-1 h-6 bg-purple-400"></div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center">
              <Button onClick={stopCamera} variant="outline" className="px-6 py-3 rounded-xl">
                Cancel
              </Button>

              <Button
                onClick={capturePhoto}
                disabled={!cameraStream || !!cameraError || cameraLoading}
                variant="purple"
                className="px-8 py-3 rounded-xl"
              >
                <Camera className="w-5 h-5 mr-2" />
                Capture Photo
              </Button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Position the book cover within the frame and ensure good lighting for best results
              </p>
              <p className="text-xs text-purple-400 mt-2">
                Camera requires HTTPS or localhost. Make sure to allow camera permissions.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
