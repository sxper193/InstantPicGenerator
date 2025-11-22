"use client"

import { useState, useEffect } from "react"
import { UploadZone } from "@/components/upload-zone"
import { Sparkles, History } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"
import { db } from "@/lib/storage"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { PolaroidCamera } from "@/components/polaroid-camera"
import { ANALYTICS_EVENTS, logAnalyticsEvent } from "@/lib/analytics"

export default function Home() {
  const router = useRouter()
  const [isUploading, setIsUploading] = useState(false)
  const [historyCount, setHistoryCount] = useState(0)

  // Load history count on mount
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const saved = await db.getHistory()
        if (saved) {
          setHistoryCount(saved.length)
        }
      } catch (e) {
        console.error('Failed to load history:', e)
      }
    }
    loadHistory()
  }, [])

  const handleFileSelect = async (file: File) => {
    setIsUploading(true)

    // Track upload start
    logAnalyticsEvent(ANALYTICS_EVENTS.UPLOAD_IMAGE, {
      file_type: file.type,
      file_size: file.size,
    })

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
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Polaroid Picture Generator",
            "applicationCategory": "MultimediaApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "featureList": [
              "Instant photo generation",
              "Retro filters",
              "Custom text"
            ],
            "description": "Transform your digital photos into aesthetic Polaroid-style prints in seconds. The best free online Polaroid picture generator with classic white borders, retro film filters, and custom text.",
            "screenshot": "https://instantpicgenerator.com/sample-polaroid.png"
          })
        }}
      />

      {/* Header */}
      <header className="p-6 flex items-center justify-between relative z-50 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="w-12 h-12 bg-[#FF6B6B] rounded-full flex items-center justify-center border-[3px] border-[#2D3436] shadow-[4px_4px_0px_#2D3436] group-hover:scale-110 transition-transform">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="text-3xl font-heading font-bold text-[#2D3436] tracking-tight group-hover:text-[#FF6B6B] transition-colors">
            AI Polaroid
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/about" className="text-lg font-heading font-bold text-[#2D3436] hover:text-[#FF6B6B] transition-colors">
            About
          </Link>
          <Link href="/faq" className="text-lg font-heading font-bold text-[#2D3436] hover:text-[#FF6B6B] transition-colors">
            FAQ
          </Link>
          <Link href="/privacy" className="text-lg font-heading font-bold text-[#2D3436] hover:text-[#FF6B6B] transition-colors">
            Privacy
          </Link>
          <Link href="/terms" className="text-lg font-heading font-bold text-[#2D3436] hover:text-[#FF6B6B] transition-colors">
            Terms
          </Link>
        </nav>

        <Link
          href="/history"
          className="btn-retro-secondary"
          aria-label={`View history, ${historyCount} items saved`}
        >
          <History className="w-5 h-5" />
          History ({historyCount})
        </Link>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 w-full max-w-7xl mx-auto p-4 md:p-8 relative">
        
        {/* Left Column: Visual Demo (Desktop only) */}
        <div className="hidden lg:block w-full max-w-md relative">
          <div className="transform scale-90 hover:scale-100 transition-transform duration-500 relative flex flex-col items-center">
            {/* Floating badges/decor */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 }}
              className="absolute -left-4 top-1/4 bg-white px-4 py-2 rounded-full border-[3px] border-[#2D3436] shadow-[4px_4px_0px_#2D3436] font-heading font-bold text-[#FF6B6B] -rotate-12 z-30"
            >
              Try it now! 📸
            </motion.div>

            {/* Camera */}
            <div className="relative z-20">
                <PolaroidCamera isProcessing={false} />
            </div>

            {/* Sample Photo Animation */}
            <motion.div
                initial={{ y: 0, opacity: 0, scale: 0.5, rotate: -2 }}
                animate={{ y: -180, opacity: 1, scale: 1, rotate: 2 }}
                transition={{ 
                    duration: 1.5,
                    delay: 0.5,
                    type: "spring",
                    bounce: 0.4
                }}
                className="absolute bottom-[180px] z-10"
            >
                <div className="bg-white p-3 pb-12 border-[3px] border-[#2D3436] shadow-[4px_4px_0px_rgba(0,0,0,0.1)] rounded-sm w-[240px]">
                    <Image
                        src="/sample-polaroid.png"
                        alt="Sample 3D chibi style polaroid photo generated by AI"
                        width={220}
                        height={220}
                        className="rounded-sm bg-gray-100 border border-gray-200"
                        priority
                    />
                </div>
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
                <h1 className="text-4xl font-heading font-bold mb-2 text-[#2D3436]">Make Your Own Polaroid Photos Online</h1>
                <p className="text-gray-500 font-body text-lg">
                  Turn your photos into 3D chibi stickers!
                </p>
              </div>

              <h2 className="text-2xl font-heading font-bold text-[#2D3436] mb-4">Instant Photo Editor Tools</h2>

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
