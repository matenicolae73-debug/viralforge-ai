"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { ImagePlus, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function ImageUpload({
  label,
  hint,
  aspect = "video",
  className,
}: {
  label: string
  hint?: string
  aspect?: "video" | "square"
  className?: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)

  function handleFile(file?: File) {
    if (!file) return
    const url = URL.createObjectURL(file)
    setPreview(url)
  }

  return (
    <div className={className}>
      <p className="mb-1.5 text-sm font-medium">{label}</p>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          handleFile(e.dataTransfer.files?.[0])
        }}
        className={cn(
          "group relative flex cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-dashed border-border bg-secondary/40 transition-colors hover:border-primary/50",
          aspect === "square" ? "aspect-square" : "aspect-video",
        )}
      >
        {preview ? (
          <>
            <Image src={preview || "/placeholder.svg"} alt={`${label} preview`} fill className="object-cover" />
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="absolute right-2 top-2 h-7 w-7"
              onClick={(e) => {
                e.stopPropagation()
                setPreview(null)
                if (inputRef.current) inputRef.current.value = ""
              }}
              aria-label="Remove image"
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-primary">
              <ImagePlus className="h-5 w-5" />
            </span>
            <p className="text-sm font-medium">Click or drag to upload</p>
            {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  )
}
