"use client";

import { useEffect } from "react";
import { getAnalytics, isSupported } from "firebase/analytics";
import { app } from "@/lib/firebase";

export function FirebaseAnalytics() {
  useEffect(() => {
    const initAnalytics = async () => {
      if (typeof window !== "undefined") {
        const supported = await isSupported();
        if (supported) {
          getAnalytics(app);
        }
      }
    };

    initAnalytics();
  }, []);

  return null;
}

