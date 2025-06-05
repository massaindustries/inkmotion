"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, ArrowRight, Upload, ImageIcon, BookOpen, Wand2, FileText } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface EnhancedTextInputSectionProps {
  onSubmit: (text: string, fromBookCover?: boolean) => void
}

export function EnhancedTextInputSection({ onSubmit }: EnhancedTextInputSectionProps) {
  const [text, setText] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [isPdfProcessing, setIsPdfProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const pdfInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = () => {
    if (text.trim()) {
      onSubmit(text.trim(), false)
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
        // Use the extracted text from the book cover
        onSubmit(result.extractedText, true)
      } else {
        toast({
          title: "Error",
          description: "Failed to analyze book cover: " + result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error analyzing book cover",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handlePdfUpload = async (file: File) => {
    setIsPdfProcessing(true)

    try {
      const formData = new FormData()
      formData.append("pdf", file)

      const response = await fetch("/api/analyze-pdf", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (result.success) {
        setText(result.extractedText)
        toast({
          title: "PDF Processed",
          description: `Successfully extracted text from ${result.filename}`,
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to process PDF: " + result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error processing PDF file",
        variant: "destructive",
      })
    } finally {
      setIsPdfProcessing(false)
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

  const handlePdfSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handlePdfUpload(e.target.files[0])
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center space-x-2 text-orange-400 text-sm">
          <Sparkles className="w-4 h-4" />
          <span>AI-Powered Editorial Video Generation</span>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
          Create Videos from
          <br />
          <span className="text-gray-400">Text or Book Covers</span>
        </h1>

        <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
          Transform your literary content into engaging videos. Write your story or upload a book cover and let our AI
          create stunning promotional content.
        </p>
      </div>

      {/* Input Methods */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Text Input */}
        <Card className="bg-gray-900/50 border-gray-700 hover:border-orange-500/50 transition-all duration-300">
          <CardContent className="p-8 space-y-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-orange-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Write Your Story</h3>
            </div>

            <div className="relative">
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Describe your book, story, or narrative... Include plot details, characters, themes, and the mood you want to convey in the video."
                className="w-full min-h-[200px] bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-500 text-lg p-6 rounded-xl resize-none focus:border-orange-400 focus:ring-orange-400/20"
              />

              <div className="absolute top-3 right-3">
                <Button
                  onClick={() => pdfInputRef.current?.click()}
                  disabled={isPdfProcessing}
                  variant="outline"
                  size="sm"
                  className="bg-gray-800 border-gray-600 hover:bg-gray-700 hover:border-orange-500 text-gray-300 hover:text-orange-400 rounded-lg transition-all duration-200 flex items-center space-x-1"
                >
                  {isPdfProcessing ? (
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 rounded-full bg-orange-500 animate-pulse"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <>
                      <FileText className="w-4 h-4 mr-1" />
                      <span>Upload PDF</span>
                    </>
                  )}
                </Button>
                <input ref={pdfInputRef} type="file" accept=".pdf" onChange={handlePdfSelect} className="hidden" />
              </div>
            </div>

            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>Be as detailed as possible for best results</span>
              <span>{text.length} characters</span>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!text.trim()}
              className="w-full px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl text-lg transition-all duration-200 disabled:opacity-50"
            >
              <Wand2 className="w-5 h-5 mr-2" />
              Generate Video from Text
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </CardContent>
        </Card>

        {/* Book Cover Upload */}
        <Card className="bg-gray-900/50 border-gray-700 hover:border-purple-500/50 transition-all duration-300">
          <CardContent className="p-8 space-y-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Upload Book Cover</h3>
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
                  <div className="text-gray-400 text-sm">or click to browse files</div>
                  <div className="text-xs text-gray-500">Supports JPG, PNG, WebP</div>
                </div>
              )}
            </div>

            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />

            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isAnalyzing}
              variant="outline"
              className="w-full px-8 py-4 border-purple-500/50 text-purple-400 hover:bg-purple-500/10 rounded-xl text-lg"
            >
              <ImageIcon className="w-5 h-5 mr-2" />
              Choose Book Cover
            </Button>

            <div className="text-xs text-gray-500 text-center">
              AI will analyze the cover to extract story details and generate video content
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Features */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-gray-800">
        <div className="text-center space-y-2">
          <div className="text-2xl font-bold text-orange-400">AI Analysis</div>
          <div className="text-gray-400 text-sm">Smart content understanding</div>
        </div>
        <div className="text-center space-y-2">
          <div className="text-2xl font-bold text-purple-400">HD Quality</div>
          <div className="text-gray-400 text-sm">Professional video output</div>
        </div>
        <div className="text-center space-y-2">
          <div className="text-2xl font-bold text-blue-400">Fast Processing</div>
          <div className="text-gray-400 text-sm">Results in minutes</div>
        </div>
        <div className="text-center space-y-2">
          <div className="text-2xl font-bold text-green-400">Multiple Formats</div>
          <div className="text-gray-400 text-sm">Ready for all platforms</div>
        </div>
      </div>
    </div>
  )
}
