import { createGoogleGenerativeAI } from "@ai-sdk/google";

export const google = createGoogleGenerativeAI();
export const model = google("gemini-2.0-flash-exp", {
  useSearchGrounding: true,
});
