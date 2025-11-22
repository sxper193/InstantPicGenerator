"use client"

import { useEffect } from "react"
import { ANALYTICS_EVENTS, logAnalyticsEvent } from "@/lib/analytics"

export function AdAnalytics() {
  useEffect(() => {
    // Function to detect AdBlock
    const checkAdBlock = async () => {
      try {
        // Try to fetch a known ad script (usually blocked by ad blockers)
        // Using a generic ad script name often catches blockers
        const request = new Request(
          "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js",
          { method: "HEAD", mode: "no-cors" }
        )
        
        await fetch(request)
        
        // If fetch succeeds (even with opaque response in no-cors), 
        // check if window.adsbygoogle is available or likely to load
        // Note: 'no-cors' fetch doesn't throw on network error in all cases, 
        // but blockers usually block the request entirely resulting in error.
        
        // Double check with a DOM probe if needed, but for now, assume success implies no hard network block.
        // We can also check if window.adsbygoogle exists after a timeout.
        setTimeout(() => {
          if ((window as any).adsbygoogle) {
            logAnalyticsEvent(ANALYTICS_EVENTS.ADSENSE_SCRIPT_LOADED, {
              status: 'loaded'
            })
          } else {
             // Script didn't initialize global object - suspicious but might just be slow
             // Let's not log failure eagerly to avoid noise
          }
        }, 2000)

      } catch (error) {
        // Fetch failed - likely blocked
        logAnalyticsEvent(ANALYTICS_EVENTS.AD_BLOCKER_DETECTED, {
          method: 'network_check'
        })
        console.log("AdBlocker likely detected via network check")
      }
    }

    // Run check after a short delay to allow initial load
    const timer = setTimeout(checkAdBlock, 1000)

    return () => clearTimeout(timer)
  }, [])

  return null
}

