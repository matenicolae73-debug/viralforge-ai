"use client"

import { useState } from "react"
import { Sparkles, Loader2, RefreshCw, Target, Wand2 } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { ConceptCard } from "@/components/concept-card"
import { ImageUpload } from "@/components/image-upload"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { COUNTRIES, AUDIENCES, GOALS, STYLES, SAMPLE_CONCEPTS } from "@/lib/sample-data"

type Status = "idle" | "generating" | "done"

export default function CreateCampaignPage() {
  const [status, setStatus] = useState<Status>("idle")
  const [productName, setProductName] = useState("")
  const [description, setDescription] = useState("")
  const [country, setCountry] = useState("United States")
  const [audience, setAudience] = useState(AUDIENCES[0])
  const [goal, setGoal] = useState<string>("sales")
  const [style, setStyle] = useState<string>("viral")
  const [concepts, setConcepts] = useState(SAMPLE_CONCEPTS)
  const [error, setError] = useState("")

  async function generate() {
    if (status === "generating") return
    if (!productName.trim()) {
      setError("Please enter a product name first.")
      return
    }

    setError("")
    setStatus("generating")

    try {
      // Free local generation: the browser creates the campaign concepts itself.
      // No external API, API key, server request, or paid credits are required.
      const product = productName.trim()
      const desc = description.trim() || "A product designed to make everyday moments better."

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

      const generated = [
        { id: `local-1-${Date.now()}`, name: "The Scroll Stopper", strategy: `A ${creativeStyle} opening built to ${objective}.`, hook: `\"Wait... have you tried ${product}? 👀\"`, script: `Open with a striking close-up of ${product}. Quickly show the product in use and communicate: ${desc}. Finish with a clean hero shot and a strong CTA.`, cta: "Discover the moment. ✨", viralScore: 94, style: style },
        { id: `local-2-${Date.now()}`, name: "One Moment, One Product", strategy: `A relatable concept for ${audience} in ${country}.`, hook: `\"That little moment that just got better. ❤️\"`, script: `Start with an everyday situation. Introduce ${product} naturally, show ${desc}, then end with a satisfying reaction and product shot.`, cta: "Share the moment. ❤️", viralScore: 91, style: style },
        { id: `local-3-${Date.now()}`, name: "3 Seconds to Discover", strategy: `A fast three-beat reveal designed for short-form social video.`, hook: `\"3 seconds. 1 reason to remember ${product}.\"`, script: `Beat one: reveal ${product}. Beat two: show the key message — ${desc}. Beat three: reveal the final product shot and CTA.`, cta: "See why it stands out. 🚀", viralScore: 93, style: style },
        { id: `local-4-${Date.now()}`, name: "Pass It On", strategy: `A social-first idea designed to encourage reactions, shares and tags.`, hook: `\"Send this to someone who needs ${product}. 👇\"`, script: `Show someone discovering ${product}, followed by a quick demonstration and genuine reaction. End with a shareable product moment and CTA.`, cta: "Tag someone who would love it. 👇", viralScore: 95, style: style },
        { id: `local-5-${Date.now()}`, name: "The Brand Moment", strategy: `A polished hero-style ad built to ${objective}.`, hook: `${product}. One product. One unforgettable moment. ✨`, script: `Use dynamic movement, bold captions and a clean hero shot of ${product}. Highlight: ${desc}. Finish with a confident brand moment and CTA.`, cta: "Make your moment memorable. ✨", viralScore: 89, style: style },
      ]

      // Small delay keeps the UI animation natural while everything remains local.
      await new Promise((resolve) => window.setTimeout(resolve, 350))
      setConcepts(generated)
      setStatus("done")
      window.setTimeout(() => {
        document.getElementById("concepts")?.scrollIntoView({ behavior: "smooth", block: "start" })
      }, 50)
    } catch (err) {
      setStatus("idle")
      setError(err instanceof Error ? err.message : "Unable to generate the campaign.")
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Create Campaign"
        description="Tell us about your product and audience. VIRALFORGE AI will generate five advertising concepts optimized for engagement."
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display">
              <Wand2 className="h-5 w-5 text-primary" />
              Campaign brief
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <ImageUpload label="Product image" hint="PNG or JPG, up to 10MB" />
              <ImageUpload label="Brand logo" hint="Transparent PNG recommended" aspect="square" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="product">Product name</Label>
              <Input
                id="product"
                placeholder="e.g. Radiance Serum"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="desc">Product description</Label>
              <Textarea
                id="desc"
                rows={4}
                placeholder="Describe what your product does, its key benefits, and what makes it special..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label>Target country</Label>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Target audience</Label>
                <Select value={audience} onValueChange={setAudience}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select audience" />
                  </SelectTrigger>
                  <SelectContent>
                    {AUDIENCES.map((a) => (
                      <SelectItem key={a} value={a}>
                        {a}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Campaign goal</Label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {GOALS.map((g) => (
                  <OptionChip key={g.id} active={goal === g.id} onClick={() => setGoal(g.id)}>
                    {g.label}
                  </OptionChip>
                ))}
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Advertising style</Label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                {STYLES.map((s) => (
                  <OptionChip key={s.id} active={style === s.id} onClick={() => setStyle(s.id)}>
                    {s.label}
                  </OptionChip>
                ))}
              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <button
              type="button"
              className="forge-glow flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:pointer-events-none disabled:opacity-60"
              onClick={generate}
              disabled={status === "generating"}
            >
              {status === "generating" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Forging concepts...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate Campaign
                </>
              )}
            </button>
          </CardContent>
        </Card>

        {/* Tips sidebar */}
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-display">
                <Target className="h-4 w-4 text-primary" />
                How it works
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 text-sm text-muted-foreground">
              {[
                "Add your product details and brand assets.",
                "Choose the goal and advertising style that fit your objective.",
                "Generate five distinct concepts, each with strategy, hook, and script.",
                "Edit, score, and send your favorite straight to Video Studio.",
              ].map((t, i) => (
                <div key={i} className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                    {i + 1}
                  </span>
                  <p className="leading-relaxed">{t}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-primary/25 bg-primary/5">
            <CardContent className="p-5">
              <p className="text-sm leading-relaxed text-muted-foreground">
                VIRALFORGE AI optimizes advertising content for stronger engagement and performance. Results depend on
                your product, audience, and platform.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Results */}
      {status !== "idle" && (
        <div id="concepts" className="flex flex-col gap-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold tracking-tight">
                {status === "generating" ? "Generating concepts..." : "Your 5 advertising concepts"}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {productName ? `For "${productName}"` : "Tailored to your brief"} · {STYLES.find((s) => s.id === style)?.label} ·{" "}
                {GOALS.find((g) => g.id === goal)?.label}
              </p>
            </div>
            {status === "done" && (
              <Button variant="outline" onClick={generate}>
                <RefreshCw className="h-4 w-4" />
                Regenerate
              </Button>
            )}
          </div>

          {status === "generating" ? (
            <div className="grid gap-6 lg:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-72 animate-pulse rounded-xl border border-border bg-card" />
              ))}
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">
              {concepts.map((c, i) => (
                <ConceptCard key={c.id} concept={c} index={i} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function OptionChip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors",
        active
          ? "border-primary bg-primary/15 text-primary"
          : "border-border bg-secondary/40 text-muted-foreground hover:border-primary/40 hover:text-foreground",
      )}
    >
      {children}
    </button>
  )
}
