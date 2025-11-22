import { getAnalytics, logEvent as firebaseLogEvent } from "firebase/analytics";
import { app } from "./firebase";

// Event Names Constants
export const ANALYTICS_EVENTS = {
  // File Operations
  UPLOAD_IMAGE: "upload_image",
  
  // Generation Flow
  GENERATE_START: "generate_start",
  GENERATE_SUCCESS: "generate_success",
  GENERATE_ERROR: "generate_error",
  
  // User Actions
  DOWNLOAD_IMAGE: "download_image",
  SHARE_IMAGE: "share_image",
  CLICK_TRY_AGAIN: "click_try_again",
  
  // History Actions
  VIEW_HISTORY: "view_history",
  DELETE_HISTORY_ITEM: "delete_history_item",
  CLEAR_HISTORY: "clear_history",
  DOWNLOAD_HISTORY_ITEM: "download_history_item",
  
  // Navigation
  NAVIGATE: "navigate",
} as const;

export const logAnalyticsEvent = (eventName: string, params?: Record<string, any>) => {
  if (typeof window !== 'undefined') {
    try {
      const analytics = getAnalytics(app);
      firebaseLogEvent(analytics, eventName, params);
      // console.log(`[Analytics] ${eventName}`, params); // Optional: for debugging
    } catch (error) {
      // Analytics might not be initialized or blocked by ad blocker
      console.warn("[Analytics] Failed to log event:", error);
    }
  }
};

