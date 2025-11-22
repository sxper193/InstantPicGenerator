"use client"
import "regenerator-runtime/runtime"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Download, Share2, RotateCcw, Instagram, Sparkles } from "lucide-react"
import { PolaroidCamera } from "@/components/polaroid-camera"
import { db, HistoryItem } from "@/lib/storage"

export default function ResultPage() {
    const router = useRouter()
    const [resultImage, setResultImage] = useState<string | null>(null)
    const [originalImage, setOriginalImage] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isGenerating, setIsGenerating] = useState(false)
    const [showShareMenu, setShowShareMenu] = useState(false)

    // Load pending data and call generation API
    useEffect(() => {
        const generateImage = async () => {
            try {
                const pendingFileData = await db.get<{ name: string; type: string; size: number; data: string }>("pending_file_data")
                const pendingOriginal = await db.get<string>("pending_original")
                console.log("Loaded from IndexedDB:", pendingFileData ? "File data found" : "No file data")
                setIsLoading(false)
                if (!pendingFileData) {
                    router.push("/")
                    return
                }
                setIsGenerating(true)
                if (pendingOriginal) setOriginalImage(pendingOriginal)
                // Convert base64 back to File
                const base64ToFile = (base64: string, filename: string, mimeType: string): File => {
                    const base64Data = base64.split(',')[1] || base64
                    const binary = atob(base64Data)
                    const bytes = new Uint8Array(binary.length)
                    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
                    return new File([bytes], filename, { type: mimeType })
                }
                const file = base64ToFile(pendingFileData.data, pendingFileData.name, pendingFileData.type)
                const formData = new FormData()
                formData.append("file", file)
                const response = await fetch("/api/generate", { method: "POST", body: formData })
                const data = await response.json()
                if (data.success && data.images && data.images.length > 0) {
                    setTimeout(() => {
                        setResultImage(data.images[0])
                        setIsGenerating(false)
                        saveToHistory(data.images[0], pendingOriginal, data.description)
                        db.delete("pending_file_data")
                        db.delete("pending_original")
                    }, 1000)
                } else {
                    alert(`Generation failed: ${data.error}`)
                    router.push("/")
                }
            } catch (e) {
                console.error(e)
                alert("Generation error, please try again")
                router.push("/")
            }
        }
        generateImage()
    }, [router])

    const saveToHistory = async (image: string, original: string | null, description: string) => {
        try {
            const item: HistoryItem = {
                id: Date.now().toString(),
                image,
                timestamp: Date.now(),
                originalImage: original || undefined,
                description,
            }
            await db.addHistory(item)
        } catch (e) {
            console.error(e)
        }
    }

    const handleAnimationComplete = () => {
        // No extra state needed for now
    }

    return (
        <main className="min-h-screen flex flex-col bg-[#FDFBF7]">
            {/* Background gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/5 blur-[100px]" />
            </div>

            {/* Header */}
            <header className="p-6 flex items-center justify-between relative z-50 max-w-7xl mx-auto w-full">
                <div className="flex items-center gap-3 cursor-pointer group" onClick={() => router.push('/')}
                >
                    <div className="w-12 h-12 bg-[#FF6B6B] rounded-full flex items-center justify-center border-[3px] border-[#2D3436] shadow-[4px_4px_0px_#2D3436] group-hover:scale-110 transition-transform">
                        <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-3xl font-heading font-bold text-[#2D3436] tracking-tight group-hover:text-[#FF6B6B] transition-colors">
                        AI Polaroid
                    </h1>
                </div>
            </header>

            <div className="flex-1 w-full max-w-md mx-auto p-4 flex flex-col items-center justify-end min-h-[800px] gap-8 pb-12">
                
                {/* Content Area (Top) */}
                <div className="flex-1 w-full flex flex-col items-center justify-center relative">
                    <AnimatePresence mode="wait">
                        {/* Loading Text */}
                        {(isLoading || isGenerating) && (
                            <motion.div 
                                key="loading" 
                                initial={{ opacity: 0 }} 
                                animate={{ opacity: 1 }} 
                                exit={{ opacity: 0 }} 
                                className="absolute inset-0 flex items-center justify-center"
                            >
                                <h2 className="text-4xl font-heading font-bold animate-pulse text-[#FF6B6B] tracking-wide text-center">
                                    {isLoading ? "Loading..." : "Developing..."}
                                </h2>
                            </motion.div>
                        )}

                        {/* Result Content */}
                        {!isLoading && !isGenerating && resultImage && (
                            <motion.div 
                                key="result" 
                                className="w-full flex flex-col items-center gap-8"
                            >
                                {/* Images Container */}
                                <div className="relative">
                                    {/* AI Result - Big */}
                                    <motion.div
                                        initial={{ y: 300, scale: 0.2, opacity: 0 }}
                                        animate={{ y: 0, scale: 1, opacity: 1 }}
                                        transition={{ 
                                            duration: 1.2, 
                                            type: "spring",
                                            bounce: 0.4
                                        }}
                                        className="relative z-30"
                                    >
                                        <div className="bg-white p-4 pb-16 border-[4px] border-[#2D3436] shadow-[8px_8px_0px_rgba(0,0,0,0.2)] rounded-sm transform -rotate-2 hover:rotate-0 transition-transform duration-300">
                                            <Image 
                                                src={resultImage} 
                                                alt="AI Result" 
                                                width={320} 
                                                height={380}
                                                className="rounded-sm bg-gray-100 border border-gray-200 object-cover"
                                                priority
                                            />
                                        </div>
                                    </motion.div>

                                    {/* Original Image - Small */}
                                    {originalImage && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0, x: 50 }}
                                            animate={{ opacity: 1, scale: 1, x: 100, y: 120 }}
                                            transition={{ delay: 0.8, duration: 0.5, type: "spring" }}
                                            className="absolute top-0 right-0 z-40"
                                        >
                                            <div className="bg-white p-2 pb-6 border-[3px] border-[#2D3436] shadow-[4px_4px_0px_rgba(0,0,0,0.1)] rounded-sm w-[120px] transform rotate-6 hover:rotate-12 transition-transform">
                                                <Image 
                                                    src={originalImage} 
                                                    alt="Original" 
                                                    width={100} 
                                                    height={100}
                                                    className="rounded-sm bg-gray-100 object-cover aspect-square"
                                                />
                                                <p className="text-[10px] font-bold text-center mt-1 text-gray-400">Original</p>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>

                                {/* Buttons */}
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.2 }}
                                    className="w-full relative z-50 flex flex-col gap-4"
                                >
                                    <button onClick={() => {
                                        const link = document.createElement('a')
                                        link.href = resultImage!
                                        const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
                                        link.download = `AI-Polaroid_${ts}.png`
                                        link.click()
                                    }} className="btn-retro w-full">
                                        <Download className="w-6 h-6" />
                                        Download Sticker
                                    </button>
                                    <div className="flex gap-4">
                                        <button onClick={() => setShowShareMenu(!showShareMenu)} className="btn-retro-secondary flex-1">
                                            <Share2 className="w-5 h-5" />
                                            Share
                                        </button>
                                        <button onClick={() => router.push('/')} className="btn-retro-secondary flex-1">
                                            <RotateCcw className="w-5 h-5" />
                                            Again
                                        </button>
                                    </div>
                                    
                                    {/* Share Menu */}
                                    {showShareMenu && (
                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-[24px] border-[3px] border-[#2D3436] shadow-[5px_5px_0px_#2D3436] w-full absolute bottom-full mb-4 z-50">
                                            <p className="text-center font-heading font-bold mb-4 text-lg">Share to</p>
                                            <div className="flex justify-center gap-4">
                                                <button onClick={() => {
                                                    const link = document.createElement('a')
                                                    link.href = resultImage!
                                                    link.download = `AI-Polaroid_IG.png`
                                                    link.click()
                                                    alert('Saved for Instagram! Open your app to post.')
                                                }} className="w-12 h-12 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 text-white border-[3px] border-[#2D3436] hover:scale-110 transition-transform flex items-center justify-center">
                                                    <Instagram className="w-6 h-6" />
                                                </button>
                                                <button onClick={() => {
                                                    const text = "Check out my cute 3D chibi polaroid! ✨"
                                                    const url = window.location.origin
                                                    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank')
                                                }} className="w-12 h-12 rounded-full bg-black text-white border-[3px] border-[#2D3436] hover:scale-110 transition-transform flex items-center justify-center">
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                                                </button>
                                                <button onClick={() => {
                                                    const url = window.location.origin
                                                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')
                                                }} className="w-12 h-12 rounded-full bg-[#1877F2] text-white border-[3px] border-[#2D3436] hover:scale-110 transition-transform flex items-center justify-center">
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Camera Area (Bottom - Fixed) */}
                <div className="flex-none relative z-20 transform scale-90">
                    <PolaroidCamera isProcessing={isGenerating} />
                </div>
            </div>
        </main>
    )
}
