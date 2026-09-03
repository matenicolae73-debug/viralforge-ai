"use client"

import Link from "next/link"
import { useState } from "react"
import { Pencil, Clapperboard, Check, Zap, Quote } from "lucide-react"
import type { Concept } from "@/lib/sample-data"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ScoreRing } from "@/components/score-ring"
import { cn } from "@/lib/utils"

export function ConceptCard({ concept, index }: { concept: Concept; index: number }) {
  const [editing, setEditing] = useState(false)
  const [used, setUsed] = useState(false)
  const [script, setScript] = useState(concept.script)

  return (
    <Card className={cn("overflow-hidden transition-colors", used && "border-primary/60")}>
      <CardContent className="flex flex-col gap-5 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{concept.style}</Badge>
              {used && (
                <Badge className="gap-1">
                  <Check className="h-3 w-3" />
                  In use
                </Badge>
              )}
            </div>
            <h3 className="mt-2 text-balance font-display text-xl font-bold">{concept.name}</h3>
          </div>
          <div className="flex shrink-0 flex-col items-center">
            <ScoreRing value={concept.viralScore} size={72} stroke={6} />
            <span className="mt-1 flex items-center gap-1 text-[10px] uppercase tracking-wide text-muted-foreground">
              <Zap className="h-3 w-3 text-primary" />
              Viral score
            </span>
          </div>
        </div>

        <div className="grid gap-4">
          <Field label="Marketing strategy">{concept.strategy}</Field>

          <div className="rounded-lg border border-primary/25 bg-primary/10 p-4">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-primary">Video hook</p>
            <p className="flex gap-2 text-sm italic leading-relaxed">
              <Quote className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              {concept.hook}
            </p>
          </div>

          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Advertising script
            </p>
            {editing ? (
              <Textarea value={script} onChange={(e) => setScript(e.target.value)} rows={5} className="text-sm" />
            ) : (
              <p className="text-sm leading-relaxed text-muted-foreground">{script}</p>
            )}
          </div>

          <Field label="Call to action">
            <span className="font-medium text-foreground">{concept.cta}</span>
          </Field>
        </div>

        <div className="flex flex-wrap gap-2 border-t border-border pt-4">
          <Button
            variant={editing ? "default" : "outline"}
            size="sm"
            onClick={() => setEditing((v) => !v)}
          >
            {editing ? <Check className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
            {editing ? "Save script" : "Edit"}
          </Button>
          <Button variant="outline" size="sm" nativeButton={false} render={<Link href="/dashboard/video-studio" />}>
            <Clapperboard className="h-4 w-4" />
            Create Video
          </Button>
          <Button
            size="sm"
            variant={used ? "secondary" : "default"}
            className={cn(!used && "ml-auto")}
            onClick={() => setUsed((v) => !v)}
          >
            <Check className="h-4 w-4" />
            {used ? "Selected" : "Use this concept"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-sm leading-relaxed text-muted-foreground">{children}</p>
    </div>
  )
}
