"use client"

import { motion } from "framer-motion"

interface PolaroidCameraProps {
    isProcessing: boolean
    // resultImage and onAnimationComplete are no longer needed for internal logic but kept for interface compatibility if needed, 
    // though we will make them optional or ignore them.
    resultImage?: string | null
    onAnimationComplete?: () => void
    className?: string
}

export function PolaroidCamera({ isProcessing, className }: PolaroidCameraProps) {
    // Removed internal photo ejection logic

    return (
        <div className={`relative flex flex-col items-center justify-end w-[320px] h-[240px] ${className}`}>
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
