"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Book, Video, Zap, Brain } from "lucide-react"

interface LandingPageProps {
  onGetStarted: () => void
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="relative z-10 min-h-screen">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
            <Book className="w-6 h-6 text-white" />
          </div>
          <span className="text-white font-bold text-2xl">MondadorAI</span>
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
          <Button onClick={onGetStarted} className="bg-orange-600 hover:bg-orange-700">
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-20 text-center">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="inline-flex items-center space-x-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-6 py-3 text-orange-300">
            <Zap className="w-5 h-5" />
            <span>Revolutionary Editorial AI Technology</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold text-white leading-tight">
            Transform Books into
            <br />
            <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              Cinematic Videos
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Harness the power of AI to convert book covers and narratives into stunning promotional videos. Perfect for
            publishers, authors, and literary enthusiasts.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
            <Button
              onClick={onGetStarted}
              className="px-10 py-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl text-lg"
            >
              Start Creating Videos
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              variant="outline"
              className="px-10 py-4 border-gray-600 text-gray-300 hover:bg-gray-800 rounded-xl text-lg"
            >
              Watch Demo
              <Video className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-20">
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
                <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto">
                  <Video className="w-8 h-8 text-blue-400" />
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
      <section id="technology" className="px-6 py-20 bg-gray-900/30">
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
                color: "bg-blue-500/10 text-blue-400",
              },
              {
                name: "n8n Workflows",
                description: "Automated processing pipeline",
                color: "bg-purple-500/10 text-purple-400",
              },
              { name: "Next.js 15", description: "Modern React framework", color: "bg-orange-500/10 text-orange-400" },
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
      <section className="px-6 py-20">
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
              <div className="text-4xl md:text-5xl font-bold text-blue-400">99%</div>
              <div className="text-gray-400">Success Rate</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold text-green-400">24/7</div>
              <div className="text-gray-400">AI Processing</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white">Ready to Transform Your Books?</h2>
          <p className="text-xl text-gray-400">
            Join the future of literary marketing with AI-powered video generation
          </p>
          <Button
            onClick={onGetStarted}
            className="px-12 py-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl text-xl"
          >
            Get Started Now
            <ArrowRight className="w-6 h-6 ml-2" />
          </Button>
        </div>
      </section>
    </div>
  )
}
