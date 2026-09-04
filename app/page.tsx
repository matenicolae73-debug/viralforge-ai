import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Sparkles, Palette, Clapperboard, TrendingUp, Play } from "lucide-react"
import { ForgeLogo } from "@/components/forge-logo"

const FEATURES = [
  {
    icon: Sparkles,
    title: "AI Campaign Concepts",
    desc: "Generate multiple advertising directions with strategy, hooks, scripts, and calls to action in seconds.",
  },
  {
    icon: Palette,
    title: "Brand Studio",
    desc: "Store your brand voice, colors, products, and audiences so every campaign stays perfectly on-brand.",
  },
  {
    icon: Clapperboard,
    title: "Video Studio",
    desc: "Assemble scenes, edit scripts, pick voices and music, and export for every social format.",
  },
  {
    icon: TrendingUp,
    title: "Viral Intelligence",
    desc: "Score hooks, emotion, and attention to optimize content for stronger engagement and performance.",
  },
]

const FORMATS = ["TikTok 9:16", "Instagram Reels", "YouTube Shorts", "Facebook 1:1", "YouTube 16:9"]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <ForgeLogo />
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/dashboard"
              className="hidden h-8 items-center justify-center rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:inline-flex"
            >
              Sign in
            </Link>
            <Link
              href="/dashboard/create"
              className="inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-primary px-2.5 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/80"
            >
              Create Campaign
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <Image
            src="/forge-hero.png"
            alt=""
            fill
            priority
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 sm:pt-24 lg:pb-28 lg:pt-32">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              AI advertising video platform
            </span>
            <h1 className="mt-6 text-balance font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Turn products into stories people want to watch.
            </h1>
            <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              VIRALFORGE AI helps brands and businesses create powerful advertising video campaigns — optimizing
              content for stronger engagement and performance across every platform.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/dashboard/create"
                className="forge-glow inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-primary px-2.5 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/80"
              >
                Create Campaign
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-secondary px-2.5 text-sm font-medium text-secondary-foreground transition-all hover:bg-secondary/80"
              >
                <Play className="h-4 w-4" />
                Explore the dashboard
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-2">
              {FORMATS.map((f) => (
                <span
                  key={f}
                  className="rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="max-w-2xl">
          <h2 className="text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to forge scroll-stopping ads
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            From the first idea to the final export, VIRALFORGE AI gives your team a complete production studio powered
            by artificial intelligence.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => {
            const Icon = f.icon
            return (
              <div
                key={f.title}
                className="group rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/40"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card px-6 py-14 text-center sm:px-12">
          <div className="pointer-events-none absolute inset-0 opacity-30">
            <Image src="/forge-hero.png" alt="" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/70 to-card/40" />
          </div>
          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to forge your next campaign?
            </h2>
            <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
              Build a full advertising concept — strategy, script, and video — in a single flow.
            </p>
            <Link
              href="/dashboard/create"
              className="forge-glow mt-8 inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-primary px-2.5 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/80"
            >
              Create Campaign
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
          <ForgeLogo size="sm" />
          <p className="text-xs text-muted-foreground">
            VIRALFORGE AI helps optimize advertising content for stronger engagement and performance.
          </p>
        </div>
      </footer>
    </div>
  )
}
