import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const apiKey = process.env.MAGIC_HOUR_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "MAGIC_HOUR_API_KEY is not configured on the server." }, { status: 500 })
    }

    const id = new URL(request.url).searchParams.get("id")?.trim()
    if (!id) return NextResponse.json({ error: "Missing video project id." }, { status: 400 })

    const response = await fetch(`https://api.magichour.ai/v1/video-projects/${encodeURIComponent(id)}`, {
      headers: { accept: "application/json", authorization: `Bearer ${apiKey}` },
      cache: "no-store",
    })

    const data = await response.json()
    if (!response.ok) {
      const message = data?.message || data?.error?.message || "Unable to check Magic Hour video status."
      return NextResponse.json({ error: message }, { status: response.status })
    }

    const videoUrl = Array.isArray(data?.downloads) ? data.downloads[0]?.url : undefined
    return NextResponse.json({
      id: data?.id,
      status: data?.status,
      videoUrl,
      error: data?.error?.message || data?.error || null,
      creditsCharged: data?.credits_charged,
    })
  } catch (error) {
    console.error("video-status error", error)
    return NextResponse.json({ error: "Unable to check video status right now." }, { status: 500 })
  }
}
