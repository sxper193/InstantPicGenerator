import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Privacy Policy - AI Polaroid",
  description: "Privacy Policy for AI Polaroid. We respect your privacy and do not permanently store your photos.",
}

export default function PrivacyPage() {
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
          <h1 className="text-4xl font-heading font-bold text-[#2D3436]">Privacy Policy</h1>
          <p className="mt-4 text-gray-500">Last Updated: {new Date().toLocaleDateString()}</p>
        </header>

        <div className="bg-white p-8 rounded-3xl border-[3px] border-[#2D3436] shadow-[8px_8px_0px_#2D3436] space-y-8 text-gray-700 font-body">
          <section>
            <h2 className="text-2xl font-heading font-bold text-[#2D3436] mb-4">1. Introduction</h2>
            <p>
              Welcome to AI Polaroid (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our website and services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-bold text-[#2D3436] mb-4">2. Information We Collect</h2>
            <p className="mb-2">We collect the following types of information:</p>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li><strong>Uploaded Images:</strong> Photos you upload for processing.</li>
              <li><strong>Usage Data:</strong> Non-personal information about how you interact with our website (e.g., browser type, device type).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-bold text-[#2D3436] mb-4">3. How We Use Your Information</h2>
            <p className="mb-2"><strong>Image Processing:</strong></p>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li>Your uploaded images are transmitted securely to our AI processing provider (Google Gemini API) solely for the purpose of generating the requested artwork.</li>
              <li><strong>We do not permanently store your original photos or generated images on our servers.</strong></li>
              <li>Images are processed in memory or temporary storage and are discarded immediately after the generation process is complete or within a short retention period necessary for the technical operation of the service.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-bold text-[#2D3436] mb-4">4. Local Storage</h2>
            <p>
              We use your browser&apos;s local storage (IndexedDB) to save your generation history on your own device. This data remains on your device and is not accessible to us or third parties unless you explicitly share it. You can clear this history at any time through the website interface or browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-bold text-[#2D3436] mb-4">5. Third-Party Services</h2>
            <p>
              We use third-party services for AI processing (Google Cloud/Vertex AI). These providers adhere to strict data privacy and security standards. Please refer to Google&apos;s Privacy Policy for more information on how they handle data processed via their APIs.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-bold text-[#2D3436] mb-4">6. Children&apos;s Privacy</h2>
            <p>
              Our service is not intended for children under the age of 13. We do not knowingly collect personal information from children.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-bold text-[#2D3436] mb-4">7. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us via our support channels or email.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}

