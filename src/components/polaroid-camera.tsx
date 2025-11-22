"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

interface PolaroidCameraProps {
    isProcessing: boolean
    resultImage: string | null
    onAnimationComplete?: () => void
}

export function PolaroidCamera({ isProcessing, resultImage, onAnimationComplete }: PolaroidCameraProps) {
    const [showPhoto, setShowPhoto] = useState(false)

    useEffect(() => {
        if (resultImage) {
            // Start ejection animation shortly after result is available
            const timer = setTimeout(() => {
                setShowPhoto(true)
            }, 100)
            return () => clearTimeout(timer)
        } else {
            setShowPhoto(false)
        }
    }, [resultImage])

    return (
        <div className="relative flex flex-col items-center justify-end h-[500px] w-full max-w-md mx-auto">
            {/* The Photo Ejecting */}
            <AnimatePresence>
                {showPhoto && resultImage && (
                    <motion.div
                        initial={{ y: 60, opacity: 0, scale: 0.9 }}
                        animate={{ y: -220, opacity: 1, scale: 1 }}
                        transition={{ duration: 1.5, type: "spring", bounce: 0.2 }}
                        onAnimationComplete={onAnimationComplete}
                        className="absolute z-10 bottom-[180px]"
                    >
                        <div className="bg-white p-3 pb-12 border-[3px] border-[#2D3436] shadow-[4px_4px_0px_rgba(0,0,0,0.1)] rounded-sm w-[240px] transform rotate-[-2deg]">
                            <Image
                                src={resultImage}
                                alt="Generated"
                                width={220}
                                height={220}
                                className="rounded-sm bg-gray-100 border border-gray-200"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* The Camera Body - Retro Pop Style */}
            <div className="relative z-20 w-[320px] h-[240px]">
                {/* Camera Top */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[280px] h-[100px] bg-[#FDFBF7] rounded-t-[40px] border-[3px] border-[#2D3436] flex items-center justify-center z-10">
                    {/* Flash */}
                    <div className={`absolute top-4 right-6 w-10 h-6 bg-[#FFE66D] rounded-full border-[3px] border-[#2D3436] ${isProcessing ? 'animate-pulse shadow-[0_0_15px_#FFE66D]' : ''}`} />
                    {/* Viewfinder */}
                    <div className="absolute top-4 left-6 w-8 h-8 bg-[#2D3436] rounded-full border-[3px] border-[#2D3436] overflow-hidden">
                        <div className="w-2 h-2 bg-white rounded-full absolute top-1 right-2 opacity-50" />
                    </div>
                </div>

                {/* Camera Bottom (Main Body) */}
                <div className="absolute bottom-0 w-full h-[160px] bg-[#FFB7C5] rounded-[48px] border-[3px] border-[#2D3436] shadow-[8px_8px_0px_#2D3436] flex items-center justify-center z-20">
                    {/* Lens */}
                    <div className="relative w-32 h-32 rounded-full bg-[#FDFBF7] border-[3px] border-[#2D3436] flex items-center justify-center shadow-inner">
                        <div className="w-24 h-24 rounded-full bg-[#2D3436] border-[4px] border-[#4ECDC4] flex items-center justify-center">
                            <div className="w-10 h-10 rounded-full bg-[#1a1a1a] border border-gray-600 relative overflow-hidden">
                                <div className="absolute top-2 right-2 w-3 h-3 bg-white rounded-full opacity-40 blur-[1px]" />
                            </div>
                        </div>
                    </div>

                    {/* Rainbow Stripe */}
                    <div className="absolute bottom-8 left-8 flex gap-1">
                        <div className="w-3 h-8 bg-[#FF6B6B] border-[2px] border-[#2D3436] rounded-full transform -rotate-12" />
                        <div className="w-3 h-8 bg-[#FFE66D] border-[2px] border-[#2D3436] rounded-full transform -rotate-6" />
                        <div className="w-3 h-8 bg-[#4ECDC4] border-[2px] border-[#2D3436] rounded-full transform rotate-0" />
                    </div>

                    {/* Brand */}
                    <div className="absolute bottom-6 right-8 font-heading font-bold text-[#2D3436] opacity-50 rotate-[-5deg]">
                        instax
                    </div>

                    {/* Slot */}
                    <div className="absolute -top-1 w-[240px] h-3 bg-[#2D3436] rounded-full opacity-20" />
                </div>

                {/* Processing Indicator (Bouncing Dots) */}
                {isProcessing && (
                    <div className="absolute -right-8 top-0 bg-white p-2 rounded-xl border-[3px] border-[#2D3436] shadow-[3px_3px_0px_#2D3436]">
                        <div className="flex gap-1">
                            <motion.div
                                animate={{ y: [0, -5, 0] }}
                                transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                                className="w-2 h-2 bg-[#FF6B6B] rounded-full"
                            />
                            <motion.div
                                animate={{ y: [0, -5, 0] }}
                                transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                                className="w-2 h-2 bg-[#FFE66D] rounded-full"
                            />
                            <motion.div
                                animate={{ y: [0, -5, 0] }}
                                transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                                className="w-2 h-2 bg-[#4ECDC4] rounded-full"
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
