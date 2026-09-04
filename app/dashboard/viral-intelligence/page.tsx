"use client"

import { useState } from "react"
import Link from "next/link"
import { Zap, Heart, Eye, Share2, TrendingUp, CheckCircle2, AlertCircle, Clapperboard } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ScoreRing } from "@/components/score-ring"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { VIRAL_METRICS, OVERALL_VIRAL, SAMPLE_CAMPAIGNS } from "@/lib/sample-data"

const ICONS: Record<string, typeof Zap> = {
  "Hook Score": Zap,
  "Emotion Score": Heart,
  "Attention Score": Eye,
  "Share Potential": Share2,
}

const STRENGTHS = [
  "Strong scroll-stopping hook within the first 3 seconds",
  "Clear emotional arc that keeps viewers watching",
  "High visual variety and pacing sustain attention",
]

const IMPROVEMENTS = [
  "Add an on-screen caption during the reveal for sound-off viewers",
  "Tighten the mid-section by ~1.5s to lift completion rate",
  "Test a stronger, more specific call to action",
]

export default function ViralIntelligencePage() {
  const [campaign, setCampaign] = useState(SAMPLE_CAMPAIGNS[0].name)

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Viral Intelligence"
        description="Analyze how your content is optimized for engagement and performance across the metrics that matter."
      >
        <Select value={campaign} onValueChange={setCampaign}>
          <SelectTrigger className="w-56">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SAMPLE_CAMPAIGNS.map((c) => (
              <SelectItem key={c.id} value={c.name}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </PageHeader>

      {/* Overall + metric rings */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-primary/30 bg-gradient-to-br from-primary/15 to-transparent lg:col-span-1">
          <CardContent className="flex flex-col items-center justify-center gap-4 p-8 text-center">
            <p className="flex items-center gap-1.5 text-sm font-medium uppercase tracking-wide text-muted-foreground">
              <TrendingUp className="h-4 w-4 text-primary" />
              Overall Viral Potential
            </p>
            <ScoreRing value={OVERALL_VIRAL} size={160} stroke={12} label="of 100" />
            <Badge className="gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" />
              High potential
            </Badge>
            <p className="text-sm leading-relaxed text-muted-foreground">
              This concept is well optimized for short-form engagement. Apply the suggestions below to push it further.
            </p>
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
          {VIRAL_METRICS.map((m) => {
            const Icon = ICONS[m.label] ?? Zap
            return (
              <Card key={m.label}>
                <CardContent className="flex flex-col gap-3 p-5">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="font-display text-3xl font-bold">{m.value}</span>
                  </div>
                  <div>
                    <p className="font-medium">{m.label}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{m.note}</p>
                  </div>
                  <Progress value={m.value} />
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Strengths & improvements */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-display">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              What's working
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {STRENGTHS.map((s) => (
              <div key={s} className="flex gap-3 rounded-lg border border-border bg-secondary/40 p-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <p className="text-sm leading-relaxed">{s}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-display">
              <AlertCircle className="h-4 w-4 text-accent" />
              Optimization suggestions
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {IMPROVEMENTS.map((s) => (
              <div key={s} className="flex gap-3 rounded-lg border border-border bg-secondary/40 p-3">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <p className="text-sm leading-relaxed">{s}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border-primary/25 bg-primary/5">
        <CardContent className="flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
          <div>
            <p className="font-display text-lg font-semibold">Ready to apply these insights?</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Jump into Video Studio to make the recommended edits and re-score your content.
            </p>
          </div>
          <Button className="shrink-0" nativeButton={false} render={<Link href="/dashboard/video-studio" />}>
            <Clapperboard className="h-4 w-4" />
            Open Video Studio
          </Button>
        </CardContent>
      </Card>

      <p className="text-center text-xs text-muted-foreground">
        Scores are directional estimates that help optimize advertising content for stronger engagement and
        performance. They do not guarantee specific results.
      </p>
    </div>
  )
}
