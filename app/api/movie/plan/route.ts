export const runtime = "nodejs"
import {NextResponse} from "next/server"
import {makeMoviePlan} from "@/lib/ai"

export async function POST(req: Request) {
  try {
    const b = await req.json()
    const title = String(b.title || "").trim()
    const story = String(b.story || "").trim()
    if (!title || !story) return NextResponse.json({ok:false,error:"Title and story are required."},{status:400})
    const minutes = Number(b.minutes)
    if (!Number.isFinite(minutes) || minutes < 1 || minutes > 10) return NextResponse.json({ok:false,error:"Film duration must be between 1 and 10 minutes."},{status:400})
    return NextResponse.json({ok:true,plan:makeMoviePlan({
      title,story,minutes,
      genre:String(b.genre||"cinematic"),
      language:String(b.language||"English")
    })})
  } catch(e:any) {
    return NextResponse.json({ok:false,error:e?.message || "Movie planning failed."},{status:500})
  }
}
