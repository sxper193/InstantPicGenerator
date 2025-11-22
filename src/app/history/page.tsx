"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Download, Trash2, ArrowLeft, X } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { db, HistoryItem } from "@/lib/storage"
import { ANALYTICS_EVENTS, logAnalyticsEvent } from "@/lib/analytics"

export default function HistoryPage() {
    const [history, setHistory] = useState<HistoryItem[]>([])
    const [selectedImage, setSelectedImage] = useState<HistoryItem | null>(null)

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

    const deleteFromHistory = async (id: string) => {
        logAnalyticsEvent(ANALYTICS_EVENTS.DELETE_HISTORY_ITEM)
        await db.deleteHistory(id)
        setHistory(history.filter(item => item.id !== id))
        if (selectedImage?.id === id) {
            setSelectedImage(null)
        }
    }

    const clearHistory = async () => {
        if (confirm("Are you sure you want to clear all history?")) {
            logAnalyticsEvent(ANALYTICS_EVENTS.CLEAR_HISTORY, {
                count: history.length
            })
            await db.clearHistory()
            setHistory([])
        }
    }

    return (
        <div className="min-h-screen bg-[#FDFBF7] p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="flex items-center justify-between mb-12">
                    <Link href="/" className="flex items-center gap-2 text-[#2D3436] hover:text-[#FF6B6B] transition-colors group">
                        <div className="w-10 h-10 rounded-full border-[3px] border-[#2D3436] flex items-center justify-center group-hover:scale-110 transition-transform bg-white">
                            <ArrowLeft className="w-5 h-5" />
                        </div>
                        <span className="font-heading font-bold text-xl">Back to Camera</span>
                    </Link>
                    <h1 className="text-4xl font-heading font-bold text-[#2D3436]">My Collection</h1>
                    {history.length > 0 && (
                        <button
                            onClick={clearHistory}
                            className="px-4 py-2 rounded-full border-[3px] border-[#2D3436] font-bold hover:bg-red-100 transition-colors flex items-center gap-2 text-[#2D3436] bg-white"
                        >
                            <Trash2 className="w-4 h-4" />
                            Clear All
                        </button>
                    )}
                </header>

                {history.length === 0 ? (
                    <div className="text-center py-32">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 border-[3px] border-[#2D3436]">
                            <Image src="/placeholder.svg" width={40} height={40} alt="No history" className="opacity-20" />
                        </div>
                        <p className="text-2xl font-heading text-[#2D3436]">No polaroids yet!</p>
                        <p className="text-lg font-body mt-2 text-gray-500">Go take some photos to fill up your collection ✨</p>
                        <Link href="/" className="mt-8 inline-block btn-retro">
                            Start Creating
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {history.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex justify-center"
                            >
                                <div
                                    className="group relative transform transition-transform hover:scale-105 hover:z-10 cursor-pointer"
                                    style={{ rotate: `${index % 2 === 0 ? -2 : 2}deg` }}
                                    onClick={() => {
                                        setSelectedImage(item)
                                        logAnalyticsEvent(ANALYTICS_EVENTS.VIEW_HISTORY)
                                    }}
                                >
                                    <div className="bg-white p-4 pb-16 border-[3px] border-[#2D3436] shadow-[8px_8px_0px_#2D3436] rounded-sm">
                                        <Image
                                            src={item.image}
                                            alt="Historical Polaroid"
                                            width={300}
                                            height={400}
                                            className="rounded-sm bg-gray-100 border border-gray-200"
                                        />
                                        <div className="absolute bottom-4 left-0 w-full text-center font-handwriting text-gray-600 text-xl">
                                            {new Date(item.timestamp).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Image Modal */}
                <AnimatePresence>
                    {selectedImage && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-[#2D3436]/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                            onClick={() => setSelectedImage(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.9, y: 20 }}
                                className="bg-[#FDFBF7] p-4 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
                                onClick={e => e.stopPropagation()}
                            >
                                <button
                                    onClick={() => setSelectedImage(null)}
                                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white border-[3px] border-[#2D3436] flex items-center justify-center hover:bg-gray-100 transition-colors z-10"
                                >
                                    <X className="w-6 h-6 text-[#2D3436]" />
                                </button>

                                <div className="grid md:grid-cols-2 gap-8 p-4">
                                    <div className="flex items-center justify-center min-h-[400px]">
                                        <div className="relative">
                                            {/* AI Result - Big */}
                                            <div className="bg-white p-4 pb-20 border-[3px] border-[#2D3436] shadow-[8px_8px_0px_#2D3436] rounded-sm transform rotate-[-2deg] relative z-10 max-w-full">
                                                <Image
                                                    src={selectedImage.image}
                                                    alt="Selected Polaroid"
                                                    width={400}
                                                    height={500}
                                                    className="rounded-sm border border-gray-200 w-auto h-auto max-h-[60vh] object-contain"
                                                />
                                                <div className="absolute bottom-6 left-0 w-full text-center font-handwriting text-gray-600 text-2xl">
                                                    {new Date(selectedImage.timestamp).toLocaleDateString()}
                                                </div>
                                            </div>

                                            {/* Original Image - Small Floating */}
                                            {selectedImage.originalImage && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0, x: -20 }}
                                                    animate={{ opacity: 1, scale: 1, x: 0 }}
                                                    transition={{ delay: 0.2, type: "spring" }}
                                                    className="absolute -top-6 -right-12 z-20"
                                                >
                                                    <div className="bg-white p-2 pb-6 border-[3px] border-[#2D3436] shadow-[4px_4px_0px_rgba(0,0,0,0.1)] rounded-sm w-[120px] transform rotate-6 hover:rotate-12 transition-transform origin-bottom-left">
                                                        <Image 
                                                            src={selectedImage.originalImage} 
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
                                    </div>

                                    <div className="flex flex-col justify-center space-y-6">
                                        <div>
                                            <h3 className="text-2xl font-heading font-bold text-[#2D3436] mb-2">Polaroid Details</h3>
                                            <p className="font-body text-gray-600">
                                                Created on {new Date(selectedImage.timestamp).toLocaleString()}
                                            </p>
                                            {selectedImage.description && (
                                                <div className="mt-4 p-4 bg-white rounded-xl border-[2px] border-[#2D3436] border-dashed">
                                                    <p className="font-handwriting text-lg text-gray-700">&quot;{selectedImage.description}&quot;</p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex gap-4">
                                            <button
                                                onClick={() => {
                                                    logAnalyticsEvent(ANALYTICS_EVENTS.DOWNLOAD_HISTORY_ITEM)
                                                    const link = document.createElement('a')
                                                    link.href = selectedImage.image
                                                    link.download = `polaroid-${selectedImage.id}.png`
                                                    link.click()
                                                }}
                                                className="btn-retro flex-1"
                                            >
                                                <Download className="w-5 h-5" />
                                                Download
                                            </button>
                                            <button
                                                onClick={() => deleteFromHistory(selectedImage.id)}
                                                className="btn-retro-secondary flex-1 hover:bg-red-100 hover:text-red-600 hover:border-red-600"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
