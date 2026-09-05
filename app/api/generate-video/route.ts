import { NextResponse } from "next/server"

const API_BASE = "https://api.magichour.ai/v1"

export async function POST(request: Request) {
  try {
    const apiKey = process.env.MAGIC_HOUR_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: "MAGIC_HOUR_API_KEY is not configured on the server." },
        { status: 500 }
      )
    }

    const body = await request.json()

    const prompt = String(body.prompt ?? "").trim()
    const aspectRatio = String(body.aspectRatio ?? "9:16")

    // LTX-2.5 supports 20 and 25 seconds.
    // Default to 25 seconds for ViralForge advertisements.
    const requestedDuration = Number(body.duration) || 25

    const supportedDurations = [20, 25]

    const duration = supportedDurations.includes(requestedDuration)
      ? requestedDuration
      : 25

    if (!prompt) {
      return NextResponse.json(
        { error: "Please enter a video prompt or script." },
        { status: 400 }
      )
    }

    const safeAspectRatio =
      aspectRatio === "16:9"
        ? "16:9"
        : aspectRatio === "1:1"
          ? "1:1"
          : "9:16"

    const response = await fetch(`${API_BASE}/text-to-video`, {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        name: "ViralForge AI Ad",
        model: "ltx-2.5",
        end_seconds: duration,
        aspect_ratio: safeAspectRatio,
        resolution: "480p",
        style: {
          prompt,
        },
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      const message =
        data?.message ||
        data?.error?.message ||
        "Magic Hour video generation failed."

      console.error("Magic Hour error:", data)

      return NextResponse.json(
        { error: message },
        { status: response.status }
      )
    }

    return NextResponse.json({
      projectId: data?.id,
      creditsCharged: data?.credits_charged,
      duration,
      model: "ltx-2.5",
    })
  } catch (error) {
    console.error("generate-video error", error)

    return NextResponse.json(
      { error: "Unable to start video generation right now." },
      { status: 500 }
    )
  }
}
