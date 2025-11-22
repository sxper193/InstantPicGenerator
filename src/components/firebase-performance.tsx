"use client";

import { useEffect } from "react";
import { getPerformance } from "firebase/performance";
import { app } from "@/lib/firebase";

export function FirebasePerformance() {
  useEffect(() => {
    // Initialize Firebase Performance Monitoring
    // This automatically starts collecting web vitals and network requests
    if (typeof window !== "undefined") {
      try {
        getPerformance(app);
      } catch (err) {
        console.warn("Firebase Performance initialization failed", err);
      }
    }
  }, []);

  return null;
}

