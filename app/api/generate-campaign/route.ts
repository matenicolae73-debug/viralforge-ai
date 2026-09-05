import { NextResponse } from "next/server"

const MODEL = "gemini-3.6-flash"

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured on the server." },
        { status: 500 }
      )
    }

    const body = await request.json()

    const productName = String(body.productName ?? "").trim()
    const description = String(body.description ?? "").trim()
    const country = String(body.country ?? "Global").trim()
    const audience = String(body.audience ?? "General audience").trim()
    const goal = String(body.goal ?? "sales").trim()
    const style = String(body.style ?? "viral").trim()

    if (!productName) {
      return NextResponse.json(
        { error: "Please enter a product name." },
        { status: 400 }
      )
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
- Optimize specifically for a 10-second short-form social video suitable for TikTok, Instagram Reels and YouTube Shorts, while remaining adaptable to Facebook and YouTube.
- Use ethical marketing: do not invent clinical results, guarantees, fake testimonials, fake scarcity, or unsupported product claims.
- Each concept needs a strong first-2-second hook, a clear strategy, a concise 10-second ad script, and a CTA.
- The complete script must be designed to fit naturally within exactly 10 seconds.
- Keep the script highly visual and action-focused so it can be converted directly into an AI-generated video.
- Do not create 20, 30, or longer second scripts.
- Give each concept a realistic viralScore from 60 to 98 based on hook strength, retention potential, shareability and clarity. Do not claim it is a prediction or guarantee.
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
      "https://generativelanguage.googleapis.com/v1beta/interactions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          model: MODEL,
          input: prompt,
          store: false,
          generation_config: {
            max_output_tokens: 5000,
          },
          response_format: {
            type: "text",
            mime_type: "application/json",
            schema: {
              type: "object",
              properties: {
                concepts: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "string" },
                      name: { type: "string" },
                      strategy: { type: "string" },
                      hook: { type: "string" },
                      script: { type: "string" },
                      cta: { type: "string" },
                      viralScore: { type: "integer" },
                      style: { type: "string" },
                    },
                    required: [
                      "id",
                      "name",
                      "strategy",
                      "hook",
                      "script",
                      "cta",
                      "viralScore",
                      "style",
                    ],
                  },
                },
              },
              required: ["concepts"],
            },
          },
        }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      const message =
        data?.error?.message || "Gemini API request failed."

      return NextResponse.json(
        { error: message },
        { status: response.status }
      )
    }

    const text = data?.steps
      ?.filter((step: any) => step?.type === "model_output")
      ?.flatMap((step: any) =>
        Array.isArray(step?.content) ? step.content : []
      )
      ?.filter((content: any) => content?.type === "text")
      ?.map((content: any) => content.text)
      ?.join("\n")

    if (!text) {
      return NextResponse.json(
        { error: "Gemini returned an empty response." },
        { status: 502 }
      )
    }

    let parsed: unknown

    try {
      parsed = JSON.parse(text)
    } catch {
      return NextResponse.json(
        { error: "Gemini returned invalid JSON. Please try again." },
        { status: 502 }
      )
    }

    const concepts = Array.isArray(
      (parsed as { concepts?: unknown })?.concepts
    )
      ? (parsed as { concepts: unknown[] }).concepts.slice(0, 5)
      : []

    const safeConcepts = concepts.map((concept, index) => {
      const item = (concept ?? {}) as Record<string, unknown>

      const score = Number(item.viralScore)

      return {
        id: String(item.id || `ai-${index + 1}`),
        name: String(item.name || `AI Concept ${index + 1}`),
        strategy: String(
          item.strategy || "A social-first creative strategy."
        ),
        hook: String(
          item.hook || "Stop the scroll with a clear product moment."
        ),
        script: String(
          item.script ||
            "Open with the hook, demonstrate the product benefit, then close with the CTA."
        ),
        cta: String(item.cta || "Discover it today."),
        viralScore: Number.isFinite(score)
          ? Math.max(60, Math.min(98, Math.round(score)))
          : 75,
        style: String(item.style || style),
      }
    })

    if (safeConcepts.length < 5) {
      return NextResponse.json(
        {
          error:
            "Gemini generated fewer than five concepts. Please try again.",
        },
        { status: 502 }
      )
    }

    return NextResponse.json({
      concepts: safeConcepts,
    })
  } catch (error) {
    console.error("generate-campaign error", error)

    return NextResponse.json(
      {
        error:
          "Unable to generate the campaign right now. Please try again.",
      },
      { status: 500 }
    )
  }
}
