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
    setVideoStatus("Creating free browser video…")

    try {
      if (typeof window === "undefined" || !HTMLCanvasElement.prototype.captureStream || !window.MediaRecorder) {
        throw new Error("Your browser does not support free browser video export. Try Chrome or Edge.")
      }

      const canvas = document.createElement("canvas")
      const width = isWide ? 1280 : 720
      const height = isWide ? 720 : isSquare ? 720 : 1280
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext("2d")
      if (!ctx) throw new Error("Could not start the video canvas.")

      const stream = canvas.captureStream(30)
      const mimeTypes = ["video/webm;codecs=vp9", "video/webm;codecs=vp8", "video/webm"]
      const mimeType = mimeTypes.find((type) => MediaRecorder.isTypeSupported(type))
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined)
      const chunks: BlobPart[] = []
      recorder.ondataavailable = (event) => event.data.size && chunks.push(event.data)

      const scenes = [
        { title: "STOP THE SCROLL", text: "I did NOT expect this to work in 3 seconds…" },
        { title: "THE PROBLEM", text: "Show the everyday friction point." },
        { title: "THE REVEAL", text: "Your product enters the story." },
        { title: "THE PROOF", text: "Highlight the key benefit." },
        { title: "CALL TO ACTION", text: "Tap to try it today." },
      ]

      const drawFrame = (time: number) => {
        const duration = 8000
        const progress = Math.min(1, time / duration)
        const sceneIndex = Math.min(scenes.length - 1, Math.floor(progress * scenes.length))
        const scene = scenes[sceneIndex]
        const local = (progress * scenes.length) % 1
        const scale = 0.96 + Math.min(local, 1 - local) * 0.08

        ctx.save()
        ctx.fillStyle = "#11100f"
        ctx.fillRect(0, 0, width, height)
        const gradient = ctx.createLinearGradient(0, 0, width, height)
        gradient.addColorStop(0, "#2a1b12")
        gradient.addColorStop(0.5, "#11100f")
        gradient.addColorStop(1, "#49331b")
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, width, height)

        ctx.translate(width / 2, height / 2)
        ctx.scale(scale, scale)
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillStyle = "rgba(255,255,255,0.65)"
        ctx.font = `700 ${Math.max(22, width * 0.028)}px sans-serif`
        ctx.fillText(`VIRALFORGE AI  ·  ${currentFormat.label}`, 0, -height * 0.27)
        ctx.fillStyle = "white"
        ctx.font = `900 ${Math.max(38, width * 0.065)}px sans-serif`
        ctx.fillText(scene.title, 0, -height * 0.08)
        ctx.fillStyle = "rgba(255,255,255,0.9)"
        ctx.font = `500 ${Math.max(24, width * 0.032)}px sans-serif`
        const words = scene.text.split(" ")
        let line = ""
        const lines: string[] = []
        const maxWidth = width * 0.78
        for (const word of words) {
          const test = line ? `${line} ${word}` : word
          if (ctx.measureText(test).width > maxWidth && line) {
            lines.push(line)
            line = word
          } else line = test
        }
        if (line) lines.push(line)
        lines.forEach((text, i) => ctx.fillText(text, 0, height * 0.03 + i * Math.max(32, width * 0.04)))
        ctx.fillStyle = "rgba(255,255,255,0.18)"
        ctx.fillRect(-width * 0.34, height * 0.22, width * 0.68, 8)
        ctx.fillStyle = "white"
        ctx.fillRect(-width * 0.34, height * 0.22, width * 0.68 * progress, 8)
        ctx.restore()
      }

      recorder.start()
      const started = performance.now()
      await new Promise<void>((resolve) => {
        const frame = (now: number) => {
          const elapsed = now - started
          drawFrame(elapsed)
          if (elapsed < 8000) requestAnimationFrame(frame)
          else resolve()
        }
        requestAnimationFrame(frame)
      })

      await new Promise<void>((resolve) => {
        recorder.addEventListener("stop", () => resolve(), { once: true })
        recorder.stop()
        stream.getTracks().forEach((track) => track.stop())
      })

      const blob = new Blob(chunks, { type: mimeType || "video/webm" })
      const url = URL.createObjectURL(blob)
      setVideoUrl(url)
      setVideoStatus("Free video ready — no AI/video credits used.")
    } catch (error) {
      setVideoError(error instanceof Error ? error.message : "Free video generation failed.")
      setVideoStatus(null)
    } finally {
      setGenerating(false)
    }
  }

  const exportVideo = () => {
    if (!videoUrl) return
    const link = document.createElement("a")
    link.href = videoUrl
    link.download = `viralforge-${currentFormat.id}.webm`
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Video Studio"
        description="Assemble scenes, refine the script, choose voice and music, and export for every platform."
      >
        <Button onClick={exportVideo} disabled={!videoUrl}>
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
            {generating ? "Creating free video…" : "Create free video"}
          </Button>

          <Button size="lg" variant="outline" className="w-full" onClick={exportVideo} disabled={!videoUrl}>
            <Download className="h-4 w-4" />
            Export {currentFormat.label}
          </Button>
        </div>
      </div>
    </div>
  )
}
