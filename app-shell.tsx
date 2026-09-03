"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import {
  LayoutDashboard,
  Sparkles,
  Palette,
  FolderKanban,
  Clapperboard,
  TrendingUp,
  Menu,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ForgeLogo } from "@/components/forge-logo"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/create", label: "Create Campaign", icon: Sparkles },
  { href: "/dashboard/brand-studio", label: "Brand Studio", icon: Palette },
  { href: "/dashboard/campaigns", label: "Campaigns", icon: FolderKanban },
  { href: "/dashboard/video-studio", label: "Video Studio", icon: Clapperboard },
  { href: "/dashboard/viral-intelligence", label: "Viral Intelligence", icon: TrendingUp },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-background/80 px-4 py-3 backdrop-blur-md lg:hidden">
        <Link href="/dashboard">
          <ForgeLogo size="sm" />
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </header>

      {/* Mobile overlay nav */}
      {open && (
        <div className="fixed inset-0 z-30 lg:hidden" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" />
          <nav
            className="absolute left-0 top-[57px] w-full border-b border-border bg-card p-3"
            onClick={(e) => e.stopPropagation()}
          >
            <NavLinks pathname={pathname} onNavigate={() => setOpen(false)} />
          </nav>
        </div>
      )}

      <div className="mx-auto flex w-full max-w-[1600px]">
        {/* Desktop sidebar */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-sidebar px-4 py-6 lg:flex">
          <Link href="/dashboard" className="px-2">
            <ForgeLogo />
          </Link>
          <nav className="mt-8 flex flex-1 flex-col gap-1">
            <NavLinks pathname={pathname} />
          </nav>
          <div className="mt-auto flex items-center gap-3 rounded-lg border border-border bg-card/60 p-3">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-primary/15 text-primary text-sm font-semibold">AK</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">Ava Kessler</p>
              <p className="truncate text-xs text-muted-foreground">Growth Studio</p>
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">{children}</main>
      </div>
    </div>
  )
}

function NavLinks({
  pathname,
  onNavigate,
}: {
  pathname: string
  onNavigate?: () => void
}) {
  return (
    <>
      {NAV.map((item) => {
        const active = pathname === item.href
        const Icon = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-primary/15 text-primary"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground",
            )}
          >
            <Icon className="h-[18px] w-[18px]" />
            {item.label}
          </Link>
        )
      })}
    </>
  )
}
