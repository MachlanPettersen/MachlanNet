export const AlertMessages = {
  signatures: {
    loading: "Saving your signature...",
    success: "Signature saved successfully!",
    error: "Failed to save signature. Please try again.",
  },
  suggestions: {
    loading: "Submitting your song suggestion...",
    success: "Song suggestion received!",
    error: "Failed to submit suggestion. Please try again.",
  },
  auth: {
    loading: "Verifying credentials...",
    success: "Authentication successful!",
    error: "Authentication failed. Please check your credentials.",
  },
} as const;

export type AlertMessageCategory = keyof typeof AlertMessages;
export type AlertType = "loading" | "success" | "error";
