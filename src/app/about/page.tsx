import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Heart, Zap, Shield } from "lucide-react"

export const metadata: Metadata = {
  title: "About Us - AI Polaroid",
  description: "Learn about the story behind AI Polaroid, our mission to democratize 3D art creation, and the technology that powers our cute sticker generator.",
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#FDFBF7] p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <header className="mb-12">
          <Link href="/" className="flex items-center gap-2 text-[#2D3436] hover:text-[#FF6B6B] transition-colors group mb-6">
            <div className="w-10 h-10 rounded-full border-[3px] border-[#2D3436] flex items-center justify-center group-hover:scale-110 transition-transform bg-white">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <span className="font-heading font-bold text-xl">Back to Home</span>
          </Link>
          <h1 className="text-4xl font-heading font-bold text-[#2D3436]">About AI Polaroid</h1>
        </header>

        <div className="bg-white p-8 rounded-3xl border-[3px] border-[#2D3436] shadow-[8px_8px_0px_#2D3436] space-y-8">
          <section>
            <h2 className="text-2xl font-heading font-bold text-[#2D3436] mb-4">Our Mission</h2>
            <p className="font-body text-gray-600 leading-relaxed text-lg">
              We believe that creating cute, high-quality 3D art shouldn&apos;t require complex software or hours of modeling. AI Polaroid was born from a simple idea: what if you could turn any memory into a collectible &quot;Pop Mart&quot; style toy instantly? Our mission is to make this fun, accessible, and free for everyone.
            </p>
          </section>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-4 bg-red-50 rounded-xl border-[2px] border-[#FF6B6B]/20">
              <Heart className="w-8 h-8 text-[#FF6B6B] mb-2" />
              <h3 className="font-heading font-bold text-lg mb-1">Made with Love</h3>
              <p className="text-sm text-gray-600">Crafted for cuteness lovers and sticker collectors.</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-xl border-[2px] border-[#FFE66D]/40">
              <Zap className="w-8 h-8 text-yellow-500 mb-2" />
              <h3 className="font-heading font-bold text-lg mb-1">Lightning Fast</h3>
              <p className="text-sm text-gray-600">Powered by Google Gemini for instant results.</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-xl border-[2px] border-[#4ECDC4]/30">
              <Shield className="w-8 h-8 text-[#4ECDC4] mb-2" />
              <h3 className="font-heading font-bold text-lg mb-1">Privacy First</h3>
              <p className="text-sm text-gray-600">Your photos belong to you. No permanent storage.</p>
            </div>
          </div>

          <section>
            <h2 className="text-2xl font-heading font-bold text-[#2D3436] mb-4">The Technology</h2>
            <p className="font-body text-gray-600 leading-relaxed">
              AI Polaroid leverages the cutting-edge multimodal capabilities of Google&apos;s Gemini 2.0 Flash models. We use a two-stage process: first analyzing your photo to understand its essence, and then re-imagining it through a custom-tuned 3D clay rendering pipeline. This ensures that while the style changes, the soul of your original photo remains.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}

