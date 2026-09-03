import { cn } from "@/lib/utils"

export function ForgeMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground",
        className,
      )}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" fill="none" className="h-[62%] w-[62%]" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M13 2L4 14h6l-1 8 9-12h-6l1-8z"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  )
}

export function ForgeLogo({
  className,
  size = "md",
}: {
  className?: string
  size?: "sm" | "md" | "lg"
}) {
  const mark = size === "lg" ? "h-11 w-11" : size === "sm" ? "h-7 w-7" : "h-9 w-9"
  const text = size === "lg" ? "text-2xl" : size === "sm" ? "text-base" : "text-lg"
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <ForgeMark className={mark} />
      <span className={cn("font-display font-bold tracking-tight leading-none", text)}>
        VIRAL<span className="text-primary">FORGE</span>
        <span className="ml-1 text-muted-foreground font-medium">AI</span>
      </span>
    </span>
  )
}
