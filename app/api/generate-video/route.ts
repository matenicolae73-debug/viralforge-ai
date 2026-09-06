import { NextResponse } from "next/server"

const URL = "https://8scale.run/wan-2.2/14b/text-to-video"

export async function POST(req: Request) {
  try {
    const b = await req.json()

    const prompt = String(b?.prompt || "").trim()

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required." },
        { status: 400 }
      )
    }

    const key = process.env.EIGHTSCALE_API_KEY

    if (!key) {
      return NextResponse.json(
        {
          error:
            "EIGHTSCALE_API_KEY is missing in Vercel Environment Variables.",
        },
        { status: 503 }
      )
    }

    const r = await fetch(URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        resolution: b?.resolution === "720p" ? "720p" : "480p",
        aspect_ratio: ["16:9", "9:16", "1:1"].includes(b?.aspectRatio)
          ? b.aspectRatio
          : "16:9",
      }),
      cache: "no-store",
    })

    const text = await r.text()

    let providerResponse: any

    try {
      providerResponse = JSON.parse(text)
    } catch {
      providerResponse = {
        raw: text,
      }
    }

    if (!r.ok) {
      return NextResponse.json(
        {
          ok: false,
          error:
            providerResponse?.error ||
            providerResponse?.message ||
            `Provider error ${r.status}`,
          providerResponse,
        },
        { status: 502 }
      )
    }

    return NextResponse.json({
      ok: true,
      message: "Video request accepted by 8Scale.",
      videoUrl:
        providerResponse?.video_url ||
        providerResponse?.videoUrl ||
        providerResponse?.url ||
        providerResponse?.output?.video_url ||
        providerResponse?.output?.videoUrl ||
        providerResponse?.output?.url ||
        providerResponse?.data?.video_url ||
        providerResponse?.data?.videoUrl ||
        providerResponse?.data?.url ||
        null,
      providerResponse,
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        ok: false,
        error: error?.message || "Server error",
      },
      { status: 500 }
    )
  }
}
