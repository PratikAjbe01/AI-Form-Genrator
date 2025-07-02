"use client"

import { SignInButton, useUser } from "@clerk/nextjs"
import { ArrowRight, Zap, Eye, BarChart3, Sparkles, Rocket, Users, Github, Linkedin, Mail, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import analytics from "../../demo/analytics.png"
import formEdit from "../../demo/form-edit.png"
import razorpay from "../../demo/razorpay.png"
import summary from "../../demo/summary.png"

function EnhancedHero() {
  const { isSignedIn } = useUser()

  // Array of demo images with proper names and descriptions
  const demoImages = [
    { src: formEdit, alt: "Form Editor", title: "Form Editor" },
    { src: analytics, alt: "Analytics Dashboard", title: "Analytics" },
    { src: razorpay, alt: "Payment Integration", title: "Payments" },
    { src: summary, alt: "AI Summary", title: "AI Summary" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4 mr-2" />
                AI-Powered Form Builder
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Build Any Form in
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {" "}
                  Seconds{" "}
                </span>
                with AI
              </h1>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Say goodbye to tedious form creation. Our AI-powered builder crafts custom forms instantly, so you can
                focus on what matters most: your business.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                {isSignedIn ? (
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg"
                    asChild
                  >
                    <a href="/dashboard">
                      <Zap className="w-5 h-5 mr-2" />
                      Create AI Form
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </a>
                  </Button>
                ) : (
                  <SignInButton mode="modal">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg"
                    >
                      <Zap className="w-5 h-5 mr-2" />
                      Create AI Form
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </SignInButton>
                )}

                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-gray-300 hover:border-blue-500 px-8 py-4 text-lg bg-transparent"
                >
                  See How it Works
                </Button>
              </div>

              <div className="mt-12 flex items-center justify-center lg:justify-start space-x-8 text-sm text-gray-500">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  10,000+ users
                </div>
                <div className="flex items-center">
                  <Rocket className="w-4 h-4 mr-2" />
                  50,000+ forms created
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-3xl blur-3xl opacity-20 animate-pulse" />
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                <div className="space-y-4">
                  <div className="h-4 bg-gradient-to-r from-blue-200 to-purple-200 rounded animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="h-12 bg-blue-100 rounded-lg animate-pulse" />
                    <div className="h-12 bg-purple-100 rounded-lg animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How AI Forms Work Section */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How AI Forms Are Generated & Deployed Live</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our intelligent system transforms your ideas into fully functional forms in seconds
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 border-blue-100 hover:border-blue-300 transition-colors">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4">AI Generation</h3>
                <p className="text-gray-600">
                  Describe your form requirements in plain English. Our AI understands context and creates the perfect
                  form structure.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-100 hover:border-purple-300 transition-colors">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Eye className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Live Preview</h3>
                <p className="text-gray-600">
                  See your form come to life instantly. Edit, customize, and perfect your form with real-time visual
                  feedback.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-100 hover:border-green-300 transition-colors">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Rocket className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Instant Deploy</h3>
                <p className="text-gray-600">
                  Deploy your form with one click. Get a shareable link and start collecting responses immediately.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Edit, Analyze & Optimize</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Complete form management with powerful editing tools and intelligent analytics
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Eye className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Real-time Editing</h3>
                  <p className="text-gray-600">
                    Modify your forms on the fly with our intuitive drag-and-drop editor. See changes instantly.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Response Analytics</h3>
                  <p className="text-gray-600">
                    View detailed analytics of form submissions with charts, graphs, and exportable data.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">AI Summary</h3>
                  <p className="text-gray-600">
                    Get intelligent insights and summaries of your form responses powered by AI analysis.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Form Analytics</h4>
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                  </div>
                  <div className="h-32 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-12 h-12 text-gray-400" />
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">1,234</div>
                      <div className="text-sm text-gray-500">Responses</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">89%</div>
                      <div className="text-sm text-gray-500">Completion</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">4.8</div>
                      <div className="text-sm text-gray-500">Rating</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Screenshots Section */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">See Our Platform in Action</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore the powerful features that make form building effortless and intelligent
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {demoImages.map((demo, index) => (
              <Card
                key={index}
                className="border-2 border-gray-200 hover:border-blue-400 transition-all duration-300 hover:shadow-lg group"
              >
                <CardContent className="p-4">
                  <div className="relative overflow-hidden rounded-lg bg-gray-50 mb-4">
                    <Image
                      src={demo.src || "/placeholder.svg"}
                      alt={demo.alt}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                      width={300}
                      height={200}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{demo.title}</h3>
                  <p className="text-sm text-gray-600">{demo.alt}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <span className="text-lg">Made with</span>
              <Heart className="w-5 h-5 mx-2 text-red-500 fill-current" />
              <span className="text-lg">by our team</span>
            </div>

            <div className="flex items-center justify-center space-x-6">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
              >
                <Github className="w-6 h-6" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
              >
                <Linkedin className="w-6 h-6" />
              </a>
              <a
                href="mailto:contact@example.com"
                className="p-3 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
              >
                <Mail className="w-6 h-6" />
              </a>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-800 text-sm text-gray-400">
              <p>&copy; 2024 AI Form Builder. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default EnhancedHero
