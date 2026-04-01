import { Inngest } from "inngest";

const inngest = new Inngest({
  id: "signalist",
  ai: { gemini: { apiKey: process.env.GEMINI_API_KEY } },
});

export default inngest;
