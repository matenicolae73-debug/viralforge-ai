import { NextResponse } from "next/server"

const MODEL = "gemini-2.5-flash"

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY is not configured on the server." }, { status: 500 })
    }

    const body = await request.json()
    const productName = String(body.productName ?? "").trim()
    const description = String(body.description ?? "").trim()
    const country = String(body.country ?? "Global").trim()
    const audience = String(body.audience ?? "General audience").trim()
    const goal = String(body.goal ?? "sales").trim()
    const style = String(body.style ?? "viral").trim()

    if (!productName) {
      return NextResponse.json({ error: "Please enter a product name." }, { status: 400 })
    }

    const prompt = `You are the senior creative director and performance marketing strategist for VIRALFORGE AI.
Create exactly 5 distinct advertising concepts for this product.

Product: ${productName}
Description: ${description || "No detailed description provided. Infer only safe, generic benefits from the product name."}
Target country: ${country}
Target audience: ${audience}
Campaign goal: ${goal}
Preferred advertising style: ${style}

Requirements:
- Make the concepts genuinely different from one another.
- Optimize for short-form social video (TikTok, Instagram Reels, YouTube Shorts) while keeping the ideas adaptable to Facebook and YouTube.
- Use ethical marketing: do not invent clinical results, guarantees, fake testimonials, fake scarcity, or unsupported product claims.
- Each concept needs a strong first-3-second hook, a clear strategy, a concise 20-30 second ad script, and a CTA.
- Give each a realistic viralScore from 60 to 98 based on hook strength, retention potential, shareability and clarity. Do not claim it is a prediction or guarantee.
- The preferred style should influence all concepts, but variation is important.
- Write in English.

Return ONLY valid JSON with this exact shape:
{
  "concepts": [
    {
      "id": "c1",
      "name": "...",
      "strategy": "...",
      "hook": "...",
      "script": "...",
      "cta": "...",
      "viralScore": 85,
      "style": "Viral"
    }
  ]
}`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.9,
            responseMimeType: "application/json",
          },
        }),
      },
    )

    const data = await response.json()
    if (!response.ok) {
      const message = data?.error?.message || "Gemini API request failed."
      return NextResponse.json({ error: message }, { status: response.status })
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
    if (!text) {
      return NextResponse.json({ error: "Gemini returned an empty response." }, { status: 502 })
    }

    let parsed: unknown
    try {
      parsed = JSON.parse(text)
    } catch {
      return NextResponse.json({ error: "Gemini returned invalid JSON. Please try again." }, { status: 502 })
    }

    const concepts = Array.isArray((parsed as { concepts?: unknown })?.concepts)
      ? (parsed as { concepts: unknown[] }).concepts.slice(0, 5)
      : []

    const safeConcepts = concepts.map((concept, index) => {
      const item = (concept ?? {}) as Record<string, unknown>
      const score = Number(item.viralScore)
      return {
        id: String(item.id || `ai-${index + 1}`),
        name: String(item.name || `AI Concept ${index + 1}`),
        strategy: String(item.strategy || "A social-first creative strategy."),
        hook: String(item.hook || "Stop the scroll with a clear product moment."),
        script: String(item.script || "Open with the hook, demonstrate the product benefit, then close with the CTA."),
        cta: String(item.cta || "Discover it today."),
        viralScore: Number.isFinite(score) ? Math.max(60, Math.min(98, Math.round(score))) : 75,
        style: String(item.style || style),
      }
    })

    if (safeConcepts.length < 5) {
      return NextResponse.json({ error: "Gemini generated fewer than five concepts. Please try again." }, { status: 502 })
    }

    return NextResponse.json({ concepts: safeConcepts })
  } catch (error) {
    console.error("generate-campaign error", error)
    return NextResponse.json({ error: "Unable to generate the campaign right now. Please try again." }, { status: 500 })
  }
}
