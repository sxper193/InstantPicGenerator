import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "FAQ - Common Questions about AI Polaroid",
  description: "Frequently asked questions about AI Polaroid. Learn how to turn photos into 3D chibi stickers, pricing, privacy, and more.",
}

export default function FAQPage() {
  const faqs = [
    {
      question: "Is AI Polaroid free to use?",
      answer: "Yes, AI Polaroid is currently completely free to use. You can generate unlimited 3D chibi stickers from your photos without any cost or subscription."
    },
    {
      question: "How do I turn my photo into a 3D chibi style?",
      answer: "Simply upload a photo on our homepage. Our AI analyzes your image and automatically transforms it into a cute 3D clay/pop-mart style character within seconds."
    },
    {
      question: "Do you save my photos?",
      answer: "We prioritize your privacy. Your photos are processed temporarily for generation and are not permanently stored on our servers. The history you see is stored locally in your browser."
    },
    {
      question: "Can I use the generated images for commercial purposes?",
      answer: "Yes, you own the copyright to the images you generate. You are free to use them for personal or commercial projects, such as stickers, avatars, or merchandise."
    },
    {
      question: "Why did my generation fail?",
      answer: "Generation might fail due to high server traffic or unclear source images. Please try uploading a clearer photo with good lighting, or try again in a few moments."
    }
  ]

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }

  return (
    <main className="min-h-screen bg-[#FDFBF7] p-4 md:p-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="max-w-3xl mx-auto">
        <header className="mb-12">
          <Link href="/" className="flex items-center gap-2 text-[#2D3436] hover:text-[#FF6B6B] transition-colors group mb-6">
            <div className="w-10 h-10 rounded-full border-[3px] border-[#2D3436] flex items-center justify-center group-hover:scale-110 transition-transform bg-white">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <span className="font-heading font-bold text-xl">Back to Home</span>
          </Link>
          <h1 className="text-4xl font-heading font-bold text-[#2D3436]">Frequently Asked Questions</h1>
        </header>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl border-[3px] border-[#2D3436] shadow-[4px_4px_0px_#2D3436]">
              <h2 className="text-xl font-heading font-bold text-[#2D3436] mb-3">{faq.question}</h2>
              <p className="font-body text-gray-600 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

