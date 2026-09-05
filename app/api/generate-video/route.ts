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
    const orientation = String(body.orientation ?? "portrait")
    const aspectRatio = String(body.aspectRatio ?? "9:16")
    const duration = Math.max(
      4,
      Math.min(8, Number(body.duration) || 5)
    )

    if (!prompt) {
      return NextResponse.json(
        { error: "Please enter a video prompt or script." },
        { status: 400 }
      )
    }

    const response = await fetch(`${API_BASE}/text-to-video`, {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        name: "ViralForge AI Ad",
        end_seconds: duration,
        orientation:
          orientation === "landscape"
            ? "landscape"
            : orientation === "square"
              ? "square"
              : "portrait",
        aspect_ratio: aspectRatio,
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

      return NextResponse.json(
        { error: message },
        { status: response.status }
      )
    }

    return NextResponse.json({
      projectId: data?.id,
      creditsCharged: data?.credits_charged,
    })
  } catch (error) {
    console.error("generate-video error", error)

    return NextResponse.json(
      { error: "Unable to start video generation right now." },
      { status: 500 }
    )
  }
}
