import Link from "next/link"
import { ArrowRight, Sparkles, Clapperboard, TrendingUp, Palette, Plus } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { SAMPLE_CAMPAIGNS, VIRAL_METRICS, OVERALL_VIRAL } from "@/lib/sample-data"

const STATS = [
  { label: "Active campaigns", value: "12", note: "+3 this week" },
  { label: "Concepts generated", value: "148", note: "AI-assisted" },
  { label: "Avg. viral score", value: "84", note: "Across all drafts" },
  { label: "Videos exported", value: "37", note: "5 formats" },
]

const QUICK = [
  { href: "/dashboard/create", label: "Create Campaign", icon: Sparkles, desc: "Generate 5 concepts" },
  { href: "/dashboard/video-studio", label: "Video Studio", icon: Clapperboard, desc: "Edit & export" },
  { href: "/dashboard/brand-studio", label: "Brand Studio", icon: Palette, desc: "Manage brands" },
  { href: "/dashboard/viral-intelligence", label: "Viral Intelligence", icon: TrendingUp, desc: "Score content" },
]

function statusVariant(status: string) {
  switch (status) {
    case "Published":
      return "default"
    case "Ready":
      return "secondary"
    default:
      return "outline"
  }
}

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Welcome back, Ava"
        description="Here's what's happening across your advertising campaigns today."
      >
        <Button nativeButton={false} render={<Link href="/dashboard/create" />}>
          <Plus className="h-4 w-4" />
          New Campaign
        </Button>
      </PageHeader>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STATS.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <p className="mt-2 font-display text-3xl font-bold">{s.value}</p>
              <p className="mt-1 text-xs text-primary">{s.note}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {QUICK.map((q) => {
          const Icon = q.icon
          return (
            <Link key={q.href} href={q.href}>
              <Card className="group h-full transition-colors hover:border-primary/40">
                <CardContent className="flex items-center gap-4 p-5">
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="flex items-center gap-1 font-medium">
                      {q.label}
                      <ArrowRight className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                    </p>
                    <p className="truncate text-xs text-muted-foreground">{q.desc}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent campaigns */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display">Recent campaigns</CardTitle>
            <Button variant="ghost" size="sm" nativeButton={false} render={<Link href="/dashboard/campaigns" />}>
              View all
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {SAMPLE_CAMPAIGNS.map((c) => (
              <div
                key={c.id}
                className="flex flex-col gap-3 rounded-lg border border-border bg-secondary/40 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-medium">{c.name}</p>
                    <Badge variant={statusVariant(c.status)} className="shrink-0">
                      {c.status}
                    </Badge>
                  </div>
                  <p className="mt-1 truncate text-xs text-muted-foreground">
                    {c.product} · {c.style} · {c.format}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Viral</p>
                    <p className="font-display font-bold text-primary">{c.viralScore}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{c.updated}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Viral snapshot */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display">Viral snapshot</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <div className="rounded-lg border border-primary/25 bg-primary/10 p-4 text-center">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Overall potential</p>
              <p className="mt-1 font-display text-4xl font-bold text-primary">{OVERALL_VIRAL}</p>
            </div>
            <div className="flex flex-col gap-4">
              {VIRAL_METRICS.map((m) => (
                <div key={m.label}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span>{m.label}</span>
                    <span className="font-medium text-primary">{m.value}</span>
                  </div>
                  <Progress value={m.value} />
                </div>
              ))}
            </div>
            <Button variant="secondary" className="w-full" nativeButton={false} render={<Link href="/dashboard/viral-intelligence" />}>
              Full report
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
