export type CampaignInput = {
  product: string
  description: string
  audience: string
  goal: string
  platform: string
  style: string
  language: string
}

export type CampaignPlan = {
  campaignName: string
  hook: string
  slogan: string
  coreMessage: string
  callToAction: string
  audience: string
  platforms: string[]
  ads: Array<{
    duration: number
    format: string
    script: string
    visualPrompt: string
    caption: string
  }>
}

function localCampaign(input: CampaignInput): CampaignPlan {
  const p = input.product || "your product"
  const audience = input.audience || "your target audience"
  const platform = input.platform || "TikTok, Instagram Reels, Facebook Reels"
  const lang = input.language || "English"
  return {
    campaignName: `${p} — Viral Launch`,
    hook: `Stop scrolling: discover why ${audience} is choosing ${p}.`,
    slogan: `${p}. Made to be remembered.`,
    coreMessage: input.description || `${p} gives people a simple reason to choose it today.`,
    callToAction: input.goal.toLowerCase().includes("sale") || input.goal.toLowerCase().includes("sales")
      ? `Try ${p} today.`
      : `Discover ${p} today.`,
    audience,
    platforms: platform.split(",").map(s => s.trim()).filter(Boolean),
    ads: [
      {
        duration: 10,
        format: "Vertical 9:16",
        script: `[${lang}] HOOK: Stop scrolling. ${p} is here.\nPROBLEM: Show the everyday frustration.\nSOLUTION: Reveal ${p} in a fast, satisfying product shot.\nPAYOFF: Show the result and a reaction.\nCTA: ${input.goal || `Discover ${p} today`}.`,
        visualPrompt: `High-energy social media commercial for ${p}, ${input.description}, aimed at ${audience}. Fast cuts, premium product close-ups, expressive human reaction, cinematic lighting, clear product hero shot, vertical 9:16.`,
        caption: `${p} is made for the moment you want a better result. ${input.goal || "Discover it today."} #viral #advertising #${p.replace(/[^a-z0-9]/gi,"").toLowerCase()}`,
      },
      {
        duration: 15,
        format: "Vertical 9:16",
        script: `HOOK: “What if ${p} could change the way you do this?”\nDEMO: Demonstrate the key benefit.\nPROOF: Show a before/after or customer reaction.\nCTA: ${input.goal || `Try ${p} today`}.`,
        visualPrompt: `15-second direct-response advertisement for ${p}. Start with a visual pattern interrupt, demonstrate the product benefit clearly, show a believable result, then finish with a strong logo/product packshot and CTA. Vertical 9:16.`,
        caption: `See the difference. ${p}. ${input.goal || "Try it today."}`,
      },
      {
        duration: 30,
        format: "Horizontal 16:9",
        script: `OPEN: Introduce the audience problem.\nSTORY: Follow one person using ${p}.\nTRANSFORMATION: Show the result and why it matters.\nCLOSE: Brand message, slogan, and CTA.`,
        visualPrompt: `30-second cinematic brand commercial for ${p}. Audience: ${audience}. Story-driven progression from problem to transformation. Premium cinematography, natural acting, strong visual identity, polished product hero shot, ending with a memorable brand frame. 16:9.`,
        caption: `${p}. ${input.description || "A better way forward."} ${input.goal || "Learn more."}`,
      }
    ]
  }
}

function extractJson(text: string): unknown {
  const fenced = text.match(/```json\s*([\s\S]*?)\s*```/i) || text.match(/```\s*([\s\S]*?)\s*```/i)
  const candidate = fenced?.[1] || text
  const start = candidate.indexOf("{")
  const end = candidate.lastIndexOf("}")
  if (start < 0 || end <= start) throw new Error("AI response did not contain JSON.")
  return JSON.parse(candidate.slice(start, end + 1))
}

export async function generateCampaign(input: CampaignInput): Promise<{plan: CampaignPlan; source: "gemini"|"local"}> {
  const key = process.env.GEMINI_API_KEY
  if (!key) return {plan: localCampaign(input), source: "local"}

  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash"
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(key)}`
  const prompt = `Create a complete advertising campaign as JSON only.
Product: ${input.product}
Description: ${input.description}
Audience: ${input.audience}
Goal: ${input.goal}
Platforms: ${input.platform}
Style: ${input.style}
Language: ${input.language}
Return this shape:
{
 "campaignName": string,
 "hook": string,
 "slogan": string,
 "coreMessage": string,
 "callToAction": string,
 "audience": string,
 "platforms": string[],
 "ads": [
   {"duration":10,"format":"Vertical 9:16","script":string,"visualPrompt":string,"caption":string},
   {"duration":15,"format":"Vertical 9:16","script":string,"visualPrompt":string,"caption":string},
   {"duration":30,"format":"Horizontal 16:9","script":string,"visualPrompt":string,"caption":string}
 ]
}
Make the scripts practical for video generation and keep the brand/product visible.`
  try {
    const r = await fetch(endpoint, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({contents:[{parts:[{text:prompt}]}], generationConfig:{temperature:0.8}}),
      cache: "no-store"
    })
    if (!r.ok) throw new Error(`Gemini ${r.status}`)
    const data = await r.json()
    const text = data?.candidates?.[0]?.content?.parts?.map((x:any)=>x.text||"").join("") || ""
    const parsed = extractJson(text) as CampaignPlan
    if (!parsed?.ads?.length) throw new Error("Empty campaign response.")
    return {plan: parsed, source:"gemini"}
  } catch {
    return {plan: localCampaign(input), source:"local"}
  }
}

export function makeMoviePlan(input: {title:string; story:string; minutes:number; genre:string; language:string}) {
  const minutes = Math.min(10, Math.max(1, Math.round(input.minutes || 10)))
  const totalSeconds = minutes * 60
  const sceneSeconds = 8
  const sceneCount = Math.ceil(totalSeconds / sceneSeconds)
  const scenes = Array.from({length: sceneCount}, (_, i) => {
    const start = i * sceneSeconds
    const end = Math.min(totalSeconds, start + sceneSeconds)
    const act = i < sceneCount * 0.25 ? "ACT I — Setup" : i < sceneCount * 0.75 ? "ACT II — Conflict" : "ACT III — Resolution"
    return {
      scene: i + 1,
      startSecond: start,
      endSecond: end,
      duration: end - start,
      act,
      prompt: `Cinematic ${input.genre || "drama"} scene ${i+1} for "${input.title}". Story context: ${input.story}. Maintain character, wardrobe, location, lighting and visual continuity from the previous scene. No text overlays. ${input.language || "English"} dialogue only if dialogue is needed.`
    }
  })
  return {
    title: input.title || "Untitled Film",
    genre: input.genre || "cinematic",
    language: input.language || "English",
    targetDurationSeconds: totalSeconds,
    sceneDurationSeconds: sceneSeconds,
    sceneCount,
    scenes
  }
}
