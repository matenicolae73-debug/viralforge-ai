import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    error: "Export is handled directly in the browser in free mode.",
  }, { status: 410 })
}
