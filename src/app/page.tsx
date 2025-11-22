"use client"

import { useState, useEffect } from "react"
import { UploadZone } from "@/components/upload-zone"
import { Button } from "@/components/ui/button"
import { Loader2, Download, Share2, Sparkles, History, Trash2, X, Copy, Check, ArrowLeftRight, RotateCcw, Instagram } from "lucide-react"
import Image from "next/image"
import { PolaroidCamera } from "@/components/polaroid-camera"
import { motion, AnimatePresence } from "framer-motion"

import { db, HistoryItem } from "@/lib/storage"

import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()
  const [isUploading, setIsUploading] = useState(false)
  const [result, setResult] = useState<{ description: string, images: string[] } | null>(null)
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [copied, setCopied] = useState(false)

  // Animation states
  const [showCamera, setShowCamera] = useState(false)
  const [cameraFinished, setCameraFinished] = useState(false)
  const [showComparison, setShowComparison] = useState(false)

  // Load history from IndexedDB on mount
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const saved = await db.getHistory()
        if (saved) {
          setHistory(saved)
        }
      } catch (e) {
        console.error('Failed to load history:', e)
      }
    }
    loadHistory()
  }, [])

  const handleAnimationComplete = () => {
    setCameraFinished(true)
  }

  useEffect(() => {
    const saveAndRedirect = async () => {
      if (result && result.images && result.images.length > 0) {
        console.log("Result available, saving to DB...")
        try {
          // Save to IndexedDB for the result page
          await db.set("latest_result", result.images[0])
          console.log("Saved latest_result")

          if (originalImage) {
            await db.set("latest_original", originalImage)
            console.log("Saved latest_original")
          }

          // Add to history
          const newHistoryItem: HistoryItem = {
            id: Date.now().toString(),
            image: result.images[0],
            timestamp: Date.now(),
            originalImage: originalImage || undefined,
            description: result.description
          }

          await db.addHistory(newHistoryItem)
          console.log("Saved history")

          // Update local state (optional, as we redirect)
          setHistory(prev => [newHistoryItem, ...prev])

          // Navigate to result page
          console.log("Redirecting to /result")
          router.push("/result")
        } catch (error) {
          console.error("Failed to save result:", error)
          alert("Failed to save result. Please try again.")
        }
      }
    }

    saveAndRedirect()
  }, [result, originalImage, router])

  // Delete from history
  const deleteFromHistory = async (id: string) => {
    await db.deleteHistory(id)
    setHistory(history.filter(item => item.id !== id))
  }

  // Clear all history
  const clearHistory = async () => {
    await db.clearHistory()
    setHistory([])
  }

  const handleFileSelect = async (file: File) => {
    // Reset states
    setResult(null)
    setCameraFinished(false)
    setShowCamera(true)
    setIsUploading(true)

    // Read original image as base64
    const getBase64 = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = error => reject(error)
      })
    }

    let base64Original = ""
    try {
      base64Original = await getBase64(file)
      setOriginalImage(base64Original)
    } catch (e) {
      console.error("Failed to read file", e)
    }

    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (data.success && data.images && data.images.length > 0) {
        // Wait a bit to ensure camera animation is smooth
        setTimeout(() => {
          setResult(data)
          setIsUploading(false)
          // History saving is now handled by the useEffect when result changes
        }, 1000)
      } else {
        console.error("Upload failed:", data.error)
        alert(`Generation failed: ${data.error}`)
        setIsUploading(false)
        setShowCamera(false)
      }
    } catch (error) {
      console.error("Error uploading:", error)
      alert("Upload error, please try again")
      setIsUploading(false)
      setShowCamera(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Flash Effect Overlay */}
      {cameraFinished && result && <div className="flash-effect" />}

      {/* Header */}
      <header className="p-6 flex items-center justify-between relative z-50 max-w-7xl mx-auto w-full">
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => { setResult(null); setShowCamera(false); setIsUploading(false); setCameraFinished(false); }}
        >
          <div className="w-12 h-12 bg-[#FF6B6B] rounded-full flex items-center justify-center border-[3px] border-[#2D3436] shadow-[4px_4px_0px_#2D3436] group-hover:scale-110 transition-transform">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-heading font-bold text-[#2D3436] tracking-tight group-hover:text-[#FF6B6B] transition-colors">
            AI Polaroid
          </h1>
        </div>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="btn-retro-secondary"
        >
          <History className="w-5 h-5" />
          History ({history.length})
        </button>
      </header>

      {/* History Panel */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#2D3436]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, rotate: -2 }}
              animate={{ scale: 1, y: 0, rotate: 0 }}
              exit={{ scale: 0.9, y: 20, rotate: 2 }}
              className="bg-[#FDFBF7] rounded-3xl border-[4px] border-[#2D3436] shadow-[10px_10px_0px_#2D3436] max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b-[3px] border-[#2D3436] flex items-center justify-between bg-white">
                <h2 className="text-3xl font-heading font-bold text-[#2D3436]">My Collection</h2>
                <div className="flex gap-3">
                  {history.length > 0 && (
                    <button
                      onClick={clearHistory}
                      className="px-4 py-2 rounded-full border-[3px] border-[#2D3436] font-bold hover:bg-red-100 transition-colors flex items-center gap-2 text-[#2D3436]"
                    >
                      <Trash2 className="w-4 h-4" />
                      Clear All
                    </button>
                  )}
                  <button
                    onClick={() => setShowHistory(false)}
                    className="w-10 h-10 rounded-full border-[3px] border-[#2D3436] flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-6 h-6 text-[#2D3436]" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 bg-[#FDFBF7]">
                {history.length === 0 ? (
                  <div className="text-center py-20 text-gray-400">
                    <History className="w-20 h-20 mx-auto mb-6 opacity-50" />
                    <p className="text-2xl font-heading">No polaroids yet!</p>
                    <p className="text-lg font-body mt-2">Time to make some memories ✨</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {history.map((item, index) => (
                      <div key={item.id} className="flex justify-center">
                        <div className="group relative transform transition-transform hover:scale-105 hover:z-10" style={{ rotate: `${index % 2 === 0 ? -2 : 2}deg` }}>
                          <div className="bg-white p-4 pb-16 border border-gray-200 shadow-xl rounded-sm">
                            <Image
                              src={item.image}
                              alt="Historical Polaroid"
                              width={300}
                              height={400}
                              className="rounded-sm bg-gray-100 border border-gray-100"
                            />
                            <div className="absolute bottom-4 left-0 w-full text-center font-handwriting text-gray-600 text-xl">
                              {new Date(item.timestamp).toLocaleDateString()}
                            </div>
                          </div>

                          <div className="absolute -top-4 -right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity scale-90 group-hover:scale-100">
                            <button
                              className="w-10 h-10 bg-[#4ECDC4] rounded-full border-[3px] border-[#2D3436] shadow-[3px_3px_0px_#2D3436] flex items-center justify-center hover:-translate-y-1 transition-transform"
                              onClick={() => {
                                const link = document.createElement('a')
                                link.href = item.image
                                link.download = `polaroid-${item.id}.png`
                                link.click()
                              }}
                            >
                              <Download className="w-5 h-5 text-white" />
                            </button>
                            <button
                              className="w-10 h-10 bg-[#FF6B6B] rounded-full border-[3px] border-[#2D3436] shadow-[3px_3px_0px_#2D3436] flex items-center justify-center hover:-translate-y-1 transition-transform"
                              onClick={() => deleteFromHistory(item.id)}
                            >
                              <Trash2 className="w-5 h-5 text-white" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-7xl mx-auto p-4 md:p-8 relative">

        <div className="grid md:grid-cols-2 gap-12 w-full items-center min-h-[600px]">
          {/* Left Column: Camera (Always Visible) */}
          <div className="flex flex-col items-center justify-center order-1 relative h-full">
            <div className="relative z-10 transform transition-transform duration-500 hover:scale-105">
              <PolaroidCamera
                isProcessing={isUploading}
                resultImage={result?.images[0] || null}
                onAnimationComplete={handleAnimationComplete}
              />
            </div>

            {/* Decorative Speech Bubble */}
            {!isUploading && !result && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute -bottom-10 -right-4 hidden md:block transform rotate-[10deg] z-20"
              >
                <div className="bg-[#FFE66D] p-4 border-[3px] border-[#2D3436] shadow-[5px_5px_0px_#2D3436] rounded-2xl rounded-tl-none">
                  <p className="font-handwriting text-2xl font-bold text-[#2D3436]">Make it cute! ✨</p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column: Upload / Loading / Result */}
          <div className="order-2 flex flex-col items-center justify-center w-full h-full">
            <AnimatePresence mode="wait">
              {/* State 1: Upload Zone */}
              {!isUploading && !result && (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="w-full max-w-md"
                >
                  <div className="bg-white p-8 rounded-[32px] border-[3px] border-[#2D3436] shadow-[8px_8px_0px_#2D3436] relative">
                    <div className="space-y-6 text-center">
                      <div>
                        <h2 className="text-4xl font-heading font-bold mb-2 text-[#2D3436]">Digital Craft Desk</h2>
                        <p className="text-gray-500 font-body text-lg">
                          Turn your photos into 3D chibi stickers!
                        </p>
                      </div>

                      <UploadZone onFileSelect={handleFileSelect} />

                      <div className="flex justify-center gap-6 text-sm font-bold text-[#2D3436]/60 font-heading">
                        <span className="flex items-center gap-1">✓ Free</span>
                        <span className="flex items-center gap-1">✓ Fast</span>
                        <span className="flex items-center gap-1">✓ Cute</span>
                      </div>
                    </div>

                    {/* Decorative Sticker */}
                    <div className="absolute -top-6 -right-6 w-20 h-20 bg-[#4ECDC4] rounded-full border-[3px] border-[#2D3436] flex items-center justify-center shadow-[4px_4px_0px_#2D3436] transform rotate-[15deg] hover:rotate-[25deg] transition-transform">
                      <span className="font-heading font-bold text-white text-xl">New!</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* State 2: Loading */}
              {isUploading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center"
                >
                  <h2 className="text-5xl font-heading font-bold mb-4 animate-pulse text-[#FF6B6B]">
                    Developing...
                  </h2>
                  <p className="text-[#2D3436] font-handwriting text-2xl">
                    Adding magic dust & sparkles ✨
                  </p>
                </motion.div>
              )}

              {/* State 3: Result Display */}
              {result && cameraFinished && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full max-w-lg"
                >
                  <div className="flex flex-col gap-8 items-center">
                    {/* Large Result Image */}
                    <div className="relative bg-white p-4 pb-20 shadow-2xl rounded-sm transform rotate-2 hover:rotate-0 transition-all duration-500 border border-gray-200">
                      <div className="relative w-[300px] h-[360px] md:w-[360px] md:h-[420px]">
                        <Image
                          src={result.images[0]}
                          alt="Generated Polaroid"
                          fill
                          className="object-cover rounded-[2px] border border-gray-100"
                          priority
                        />
                      </div>
                      <div className="absolute bottom-6 left-0 w-full text-center font-handwriting text-gray-600 text-2xl">
                        #MyMoment
                      </div>

                      {/* Sticker Decoration */}
                      <div className="absolute -top-6 -left-6 text-6xl transform rotate-[-15deg] drop-shadow-md z-20 hover:scale-110 transition-transform cursor-default">
                        ✨
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-4 w-full max-w-xs">
                      <button
                        onClick={() => {
                          const link = document.createElement('a')
                          link.href = result.images[0]
                          const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
                          link.download = `AI-Polaroid_${timestamp}.png`
                          link.click()
                        }}
                        className="btn-retro w-full"
                      >
                        <Download className="w-6 h-6" />
                        Download Sticker
                      </button>

                      <div className="flex gap-4">
                        <button
                          onClick={() => setShowShareMenu(!showShareMenu)}
                          className="btn-retro-secondary flex-1"
                        >
                          <Share2 className="w-5 h-5" />
                          Share
                        </button>
                        <button
                          onClick={() => {
                            setResult(null)
                            setShowCamera(false)
                            setCameraFinished(false)
                            setIsUploading(false)
                            setShowShareMenu(false)
                          }}
                          className="btn-retro-secondary flex-1"
                        >
                          <RotateCcw className="w-5 h-5" />
                          Again
                        </button>
                      </div>
                    </div>

                    {/* Share Menu */}
                    {showShareMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-6 rounded-[24px] border-[3px] border-[#2D3436] shadow-[5px_5px_0px_#2D3436] w-full relative z-50"
                      >
                        <p className="text-center font-heading font-bold mb-4 text-lg">Share to</p>
                        <div className="flex justify-center gap-4">
                          <button
                            onClick={() => {
                              const link = document.createElement('a')
                              link.href = result.images[0]
                              link.download = `AI-Polaroid_IG.png`
                              link.click()
                              alert("Saved for Instagram! Open your app to post.")
                            }}
                            className="w-12 h-12 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 text-white border-[3px] border-[#2D3436] hover:scale-110 transition-transform flex items-center justify-center"
                          >
                            <Instagram className="w-6 h-6" />
                          </button>
                          <button
                            onClick={() => {
                              const text = "Check out my cute 3D chibi polaroid! ✨"
                              const url = window.location.href
                              window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank')
                            }}
                            className="w-12 h-12 rounded-full bg-black text-white border-[3px] border-[#2D3436] hover:scale-110 transition-transform flex items-center justify-center"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                          </button>
                          <button
                            onClick={() => {
                              const url = window.location.href
                              window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')
                            }}
                            className="w-12 h-12 rounded-full bg-[#1877F2] text-white border-[3px] border-[#2D3436] hover:scale-110 transition-transform flex items-center justify-center"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  )
}
