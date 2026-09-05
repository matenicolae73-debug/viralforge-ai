"use client"

import { useEffect, useState } from "react"
import { Play, Pause, Download, Captions, Music2, Mic, Sparkles } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { FORMATS, VOICES, MUSIC_TRACKS, SAMPLE_SCENES } from "@/lib/sample-data"

export default function VideoStudioPage() {
  const [format, setFormat] = useState(FORMATS[0].id)
  const [playing, setPlaying] = useState(false)
  const [activeScene, setActiveScene] = useState(SAMPLE_SCENES[0].id)
  const [subtitles, setSubtitles] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [videoStatus, setVideoStatus] = useState<string | null>(null)
  const [videoError, setVideoError] = useState<string | null>(null)

  const currentFormat = FORMATS.find((f) => f.id === format)!
  const isWide = currentFormat.ratio === "16:9"
  const isSquare = currentFormat.ratio === "1:1"

  const generateVideo = async () => {
    setGenerating(true)
    setVideoError(null)
    setVideoUrl(null)
    setVideoStatus("Starting video generation…")

    try {
      const prompt = `Create a polished ${currentFormat.label} social media advertisement. ${
        `Scene: ${SAMPLE_SCENES.map((s) => `${s.label}: ${s.description}`).join(". ")}. `
      }Use dynamic camera movement, clear product focus, premium advertising cinematography, strong visual hook, realistic motion, and clean composition. Do not add fake logos or unsupported claims.`

      const response = await fetch("/api/generate-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          orientation: isWide ? "landscape" : isSquare ? "square" : "portrait",
          aspectRatio: currentFormat.ratio,
          duration: 5,
        }),
      })

      const data = await response.json()
      if (!response.ok || !data.projectId) throw new Error(data.error || "Video generation could not be started.")

      setVideoStatus("Rendering video…")
      for (let attempt = 0; attempt < 30; attempt++) {
        await new Promise((resolve) => setTimeout(resolve, 5000))
        const statusResponse = await fetch(`/api/video-status?id=${encodeURIComponent(data.projectId)}`, { cache: "no-store" })
        const statusData = await statusResponse.json()
        if (!statusResponse.ok) throw new Error(statusData.error || "Could not check video status.")

        if (statusData.status === "complete" && statusData.videoUrl) {
          setVideoUrl(statusData.videoUrl)
          setVideoStatus("Video ready")
          return
        }
        if (["error", "canceled"].includes(statusData.status)) {
          throw new Error(statusData.error || `Video generation ${statusData.status}.`)
        }
      }

      setVideoStatus("Still rendering — keep this page open and try again shortly.")
    } catch (error) {
      setVideoError(error instanceof Error ? error.message : "Video generation failed.")
      setVideoStatus(null)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Video Studio"
        description="Assemble scenes, refine the script, choose voice and music, and export for every platform."
      >
        <Button>
          <Download className="h-4 w-4" />
          Export video
        </Button>
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        {/* Preview + timeline */}
        <div className="flex flex-col gap-6">
          <Card>
            <CardContent className="p-5">
              <div className="flex justify-center">
                <div
                  className={cn(
                    "relative flex items-center justify-center overflow-hidden rounded-xl border border-border bg-gradient-to-br from-secondary to-background",
                    isWide ? "aspect-video w-full" : isSquare ? "aspect-square w-full max-w-md" : "aspect-[9/16] w-full max-w-[280px]",
                  )}
                >
                  <div
                    className="pointer-events-none absolute inset-0 opacity-70"
                    style={{
                      background:
                        "radial-gradient(circle at 30% 30%, oklch(0.7 0.19 47 / 0.4), transparent 55%), radial-gradient(circle at 75% 70%, oklch(0.82 0.15 78 / 0.25), transparent 55%)",
                    }}
                  />
                  {videoUrl ? (
                    <video
                      className="absolute inset-0 h-full w-full object-cover"
                      src={videoUrl}
                      controls
                      playsInline
                    />
                  ) : (
                    <button
                      onClick={() => setPlaying((v) => !v)}
                      className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105"
                      aria-label={playing ? "Pause preview" : "Play preview"}
                    >
                      {playing ? <Pause className="h-7 w-7" /> : <Play className="ml-1 h-7 w-7" />}
                    </button>
                  )}
                  {subtitles && (
                    <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 rounded bg-background/80 px-3 py-1 text-center text-xs font-medium backdrop-blur-sm">
                      {"I did NOT expect this to work in 3 seconds..."}
                    </div>
                  )}
                  <span className="absolute left-3 top-3 z-10 rounded bg-background/70 px-2 py-1 text-xs font-medium backdrop-blur-sm">
                    {currentFormat.label} · {currentFormat.ratio}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {videoStatus && (
            <div className="rounded-lg border border-border bg-secondary/40 px-4 py-3 text-sm text-muted-foreground">{videoStatus}</div>
          )}
          {videoError && (
            <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">{videoError}</div>
          )}

          {/* Scene timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-display">Scene timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {SAMPLE_SCENES.map((s, i) => (
                  <button
                    key={s.id}
                    onClick={() => setActiveScene(s.id)}
                    className={cn(
                      "flex w-40 shrink-0 flex-col gap-1 rounded-lg border p-3 text-left transition-colors",
                      activeScene === s.id
                        ? "border-primary bg-primary/10"
                        : "border-border bg-secondary/40 hover:border-primary/40",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-primary">Scene {i + 1}</span>
                      <span className="text-[10px] text-muted-foreground">{s.duration}</span>
                    </div>
                    <span className="text-sm font-medium">{s.label}</span>
                    <span className="text-xs leading-snug text-muted-foreground">{s.description}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Script editor */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-display">
                <Sparkles className="h-4 w-4 text-primary" />
                Script editor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                rows={7}
                className="text-sm leading-relaxed"
                defaultValue={
                  "[0:00] HOOK — Open on a frustrated close-up. Bold kinetic text: \"I did NOT expect this...\"\n\n[0:03] PROBLEM — Show the everyday friction point up close.\n\n[0:07] REVEAL — Snap transition to the product in action.\n\n[0:12] PROOF — Benefit demo with overlay callouts.\n\n[0:20] CTA — Logo lockup: \"Tap to try it risk-free today.\""
                }
              />
            </CardContent>
          </Card>
        </div>

        {/* Settings */}
        <div className="flex flex-col gap-6">
          {/* Format */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-display">Format</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {FORMATS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFormat(f.id)}
                    className={cn(
                      "flex flex-col gap-0.5 rounded-lg border px-3 py-2.5 text-left transition-colors",
                      format === f.id
                        ? "border-primary bg-primary/15 text-primary"
                        : "border-border bg-secondary/40 text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <span className="text-sm font-medium">{f.label}</span>
                    <span className="text-xs opacity-80">{f.ratio}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Audio */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-display">Audio &amp; captions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <div className="grid gap-2">
                <Label className="flex items-center gap-1.5">
                  <Mic className="h-3.5 w-3.5" />
                  Voiceover
                </Label>
                <Select defaultValue={VOICES[0]}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {VOICES.map((v) => (
                      <SelectItem key={v} value={v}>
                        {v}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label className="flex items-center gap-1.5">
                  <Music2 className="h-3.5 w-3.5" />
                  Music track
                </Label>
                <Select defaultValue={MUSIC_TRACKS[0]}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MUSIC_TRACKS.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Music volume</Label>
                <Slider defaultValue={[40]} max={100} step={1} />
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/40 px-3 py-3">
                <Label htmlFor="subs" className="flex items-center gap-2">
                  <Captions className="h-4 w-4 text-primary" />
                  Subtitles
                </Label>
                <Switch id="subs" checked={subtitles} onCheckedChange={setSubtitles} />
              </div>
            </CardContent>
          </Card>

          <Button size="lg" className="w-full forge-glow" onClick={generateVideo} disabled={generating}>
            <Sparkles className="h-4 w-4" />
            {generating ? "Generating video…" : "Generate AI video"}
          </Button>

          <Button size="lg" variant="outline" className="w-full" disabled={!videoUrl}>
            <Download className="h-4 w-4" />
            Export {currentFormat.label}
          </Button>
        </div>
      </div>
    </div>
  )
}
