import { NextResponse } from "next/server"

export async function POST() {
  return NextResponse.json({
    error: "Free browser video mode is enabled. Video generation no longer uses Magic Hour credits.",
  }, { status: 410 })
}
