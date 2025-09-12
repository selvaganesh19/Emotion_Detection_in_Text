"use client"

import { useState } from "react"
import { Brain, Sparkles, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { Client } from "@gradio/client"

// Define response type for better type safety
type SentimentResponse = { label: string; confidences: any }[]
type SentimentResult = "Negative 😕" | "Neutral 😐" | "Positive 🙂" | "Error analyzing sentiment" | null

export default function SentimentAnalyzer() {
  const [inputText, setInputText] = useState("")
  const [result, setResult] = useState<SentimentResult>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [hasResult, setHasResult] = useState(false)

  const handleAnalyze = async () => {
    if (!inputText.trim()) return
    setIsLoading(true)
    setHasResult(false)

    try {
      // Connect to Gradio client
      console.log("🔹 Connecting to client...")
      const client = await Client.connect("selva1909/Emotion-Detection-in-Text")
      
      // Make prediction request
      console.log("🔹 Sending request:", inputText.trim())
      const response = await client.predict("/predict", {
        user_input: inputText.trim()
      })

      console.log("🔹 Raw response:", response)

      // Extract sentiment from response
      const data = response.data as SentimentResponse
      const predicted = data[0]?.label

      if (predicted) {
        console.log("✅ Predicted sentiment:", predicted)
        setResult(predicted as SentimentResult)
        setHasResult(true)
      } else {
        console.warn("⚠️ Invalid response:", data)
        setResult("Error analyzing sentiment")
        setHasResult(true)
      }
    } catch (error) {
      console.error("❌ Error:", error)
      setResult("Error analyzing sentiment")
      setHasResult(true)
    } finally {
      setIsLoading(false)
    }
  }

  const getSentimentIcon = (sentiment: SentimentResult) => {
    if (!sentiment) return <Minus className="w-8 h-8" />
    if (sentiment.includes("Positive")) return <TrendingUp className="w-8 h-8" />
    if (sentiment.includes("Negative")) return <TrendingDown className="w-8 h-8" />
    return <Minus className="w-8 h-8" />
  }

  const getSentimentColor = (sentiment: SentimentResult) => {
    if (!sentiment) return "text-yellow-500"
    if (sentiment.includes("Positive")) return "text-green-500"
    if (sentiment.includes("Negative")) return "text-red-500"
    return "text-yellow-500"
  }

  const getSentimentBg = (sentiment: SentimentResult) => {
    if (!sentiment) return "from-yellow-500/20 to-amber-500/20"
    if (sentiment.includes("Positive")) return "from-green-500/20 to-emerald-500/20"
    if (sentiment.includes("Negative")) return "from-red-500/20 to-rose-500/20"
    return "from-yellow-500/20 to-amber-500/20"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4 animate-pulse">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 animate-in slide-in-from-top duration-700">
            Sentiment Analyzer
          </h1>
          <p className="text-slate-300 animate-in slide-in-from-top duration-700 delay-200">
            Discover the emotional tone of your text with AI-powered analysis
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 animate-in slide-in-from-bottom duration-700 delay-300">
          {/* Input Section */}
          <div className="mb-6">
            <label htmlFor="inputText" className="block text-sm font-medium text-slate-200 mb-3">
              Enter your text for analysis
            </label>
            <textarea
              id="inputText"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type or paste your text here..."
              className="w-full h-32 px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 resize-none hover:bg-white/10"
              disabled={isLoading}
            />
            <div className="mt-2 text-right text-xs text-slate-400">{inputText.length} characters</div>
          </div>

          {/* Analyze Button */}
          <button
            onClick={handleAnalyze}
            disabled={!inputText.trim() || isLoading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-slate-500 disabled:to-slate-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl disabled:scale-100 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-3 relative overflow-hidden"
          >
            {isLoading && (
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/50 to-pink-600/50 animate-pulse" />
            )}
            <div className="relative flex items-center gap-3">
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 animate-pulse" />
                  Analyze Sentiment
                </>
              )}
            </div>
          </button>

          {/* Results Section */}
          <div className="mt-8">
            {hasResult && !isLoading && result && (
              <div
                className={`bg-gradient-to-r ${getSentimentBg(result)} rounded-xl p-6 border border-white/10 transform transition-all duration-500 animate-in slide-in-from-bottom-4 hover:scale-[1.02]`}
              >
                <div className="flex items-center justify-center mb-4">
                  <div
                    className={`${getSentimentColor(result)} transform transition-all duration-300 hover:scale-110 animate-in zoom-in duration-500`}
                  >
                    {getSentimentIcon(result)}
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-slate-200 mb-2">Analysis Result</h3>
                  <p
                    className={`text-2xl font-bold ${getSentimentColor(result)} capitalize animate-in slide-in-from-bottom duration-300 delay-200`}
                  >
                    {result}
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <button
                    onClick={() => {
                      setInputText("")
                      setHasResult(false)
                      setResult(null)
                    }}
                    className="w-full text-slate-300 hover:text-white transition-colors duration-200 text-sm"
                  >
                    Analyze another text →
                  </button>
                </div>
              </div>
            )}

            {!hasResult && !isLoading && (
              <div className="text-center py-8 text-slate-400 animate-in fade-in duration-500">
                <Brain className="w-12 h-12 mx-auto mb-3 opacity-50 animate-pulse" />
                <p>Enter some text above and click "Analyze Sentiment" to get started</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-slate-400 text-sm animate-in fade-in duration-700 delay-500">
          Powered by AI • Real-time sentiment analysis
        </div>
      </div>
    </div>
  )
}