"use client"

import * as React from "react"
import { useDropzone } from "react-dropzone"
import { Upload, X, Camera } from "lucide-react"
import { cn } from "@/lib/utils"

interface UploadZoneProps {
    onFileSelect: (file: File) => void
    disabled?: boolean
}

export function UploadZone({ onFileSelect, disabled = false }: UploadZoneProps) {
    const [preview, setPreview] = React.useState<string | null>(null)
    const [isDragActive, setIsDragActive] = React.useState(false)

    const onDrop = React.useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0]
        if (file) {
            const objectUrl = URL.createObjectURL(file)
            setPreview(objectUrl)
            onFileSelect(file)
        }
    }, [onFileSelect])

    const { getRootProps, getInputProps, isDragReject } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': [],
            'image/png': [],
            'image/heic': [],
            'image/webp': []
        },
        maxFiles: 1,
        disabled: disabled,
        onDragEnter: () => setIsDragActive(true),
        onDragLeave: () => setIsDragActive(false),
        onDropAccepted: () => setIsDragActive(false),
        onDropRejected: () => setIsDragActive(false),
    })

    const clearFile = (e: React.MouseEvent) => {
        e.stopPropagation()
        setPreview(null)
    }

    return (
        <div className="w-full max-w-xl mx-auto">
            {preview ? (
                <div className="relative overflow-hidden rounded-2xl border-[3px] border-[#2D3436] shadow-[5px_5px_0px_#2D3436] bg-white p-2 transform rotate-1">
                    <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={preview}
                            alt="Upload preview"
                            className="w-full h-full object-contain"
                        />
                        <button
                            className="absolute top-2 right-2 h-8 w-8 rounded-full bg-[#FF6B6B] border-2 border-[#2D3436] shadow-[2px_2px_0px_#2D3436] flex items-center justify-center hover:scale-110 transition-transform"
                            onClick={clearFile}
                        >
                            <X className="h-4 w-4 text-white" />
                        </button>
                    </div>
                </div>
            ) : (
                <div
                    {...getRootProps()}
                    data-active={isDragActive}
                    className={cn(
                        "upload-zone-retro relative cursor-pointer flex flex-col items-center justify-center w-full aspect-[4/3] p-8",
                        isDragReject && "border-red-500 bg-red-50"
                    )}
                >
                    <input {...getInputProps()} />

                    <div className="w-20 h-20 bg-[#FF69B4] rounded-full flex items-center justify-center border-[3px] border-[#2D3436] shadow-[4px_4px_0px_#2D3436] mb-6 transform -rotate-6 group-hover:rotate-0 transition-transform">
                        <Camera className="w-10 h-10 text-white" />
                    </div>

                    <div className="space-y-2 text-center">
                        <h3 className="text-2xl font-heading font-bold text-[#2D3436]">
                            {isDragActive ? "Drop it here!" : "Upload Photo"}
                        </h3>
                        <p className="text-gray-500 font-body">
                            Drag & drop or click to browse
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}
