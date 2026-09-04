"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus, Search, Clapperboard, MoreHorizontal, Copy, Trash2, Pencil } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { SAMPLE_CAMPAIGNS, type Campaign } from "@/lib/sample-data"

const FILTERS = ["All", "Draft", "In Review", "Ready", "Published"] as const

function statusVariant(status: Campaign["status"]) {
  switch (status) {
    case "Published":
      return "default"
    case "Ready":
      return "secondary"
    default:
      return "outline"
  }
}

export default function CampaignsPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All")
  const [query, setQuery] = useState("")

  const filtered = SAMPLE_CAMPAIGNS.filter((c) => {
    const matchesFilter = filter === "All" || c.status === filter
    const matchesQuery =
      c.name.toLowerCase().includes(query.toLowerCase()) || c.product.toLowerCase().includes(query.toLowerCase())
    return matchesFilter && matchesQuery
  })

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Campaigns" description="All your saved advertising campaigns in one place.">
        <Button nativeButton={false} render={<Link href="/dashboard/create" />}>
          <Plus className="h-4 w-4" />
          New Campaign
        </Button>
      </PageHeader>

      {/* Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
                filter === f
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border bg-secondary/40 text-muted-foreground hover:text-foreground",
              )}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="relative sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search campaigns"
            className="pl-9"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <p className="font-display text-lg font-semibold">No campaigns found</p>
            <p className="max-w-sm text-sm text-muted-foreground">
              Try a different filter or search term, or create a new campaign to get started.
            </p>
            <Button className="mt-2" nativeButton={false} render={<Link href="/dashboard/create" />}>
              <Plus className="h-4 w-4" />
              New Campaign
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((c) => (
            <Card key={c.id} className="group transition-colors hover:border-primary/40">
              <CardContent className="flex flex-col gap-4 p-5">
                <div className="flex items-start justify-between gap-2">
                  <Badge variant={statusVariant(c.status)}>{c.status}</Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={<Button variant="ghost" size="icon" className="h-7 w-7" />}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Campaign options</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Pencil className="h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy className="h-4 w-4" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem variant="destructive">
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div>
                  <h3 className="text-balance font-display text-lg font-bold">{c.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{c.product}</p>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="outline">{c.goal}</Badge>
                  <Badge variant="outline">{c.style}</Badge>
                </div>

                <div className="flex items-center justify-between border-t border-border pt-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Viral score</p>
                    <p className="font-display text-xl font-bold text-primary">{c.viralScore}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">{c.format}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">Updated {c.updated}</p>
                  </div>
                </div>

                <Button variant="secondary" className="w-full" nativeButton={false} render={<Link href="/dashboard/video-studio" />}>
                  <Clapperboard className="h-4 w-4" />
                  Open in Video Studio
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
