import { NextResponse } from "next/server"

// Free campaign generator: no external API, no API key, no paid credits.
// It creates five ready-to-use social advertising concepts from the user's brief.

function clean(value: unknown, fallback: string) {
  const text = String(value ?? "").trim()
  return text || fallback
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const productName = clean(body.productName, "Your product")
    const description = clean(body.description, "A product designed to make everyday moments better.")
    const country = clean(body.country, "Global")
    const audience = clean(body.audience, "General audience")
    const goal = clean(body.goal, "sales")
    const style = clean(body.style, "viral")

    const goalText: Record<string, string> = {
      sales: "drive action and product interest",
      awareness: "build memorable brand awareness",
      "product-launch": "create excitement around the product launch",
      "social-media": "maximize social engagement and sharing",
    }

    const styleText: Record<string, string> = {
      viral: "fast-paced, highly shareable and scroll-stopping",
      emotional: "warm, emotional and relatable",
      luxury: "premium, elegant and aspirational",
      funny: "light, playful and humorous",
      cinematic: "visual, dramatic and cinematic",
    }

    const objective = goalText[goal] || goalText.sales
    const creativeStyle = styleText[style] || styleText.viral

    const concepts = [
      {
        id: "free-1",
        name: "The Scroll Stopper",
        strategy: `A ${creativeStyle} opening built around a surprising first-second visual to ${objective}.`,
        hook: `"Wait... have you tried ${productName}? 👀"`,
        script: `Open with a close-up of ${productName} and a fast visual transition. Show the product in use, then reveal the key message: ${description}. End with a clean product shot and an invitation to discover ${productName}.`,
        cta: "Discover the moment. ✨",
        viralScore: 94,
        style: "Viral",
      },
      {
        id: "free-2",
        name: "One Moment, One Product",
        strategy: `A relatable everyday scenario for ${audience}, designed to make the product feel natural and memorable in ${country}.`,
        hook: `"That little moment that just got better. ❤️"`,
        script: `Start with an ordinary everyday moment. Introduce ${productName} naturally, show ${description}, and finish with a smile or satisfying product moment. Keep the pacing quick and authentic for short-form social video.`,
        cta: "Share the moment. ❤️",
        viralScore: 91,
        style: "Viral",
      },
      {
        id: "free-3",
        name: "3 Seconds to Discover",
        strategy: `A quick three-beat reveal that communicates the product idea immediately and encourages viewers to watch to the end.`,
        hook: `"3 seconds. 1 reason to remember ${productName}."`,
        script: `Beat one: reveal ${productName}. Beat two: demonstrate the main benefit suggested by the brief — ${description}. Beat three: show the final result and brand/product shot. Use on-screen captions so the idea works with sound off.`,
        cta: "See why it stands out. 🚀",
        viralScore: 93,
        style: "Viral",
      },
      {
        id: "free-4",
        name: "Pass It On",
        strategy: `A social-first concept built around sharing, reactions and tagging friends while keeping claims grounded in the supplied product description.`,
        hook: `"Send this to someone who needs ${productName}. 👇"`,
        script: `Show a creator discovering ${productName}, followed by a quick demonstration and genuine reaction. Cut to a second person receiving or trying it. Close on the product and a simple invitation to share the video with someone who would enjoy it.`,
        cta: "Tag someone who would love it. 👇",
        viralScore: 95,
        style: "Viral",
      },
      {
        id: "free-5",
        name: "The Brand Moment",
        strategy: `A polished hero-style social ad that makes ${productName} visually memorable while supporting ${objective}.`,
        hook: `${productName}. One product. One unforgettable moment. ✨`,
        script: `Use a clean hero shot of ${productName}, dynamic movement and bold captions. Highlight the core message: ${description}. Finish with a confident product close-up, brand moment and a concise call to action.`,
        cta: "Make your moment memorable. ✨",
        viralScore: 89,
        style: "Viral",
      },
    ]

    return NextResponse.json({
      concepts,
      freeMode: true,
      note: "Generated locally in free mode. No external AI API or paid video credits are required.",
    })
  } catch (error) {
    console.error("generate-campaign error", error)
    return NextResponse.json({ error: "Unable to generate the campaign. Please try again." }, { status: 400 })
  }
}
