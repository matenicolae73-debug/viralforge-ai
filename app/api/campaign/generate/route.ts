export const runtime = "nodejs"
import {NextResponse} from "next/server"
import {generateCampaign} from "@/lib/ai"

export async function POST(req: Request) {
  try {
    const b = await req.json()
    const product = String(b.product || "").trim()
    if (!product || product.length > 120) return NextResponse.json({ok:false,error:"Product name is required (max 120 characters)."}, {status:400})
    const result = await generateCampaign({
      product,
      description: String(b.description || "").trim().slice(0,1000),
      audience: String(b.audience || "").trim().slice(0,300),
      goal: String(b.goal || "").trim().slice(0,300),
      platform: String(b.platform || "").trim().slice(0,300),
      style: String(b.style || "").trim().slice(0,200),
      language: String(b.language || "English").trim().slice(0,60),
    })
    return NextResponse.json({ok:true,...result})
  } catch (e:any) {
    return NextResponse.json({ok:false,error:e?.message || "Campaign generation failed."},{status:500})
  }
}
