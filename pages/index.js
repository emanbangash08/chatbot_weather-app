import Head from "next/head"
import WeatherWidget from "@/components/WeatherWidget"
import DialogflowChat from "@/components/DialogflowChat"
import { Cloud, MessageCircle, Sparkles } from "lucide-react"

export default function Home() {
  return (
    <>
      <Head>
        <title>Smart Weather Assistant</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Get real-time weather information and chat with our AI assistant" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-100 to-indigo-200 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-200/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center p-6 space-y-8">
          {/* Header Section */}
          <header className="text-center space-y-4 mt-8 mb-4">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-sky-600 rounded-2xl shadow-lg">
                <Cloud className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-800 via-blue-600 to-sky-600 bg-clip-text text-transparent drop-shadow-sm">
                Smart Weather Assistant
              </h1>
              <div className="p-3 bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl shadow-lg">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-lg md:text-xl text-gray-700 font-medium">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              <p>Ask the chatbot anything about the weather in your city!</p>
              <Sparkles className="w-5 h-5 text-yellow-500" />
            </div>
          </header>

          {/* Main Content */}
          <div className="w-full max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Weather Widget Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-sky-600 rounded-full"></div>
                  <h2 className="text-2xl font-bold text-gray-800">Weather Overview</h2>
                </div>
                <div className="transform hover:scale-[1.02] transition-transform duration-300">
                  <WeatherWidget />
                </div>
              </div>

              {/* Chat Section */}
              <div className="space-y-4 lg:sticky lg:top-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-8 bg-gradient-to-b from-sky-500 to-blue-600 rounded-full"></div>
                  <h2 className="text-2xl font-bold text-gray-800">AI Weather Assistant</h2>
                </div>
                <div className="transform hover:scale-[1.02] transition-transform duration-300">
                  <DialogflowChat />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-16 text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 shadow-lg">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">
                Real-time weather data powered by OpenWeatherMap
              </span>
            </div>
          </footer>
        </div>

        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-300/40 rounded-full animate-bounce"
            style={{ animationDelay: "0s", animationDuration: "3s" }}
          ></div>
          <div
            className="absolute top-1/3 right-1/3 w-1 h-1 bg-sky-400/50 rounded-full animate-bounce"
            style={{ animationDelay: "1s", animationDuration: "4s" }}
          ></div>
          <div
            className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-blue-400/30 rounded-full animate-bounce"
            style={{ animationDelay: "2s", animationDuration: "5s" }}
          ></div>
          <div
            className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-sky-300/40 rounded-full animate-bounce"
            style={{ animationDelay: "0.5s", animationDuration: "3.5s" }}
          ></div>
        </div>
      </main>
    </>
  )
}
