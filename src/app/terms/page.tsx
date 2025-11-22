import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Terms of Service - AI Polaroid",
  description: "Terms of Service for AI Polaroid. Usage guidelines, intellectual property rights, and disclaimers.",
}

export default function TermsPage() {
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
          <h1 className="text-4xl font-heading font-bold text-[#2D3436]">Terms of Service</h1>
          <p className="mt-4 text-gray-500">Last Updated: {new Date().toLocaleDateString()}</p>
        </header>

        <div className="bg-white p-8 rounded-3xl border-[3px] border-[#2D3436] shadow-[8px_8px_0px_#2D3436] space-y-8 text-gray-700 font-body">
          <section>
            <h2 className="text-2xl font-heading font-bold text-[#2D3436] mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing or using AI Polaroid (&quot;the Service&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-bold text-[#2D3436] mb-4">2. Description of Service</h2>
            <p>
              AI Polaroid provides an AI-powered tool that transforms user-uploaded photos into stylized 3D images. The Service is provided &quot;as is&quot; and is subject to change or termination without notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-bold text-[#2D3436] mb-4">3. User Conduct & Content</h2>
            <p className="mb-2">You retain all rights to the original photos you upload. By uploading content, you grant us a temporary license to process it solely for the purpose of generating your result.</p>
            <p className="mb-2">You agree NOT to upload content that:</p>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li>Is illegal, hateful, violent, or sexually explicit.</li>
              <li>Infringes on the intellectual property rights of others.</li>
              <li>Contains personal identifiable information of third parties without consent.</li>
            </ul>
            <p className="mt-2">We reserve the right to refuse service to anyone violating these guidelines.</p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-bold text-[#2D3436] mb-4">4. Intellectual Property</h2>
            <p>
              Subject to your compliance with these Terms, you own the copyright to the AI-generated images created by you using our Service. You are free to use them for personal or commercial purposes. However, you acknowledge that AI-generated content may not be protected by copyright laws in certain jurisdictions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-bold text-[#2D3436] mb-4">5. Disclaimer of Warranties</h2>
            <p>
              THE SERVICE IS PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS. WE MAKE NO WARRANTIES, EXPRESSED OR IMPLIED, REGARDING THE ACCURACY, RELIABILITY, OR AVAILABILITY OF THE SERVICE. WE DO NOT GUARANTEE THAT THE GENERATED IMAGES WILL MEET YOUR EXPECTATIONS.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-bold text-[#2D3436] mb-4">6. Limitation of Liability</h2>
            <p>
              TO THE FULLEST EXTENT PERMITTED BY LAW, AI POLAROID SHALL NOT BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES RESULTING FROM YOUR USE OR INABILITY TO USE THE SERVICE.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}

