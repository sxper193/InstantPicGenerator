"use client"

import { useState, useEffect } from "react"
import { UploadZone } from "@/components/upload-zone"
import { Sparkles, History, Trash2, X } from "lucide-react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { db, HistoryItem } from "@/lib/storage"
import { useRouter } from "next/navigation"
import { PolaroidCamera } from "@/components/polaroid-camera"

export default function Home() {
  const router = useRouter()
  const [isUploading, setIsUploading] = useState(false)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [showHistory, setShowHistory] = useState(false)

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

    try {
      const base64Original = await getBase64(file)

      // Save file data as a plain object (File objects don't serialize well in IndexedDB)
      const fileData = {
        name: file.name,
        type: file.type,
        size: file.size,
        data: base64Original
      }

      // Save to IndexedDB
      await db.set("pending_original", base64Original)
      await db.set("pending_file_data", fileData)

      console.log("File saved to IndexedDB:", fileData.name, fileData.size, "bytes")

      // Navigate to result page immediately
      console.log("Navigating to result page")
      router.push("/result")
    } catch (error) {
      console.error("Error preparing file:", error)
      alert("Failed to process file, please try again")
      setIsUploading(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Header */}
      <header className="p-6 flex items-center justify-between relative z-50 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3 cursor-pointer group">
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
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 w-full max-w-7xl mx-auto p-4 md:p-8 relative">
        
        {/* Left Column: Visual Demo (Desktop only) */}
        <div className="hidden lg:block w-full max-w-md relative">
          <div className="transform scale-90 hover:scale-100 transition-transform duration-500">
            <PolaroidCamera 
              isProcessing={false} 
              resultImage="/sample-polaroid.png" 
            />
            {/* Floating badges/decor */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 }}
              className="absolute -left-4 top-1/4 bg-white px-4 py-2 rounded-full border-[3px] border-[#2D3436] shadow-[4px_4px_0px_#2D3436] font-heading font-bold text-[#FF6B6B] -rotate-12 z-30"
            >
              Try it now! 📸
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
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

              <UploadZone onFileSelect={handleFileSelect} disabled={isUploading} />

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
      </div>
    </main>
  )
}
