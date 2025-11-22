"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Download, Share2, RotateCcw, Instagram, ArrowLeftRight, Sparkles } from "lucide-react"
import { PolaroidCamera } from "@/components/polaroid-camera"
import { db } from "@/lib/storage"

export default function ResultPage() {
    const router = useRouter()
    const [resultImage, setResultImage] = useState<string | null>(null)
    const [originalImage, setOriginalImage] = useState<string | null>(null)
    const [showCamera, setShowCamera] = useState(true)
    const [isDeveloping, setIsDeveloping] = useState(true)
    const [showComparison, setShowComparison] = useState(false)
    const [showShareMenu, setShowShareMenu] = useState(false)

    useEffect(() => {
        const loadData = async () => {
            try {
                // Load data from IndexedDB
                const storedResult = await db.get<string>("latest_result")
                const storedOriginal = await db.get<string>("latest_original")

                if (!storedResult) {
                    router.push("/")
                    return
                }

                setResultImage(storedResult)
                if (storedOriginal) {
                    setOriginalImage(storedOriginal)
                }

                // Start developing effect
                const timer = setTimeout(() => {
                    setIsDeveloping(false)
                }, 2500) // 2s animation + buffer

                return () => clearTimeout(timer)
            } catch (e) {
                console.error("Failed to load result:", e)
                router.push("/")
            }
        }

        loadData()
    }, [router])

    const handleAnimationComplete = () => {
        // Animation handled by PolaroidCamera, but we can trigger other effects here
    }

    if (!resultImage) return null

    return (
        <main className="min-h-screen flex flex-col relative overflow-hidden bg-[#FDFBF7]">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/5 blur-[100px]" />
            </div>

            {/* Header */}
            <header className="p-6 flex items-center justify-between relative z-50 max-w-7xl mx-auto w-full">
                <div
                    className="flex items-center gap-3 cursor-pointer group"
                    onClick={() => router.push("/")}
                >
                    <div className="w-12 h-12 bg-[#FF6B6B] rounded-full flex items-center justify-center border-[3px] border-[#2D3436] shadow-[4px_4px_0px_#2D3436] group-hover:scale-110 transition-transform">
                        <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-3xl font-heading font-bold text-[#2D3436] tracking-tight group-hover:text-[#FF6B6B] transition-colors">
                        AI Polaroid
                    </h1>
                </div>
            </header>

            <div className="flex-1 flex flex-col items-center justify-center w-full max-w-7xl mx-auto p-4 md:p-8 relative">
                <div className="grid md:grid-cols-2 gap-12 w-full items-center min-h-[600px]">

                    {/* Left Column: Camera (Always Visible) */}
                    <div className="flex flex-col items-center justify-center order-1 relative h-full">
                        <div className="relative z-10 transform transition-transform duration-500 hover:scale-105">
                            <PolaroidCamera
                                isProcessing={false}
                                resultImage={resultImage}
                                onAnimationComplete={handleAnimationComplete}
                            />
                        </div>
                    </div>

                    {/* Right Column: Result & Comparison */}
                    <div className="order-2 flex flex-col items-center justify-center w-full h-full">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            className="w-full max-w-lg"
                        >
                            <div className="flex flex-col gap-8 items-center">
                                <div className="flex gap-8 items-center justify-center w-full">
                                    {/* Original Image (Interactive) */}
                                    {originalImage && (
                                        <div
                                            className="relative group cursor-pointer hidden md:block"
                                            onMouseEnter={() => setShowComparison(true)}
                                            onMouseLeave={() => setShowComparison(false)}
                                        >
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#2D3436] text-white px-3 py-1 rounded-full text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-bold">
                                                Original
                                            </div>
                                            <div className={`relative w-24 h-32 bg-white p-1 pb-4 shadow-lg rounded-sm border border-gray-200 transition-all duration-300 ${showComparison ? 'scale-150 z-50 rotate-0' : 'rotate-[-6deg] hover:rotate-0'}`}>
                                                <Image
                                                    src={originalImage}
                                                    alt="Original"
                                                    fill
                                                    className="object-cover rounded-[2px]"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Result Image */}
                                    <div className="relative bg-white p-4 pb-20 shadow-2xl rounded-sm transform rotate-2 hover:rotate-0 transition-all duration-500 border border-gray-200">
                                        <div className="relative w-[300px] h-[360px] md:w-[360px] md:h-[420px] overflow-hidden">
                                            <Image
                                                src={resultImage}
                                                alt="Generated Polaroid"
                                                fill
                                                className={`object-cover rounded-[2px] border border-gray-100 transition-all duration-[2000ms] ease-out ${isDeveloping ? 'blur-xl grayscale brightness-150' : 'blur-0 grayscale-0 brightness-100'}`}
                                                priority
                                            />
                                        </div>
                                        <div className={`absolute bottom-6 left-0 w-full text-center font-handwriting text-gray-600 text-2xl transition-opacity duration-[2000ms] ${isDeveloping ? 'opacity-0' : 'opacity-100'}`}>
                                            #MyMoment
                                        </div>

                                        {/* Sticker Decoration */}
                                        <div className={`absolute -top-6 -left-6 text-6xl transform rotate-[-15deg] drop-shadow-md z-20 transition-all duration-500 ${isDeveloping ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}>
                                            ✨
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className={`flex flex-col gap-4 w-full max-w-xs transition-opacity duration-1000 ${isDeveloping ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                                    <button
                                        onClick={() => {
                                            const link = document.createElement('a')
                                            link.href = resultImage
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
                                            onClick={() => router.push("/")}
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
                                                    link.href = resultImage
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
                    </div>
                </div>
            </div>
        </main>
    )
}
