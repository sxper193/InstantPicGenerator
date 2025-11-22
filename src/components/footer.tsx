import Link from "next/link"

export function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 w-full py-6 border-t-2 border-[#2D3436]/10 bg-[#FDFBF7]/95 backdrop-blur-sm z-50">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-[#2D3436]/60 font-heading text-sm flex items-center gap-2">
          <span>© {new Date().getFullYear()}. Powered by AI Polaroid.</span>
          <span className="text-[10px] px-1.5 py-0.5 bg-[#2D3436]/5 rounded-full" title="Current Version">v1.6</span>
        </p>
        <nav className="flex gap-6 text-sm font-bold text-[#2D3436] font-heading">
          <Link href="/about" className="hover:text-[#FF6B6B] transition-colors">About</Link>
          <Link href="/faq" className="hover:text-[#FF6B6B] transition-colors">FAQ</Link>
          <Link href="/privacy" className="hover:text-[#FF6B6B] transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-[#FF6B6B] transition-colors">Terms</Link>
        </nav>
      </div>
    </footer>
  )
}

