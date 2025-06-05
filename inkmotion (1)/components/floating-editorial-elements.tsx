"use client"

import { useEffect, useState } from "react"
import { Book, BookOpen, Feather, Scroll, PenTool, FileText, Bookmark, Quote } from "lucide-react"

const editorialIcons = [
  { Icon: Book, color: "text-orange-400", size: "w-6 h-6" },
  { Icon: BookOpen, color: "text-blue-400", size: "w-7 h-7" },
  { Icon: Feather, color: "text-purple-400", size: "w-5 h-5" },
  { Icon: Scroll, color: "text-yellow-400", size: "w-6 h-6" },
  { Icon: PenTool, color: "text-green-400", size: "w-5 h-5" },
  { Icon: FileText, color: "text-pink-400", size: "w-6 h-6" },
  { Icon: Bookmark, color: "text-cyan-400", size: "w-5 h-5" },
  { Icon: Quote, color: "text-red-400", size: "w-6 h-6" },
]

export function FloatingEditorialElements() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating editorial icons */}
      {editorialIcons.map((item, index) => {
        const { Icon, color, size } = item
        const animationDelay = index * 0.5
        const animationDuration = 8 + (index % 3) * 2

        return (
          <div
            key={index}
            className={`absolute ${color} opacity-30`}
            style={{
              left: `${10 + ((index * 12) % 80)}%`,
              top: `${15 + ((index * 8) % 70)}%`,
              animation: `float ${animationDuration}s ease-in-out infinite`,
              animationDelay: `${animationDelay}s`,
            }}
          >
            <Icon className={size} />
          </div>
        )
      })}

      {/* Floating text elements */}
      <div className="absolute top-20 left-10 text-orange-400/20 text-sm font-serif animate-pulse">
        "Once upon a time..."
      </div>
      <div
        className="absolute top-1/3 right-20 text-purple-400/20 text-sm font-serif animate-pulse"
        style={{ animationDelay: "2s" }}
      >
        "Chapter One"
      </div>
      <div
        className="absolute bottom-1/3 left-1/4 text-blue-400/20 text-sm font-serif animate-pulse"
        style={{ animationDelay: "4s" }}
      >
        "The End"
      </div>

      {/* Animated particles */}
      {Array.from({ length: 15 }).map((_, i) => (
        <div
          key={`particle-${i}`}
          className="absolute w-1 h-1 bg-orange-400/30 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `twinkle ${3 + Math.random() * 2}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-10px) rotate(5deg); }
          50% { transform: translateY(-5px) rotate(-5deg); }
          75% { transform: translateY(-15px) rotate(3deg); }
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
      `}</style>
    </div>
  )
}
