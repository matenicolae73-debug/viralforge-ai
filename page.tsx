"use client"

import { useState } from "react"
import { Plus, Save, Palette, Package, Users, Mic } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { ImageUpload } from "@/components/image-upload"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { SAMPLE_BRANDS, AUDIENCES } from "@/lib/sample-data"

const PRESET_COLORS = ["#E8724C", "#F2C879", "#5AA9E6", "#8B5CF6", "#22C55E", "#F43F5E", "#22201D", "#F5F1EA"]

export default function BrandStudioPage() {
  const [activeBrand, setActiveBrand] = useState(SAMPLE_BRANDS[0].id)
  const [colors, setColors] = useState<string[]>(SAMPLE_BRANDS[0].colors)
  const [products, setProducts] = useState<string[]>(SAMPLE_BRANDS[0].products)
  const [newProduct, setNewProduct] = useState("")
  const [audiences, setAudiences] = useState<string[]>(SAMPLE_BRANDS[0].audiences)

  const brand = SAMPLE_BRANDS.find((b) => b.id === activeBrand)!

  function selectBrand(id: string) {
    const b = SAMPLE_BRANDS.find((x) => x.id === id)!
    setActiveBrand(id)
    setColors(b.colors)
    setProducts(b.products)
    setAudiences(b.audiences)
    setNewProduct("")
  }

  function toggleColor(c: string) {
    setColors((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]))
  }

  function addProduct() {
    const v = newProduct.trim()
    if (!v) return
    setProducts((prev) => [...prev, v])
    setNewProduct("")
  }

  function toggleAudience(a: string) {
    setAudiences((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]))
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Brand Studio"
        description="Save your brand identity so every campaign stays consistent — voice, colors, products, and audiences."
      >
        <Button>
          <Save className="h-4 w-4" />
          Save brand
        </Button>
      </PageHeader>

      {/* Brand switcher */}
      <div className="flex flex-wrap gap-2">
        {SAMPLE_BRANDS.map((b) => (
          <button
            key={b.id}
            onClick={() => selectBrand(b.id)}
            className={cn(
              "flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
              activeBrand === b.id
                ? "border-primary bg-primary/15 text-primary"
                : "border-border bg-secondary/40 text-muted-foreground hover:text-foreground",
            )}
          >
            {b.name}
          </button>
        ))}
        <button className="flex items-center gap-2 rounded-lg border border-dashed border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground">
          <Plus className="h-4 w-4" />
          New brand
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Identity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display">
              <Palette className="h-5 w-5 text-primary" />
              Brand identity
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <div className="grid gap-6 sm:grid-cols-[200px_minmax(0,1fr)]">
              <ImageUpload label="Logo" aspect="square" hint="Transparent PNG" />
              <div className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="brandname">Brand name</Label>
                  <Input id="brandname" defaultValue={brand.name} key={brand.id} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="voice" className="flex items-center gap-1.5">
                    <Mic className="h-3.5 w-3.5" />
                    Brand voice
                  </Label>
                  <Textarea id="voice" rows={3} defaultValue={brand.voice} key={`${brand.id}-voice`} />
                </div>
              </div>
            </div>

            <div className="grid gap-3">
              <Label>Brand colors</Label>
              <div className="flex flex-wrap gap-2">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => toggleColor(c)}
                    className={cn(
                      "h-10 w-10 rounded-lg border-2 transition-transform hover:scale-105",
                      colors.includes(c) ? "border-primary" : "border-transparent",
                    )}
                    style={{ backgroundColor: c }}
                    aria-label={`Toggle color ${c}`}
                    aria-pressed={colors.includes(c)}
                  />
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {colors.map((c) => (
                  <Badge key={c} variant="secondary" className="gap-1.5 font-mono text-xs">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: c }} />
                    {c}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-display">Live preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-lg border border-border">
              <div className="h-24" style={{ background: `linear-gradient(120deg, ${colors[0] ?? "#E8724C"}, ${colors[1] ?? "#F2C879"})` }} />
              <div className="p-4">
                <p className="font-display text-lg font-bold">{brand.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">{brand.voice}</p>
                <div className="mt-3 flex gap-1.5">
                  {colors.map((c) => (
                    <span key={c} className="h-6 flex-1 rounded" style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-display">
              <Package className="h-4 w-4 text-primary" />
              Products
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex gap-2">
              <Input
                placeholder="Add a product"
                value={newProduct}
                onChange={(e) => setNewProduct(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                    e.preventDefault()
                    addProduct()
                  }
                }}
              />
              <Button size="icon" onClick={addProduct} aria-label="Add product">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-col gap-2">
              {products.map((p) => (
                <div key={p} className="rounded-lg border border-border bg-secondary/40 px-3 py-2 text-sm">
                  {p}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Audiences */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-display">
              <Users className="h-4 w-4 text-primary" />
              Target audiences
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {AUDIENCES.map((a) => (
                <button
                  key={a}
                  onClick={() => toggleAudience(a)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-sm transition-colors",
                    audiences.includes(a)
                      ? "border-primary bg-primary/15 text-primary"
                      : "border-border bg-secondary/40 text-muted-foreground hover:text-foreground",
                  )}
                >
                  {a}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
