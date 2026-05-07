import { NextResponse } from "next/server";
import { interpretLocalIntent } from "@/lib/ai/local-intent";

export async function POST(request: Request) {
  const { query } = await request.json();
  const text = typeof query === "string" ? query : "";

  // Prepared for Gemini later. If GEMINI_API_KEY is absent, local rules keep the UX working.
  const result = interpretLocalIntent(text);

  return NextResponse.json(result);
}
