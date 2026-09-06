"use client"

import { useState } from "react"
import { Sparkles, Loader2, RefreshCw, Target, Wand2 } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { ConceptCard } from "@/components/concept-card"
import { ImageUpload } from "@/components/image-upload"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { COUNTRIES, AUDIENCES, GOALS, STYLES, SAMPLE_CONCEPTS } from "@/lib/sample-data"

type Status = "idle" | "generating" | "done"

const CAMPAIGN_LANGUAGES = [
  "English", "Romanian", "Italian", "Spanish", "German", "French", "Portuguese", "Dutch", "Polish", "Czech",
  "Slovak", "Hungarian", "Greek", "Turkish", "Arabic", "Hebrew", "Hindi", "Bengali", "Urdu", "Persian",
  "Chinese (Simplified)", "Chinese (Traditional)", "Japanese", "Korean", "Vietnamese", "Thai", "Indonesian",
  "Malay", "Filipino", "Swedish", "Norwegian", "Danish", "Finnish", "Ukrainian", "Bulgarian", "Croatian",
  "Serbian", "Slovenian"
]

const goalText: Record<string, string> = {
  sales: "drive action and product interest",
  awareness: "build memorable brand awareness",
  launch: "create excitement around the product launch",
  social: "maximize social engagement and sharing",
}

const styleText: Record<string, string> = {
  viral: "fast-paced, highly shareable and scroll-stopping",
  emotional: "warm, emotional and relatable",
  luxury: "premium, elegant and aspirational",
  funny: "light, playful and humorous",
  cinematic: "visual, dramatic and cinematic",
}

type CampaignLanguagePack = {
  names: string[]
  strategies: Array<(...args: string[]) => string>
  hooks: Array<(...args: string[]) => string>
  scripts: Array<(...args: string[]) => string>
  ctas: string[]
  style: string
}

const ENGLISH: CampaignLanguagePack = {
  names: ["The Scroll Stopper", "One Moment, One Product", "3 Seconds to Discover", "Pass It On", "The Brand Moment"],
  strategies: [
    (style, objective) => `A ${style} opening built around a surprising first-second visual to ${objective}.`,
    (audience, country) => `A relatable everyday scenario for ${audience}, designed to feel natural and memorable in ${country}.`,
    (product) => `A quick three-beat reveal built to make ${product} memorable and encourage viewers to watch to the end.`,
    (product) => `A social-first idea built around reactions, sharing and tagging for ${product}.`,
    (product, objective) => `A polished hero-style concept that makes ${product} visually memorable and helps ${objective}.`,
  ],
  hooks: [
    (product) => `"Wait... have you tried ${product}? 👀"`,
    () => `"That little moment that just got better. ❤️"`,
    (product) => `"3 seconds. 1 reason to remember ${product}."`,
    (product) => `"Send this to someone who needs ${product}. 👇"`,
    (product) => `${product}. One product. One unforgettable moment. ✨`,
  ],
  scripts: [
    (product, desc) => `Open with a striking close-up of ${product}. Use a fast visual transition, show it in use, communicate: ${desc}, then finish with a clean hero shot and CTA.`,
    (product, desc) => `Start with an ordinary moment. Introduce ${product} naturally, show ${desc}, then end with a satisfying reaction and product shot.`,
    (product, desc) => `Beat one: reveal ${product}. Beat two: demonstrate ${desc}. Beat three: reveal the result and product shot. Use bold captions so it works without sound.`,
    (product) => `Show someone discovering ${product}, followed by a quick demonstration and genuine reaction. Cut to a second person trying it, then close with a share prompt.`,
    (product, desc) => `Use dynamic movement, bold captions and a clean hero shot of ${product}. Highlight ${desc} and finish with a confident brand moment and CTA.`,
  ],
  ctas: ["Discover the moment. ✨", "Share the moment. ❤️", "See why it stands out. 🚀", "Tag someone who would love it. 👇", "Make your moment memorable. ✨"],
  style: "Viral",
}

const PACKS: Record<string, Partial<CampaignLanguagePack>> = {
  Romanian: { names: ["Oprește scroll-ul", "Un moment, un produs", "Descoperă în 3 secunde", "Dă mai departe", "Momentul brandului"], hooks: [(p)=>`„Stai... ai încercat ${p}? 👀”`,()=>`„Momentul acela care tocmai a devenit mai bun. ❤️”`,(p)=>`„3 secunde. Un motiv să ții minte ${p}.“`,(p)=>`„Trimite asta cuiva care are nevoie de ${p}. 👇”`,(p)=>`${p}. Un produs. Un moment de neuitat. ✨`], ctas:["Descoperă momentul. ✨","Împărtășește momentul. ❤️","Vezi de ce iese în evidență. 🚀","Etichetează pe cineva care l-ar iubi. 👇","Fă momentul memorabil. ✨"], style:"Viral" },
  Italian: { names:["Ferma lo scroll","Un momento, un prodotto","Scoprilo in 3 secondi","Passalo avanti","Il momento del brand"], hooks:[(p)=>`“Aspetta... hai provato ${p}? 👀”`,()=>`“Quel piccolo momento che è appena diventato migliore. ❤️”`,(p)=>`“3 secondi. Un motivo per ricordare ${p}.“`,(p)=>`“Mandalo a qualcuno che ha bisogno di ${p}. 👇”`,(p)=>`${p}. Un prodotto. Un momento indimenticabile. ✨`], ctas:["Scopri il momento. ✨","Condividi il momento. ❤️","Scopri perché si distingue. 🚀","Tagga qualcuno che lo adorerebbe. 👇","Rendi il momento memorabile. ✨"], style:"Virale" },
  Spanish: { names:["Detén el scroll","Un momento, un producto","Descúbrelo en 3 segundos","Compártelo","El momento de la marca"], hooks:[(p)=>`“Espera... ¿has probado ${p}? 👀”`,()=>`“Ese pequeño momento que acaba de mejorar. ❤️”`,(p)=>`“3 segundos. Una razón para recordar ${p}.“`,(p)=>`“Envíalo a alguien que necesita ${p}. 👇”`,(p)=>`${p}. Un producto. Un momento inolvidable. ✨`], ctas:["Descubre el momento. ✨","Comparte el momento. ❤️","Descubre por qué destaca. 🚀","Etiqueta a alguien que lo adoraría. 👇","Haz que el momento sea inolvidable. ✨"], style:"Viral" },
  German: { names:["Der Scroll-Stopper","Ein Moment, ein Produkt","In 3 Sekunden entdecken","Weiterteilen","Der Markenmoment"], hooks:[(p)=>`„Warte... hast du ${p} schon probiert? 👀“`,()=>`„Dieser kleine Moment, der gerade besser wurde. ❤️“`,(p)=>`„3 Sekunden. Ein Grund, ${p} zu erinnern.“`,(p)=>`„Schick das an jemanden, der ${p} braucht. 👇“`,(p)=>`${p}. Ein Produkt. Ein unvergesslicher Moment. ✨`], ctas:["Entdecke den Moment. ✨","Teile den Moment. ❤️","Entdecke, warum es heraussticht. 🚀","Markiere jemanden, der es lieben würde. 👇","Mach den Moment unvergesslich. ✨"], style:"Viral" },
  French: { names:["Le stop-scroll","Un moment, un produit","À découvrir en 3 secondes","Passe-le","Le moment de la marque"], hooks:[(p)=>`« Attends... tu as essayé ${p} ? 👀 »`,()=>`« Ce petit moment qui vient de devenir meilleur. ❤️ »`,(p)=>`« 3 secondes. Une raison de retenir ${p}. »`,(p)=>`« Envoie ça à quelqu’un qui a besoin de ${p}. 👇 »`,(p)=>`${p}. Un produit. Un moment inoubliable. ✨`], ctas:["Découvre le moment. ✨","Partage le moment. ❤️","Découvre pourquoi il se démarque. 🚀","Identifie quelqu’un qui va l’adorer. 👇","Rends le moment mémorable. ✨"], style:"Viral" },
  Portuguese: { names:["Pare o scroll","Um momento, um produto","Descubra em 3 segundos","Passe adiante","O momento da marca"], hooks:[(p)=>`“Espera... você já experimentou ${p}? 👀”`,()=>`“Aquele pequeno momento que ficou ainda melhor. ❤️”`,(p)=>`“3 segundos. Um motivo para lembrar de ${p}.“`,(p)=>`“Envie para alguém que precisa de ${p}. 👇”`,(p)=>`${p}. Um produto. Um momento inesquecível. ✨`], ctas:["Descubra o momento. ✨","Compartilhe o momento. ❤️","Veja por que ele se destaca. 🚀","Marque alguém que vai amar. 👇","Torne o momento inesquecível. ✨"], style:"Viral" },
  Dutch: { names:["De scroll-stopper","Eén moment, één product","Ontdek het in 3 seconden","Geef het door","Het merkmoment"], hooks:[(p)=>`“Wacht... heb je ${p} al geprobeerd? 👀”`,()=>`“Dat kleine moment dat ineens beter werd. ❤️”`,(p)=>`“3 seconden. Eén reden om ${p} te onthouden.”`,(p)=>`“Stuur dit naar iemand die ${p} nodig heeft. 👇”`,(p)=>`${p}. Eén product. Eén onvergetelijk moment. ✨`], ctas:["Ontdek het moment. ✨","Deel het moment. ❤️","Ontdek waarom het opvalt. 🚀","Tag iemand die het geweldig zou vinden. 👇","Maak het moment onvergetelijk. ✨"], style:"Viraal" },
  Turkish: { names:["Kaydırmayı Durdur","Bir An, Bir Ürün","3 Saniyede Keşfet","Paylaş","Marka Anı"], hooks:[(p)=>`“Bir dakika... ${p} denedin mi? 👀”`,()=>`“O küçük an şimdi daha güzel. ❤️”`,(p)=>`“3 saniye. ${p} için 1 neden.”`,(p)=>`“${p} ihtiyacı olan birine gönder. 👇”`,(p)=>`${p}. Bir ürün. Unutulmaz bir an. ✨`], ctas:["Anı keşfet. ✨","Anı paylaş. ❤️","Neden öne çıktığını gör. 🚀","Sevecek birini etiketle. 👇","Anı unutulmaz yap. ✨"], style:"Viral" },
  Arabic: { names:["أوقف التمرير","لحظة ومنتج","اكتشفه في 3 ثوانٍ","شاركها","لحظة العلامة التجارية"], hooks:[(p)=>`"انتظر... هل جربت ${p}؟ 👀"`,()=>`"تلك اللحظة الصغيرة أصبحت أجمل. ❤️"`,(p)=>`"3 ثوانٍ. سبب واحد لتتذكر ${p}."`,(p)=>`"أرسل هذا لمن يحتاج ${p}. 👇"`,(p)=>`${p}. منتج واحد. لحظة لا تُنسى. ✨`], ctas:["اكتشف اللحظة. ✨","شارك اللحظة. ❤️","اكتشف ما يميزه. 🚀","اذكر شخصًا سيحبه. 👇","اجعل اللحظة لا تُنسى. ✨"], style:"فيرال" },
  Japanese: { names:["スクロールを止める瞬間","ひとつの瞬間、ひとつの商品","3秒で発見","シェアしよう","ブランドの瞬間"], hooks:[(p)=>`「待って…${p}試した？ 👀」`,()=>`「いつもの瞬間が、もっと特別に。❤️」`,(p)=>`「3秒。${p}を覚える理由。」`,(p)=>`「${p}が必要な人に送って。👇」`,(p)=>`${p}。ひとつの商品。忘れられない瞬間。✨`], ctas:["この瞬間を発見。✨","この瞬間をシェア。❤️","違いを見てみよう。🚀","好きそうな人をタグ付け。👇","忘れられない瞬間に。✨"], style:"バイラル" },
  Korean: { names:["스크롤을 멈추는 순간","하나의 순간, 하나의 제품","3초 만에 발견","공유하세요","브랜드의 순간"], hooks:[(p)=>`“잠깐... ${p} 써봤어? 👀”`,()=>`“평범한 순간이 더 좋아지는 순간. ❤️”`,(p)=>`“3초. ${p}를 기억할 이유 하나.”`,(p)=>`“${p}가 필요한 사람에게 보내세요. 👇”`,(p)=>`${p}. 하나의 제품. 잊지 못할 순간. ✨`], ctas:["순간을 발견하세요. ✨","순간을 공유하세요. ❤️","왜 특별한지 확인하세요. 🚀","좋아할 사람을 태그하세요. 👇","순간을 기억에 남게. ✨"], style:"바이럴" },
  "Chinese (Simplified)": { names:["停住滑动","一个瞬间，一个产品","3秒发现","分享出去","品牌时刻"], hooks:[(p)=>`“等等……你试过${p}吗？👀”`,()=>`“那个让日常变得更美好的瞬间。❤️”`,(p)=>`“3秒，一个记住${p}的理由。”`,(p)=>`“发给那个需要${p}的人。👇”`,(p)=>`${p}。一个产品，一个难忘的瞬间。✨`], ctas:["发现这一刻。✨","分享这一刻。❤️","看看它为什么与众不同。🚀","@一个会喜欢它的人。👇","让这一刻值得记住。✨"], style:"病毒式" },
  Hindi: { names:["स्क्रॉल रोकने वाला पल","एक पल, एक प्रोडक्ट","3 सेकंड में खोजें","आगे शेयर करें","ब्रांड मोमेंट"], hooks:[(p)=>`“रुको... क्या आपने ${p} आज़माया? 👀”`,()=>`“वो छोटा सा पल जो और बेहतर हो गया। ❤️”`,(p)=>`“3 सेकंड। ${p} को याद रखने की एक वजह।”`,(p)=>`“इसे उस व्यक्ति को भेजें जिसे ${p} चाहिए। 👇”`,(p)=>`${p}। एक प्रोडक्ट। एक यादगार पल। ✨`], ctas:["पल को खोजें। ✨","पल को शेयर करें। ❤️","देखें यह खास क्यों है। 🚀","जिसे पसंद आए उसे टैग करें। 👇","पल को यादगार बनाएं। ✨"], style:"वायरल" },
  Polish: { names:["Zatrzymaj scroll","Jedna chwila, jeden produkt","Odkryj w 3 sekundy","Podaj dalej","Moment marki"], hooks:[(p)=>`„Czekaj... próbowałeś ${p}? 👀”`,()=>`„Ta mała chwila właśnie stała się lepsza. ❤️”`,(p)=>`„3 sekundy. Jeden powód, by zapamiętać ${p}.“`,(p)=>`„Wyślij to komuś, kto potrzebuje ${p}. 👇”`,(p)=>`${p}. Jeden produkt. Niezapomniana chwila. ✨`], ctas:["Odkryj tę chwilę. ✨","Podziel się chwilą. ❤️","Zobacz, co go wyróżnia. 🚀","Oznacz kogoś, kto go pokocha. 👇","Spraw, by chwila została w pamięci. ✨"], style:"Viral" },
  Ukrainian: { names:["Зупини скрол","Одна мить, один продукт","Відкрий за 3 секунди","Передай далі","Момент бренду"], hooks:[(p)=>`«Стривай... ти пробував ${p}? 👀»`,()=>`«Та сама маленька мить, що стала кращою. ❤️»`,(p)=>`«3 секунди. Одна причина запам’ятати ${p}.»`,(p)=>`«Надішли це тому, кому потрібен ${p}. 👇»`,(p)=>`${p}. Один продукт. Незабутня мить. ✨`], ctas:["Відкрий момент. ✨","Поділись моментом. ❤️","Побач, чим він особливий. 🚀","Познач того, кому сподобається. 👇","Зроби момент незабутнім. ✨"], style:"Віральний" },
}

function getCampaignLanguage(language: string): CampaignLanguagePack {
  const pack = PACKS[language]
  return {
    ...ENGLISH,
    ...pack,
    strategies: pack?.strategies || ENGLISH.strategies,
    scripts: pack?.scripts || ENGLISH.scripts,
    names: pack?.names || ENGLISH.names,
    hooks: pack?.hooks || ENGLISH.hooks,
    ctas: pack?.ctas || ENGLISH.ctas,
    style: pack?.style || "Viral",
  }
}



export default function CreateCampaignPage() {
  const [status, setStatus] = useState<Status>("idle")
  const [productName, setProductName] = useState("")
  const [description, setDescription] = useState("")
  const [country, setCountry] = useState("United States")
  const [language, setLanguage] = useState("English")
  const [audience, setAudience] = useState(AUDIENCES[0])
  const [goal, setGoal] = useState<string>("sales")
  const [style, setStyle] = useState<string>("viral")
  const [concepts, setConcepts] = useState(SAMPLE_CONCEPTS)
  const [error, setError] = useState("")

  async function generate() {
    if (status === "generating") return
    if (!productName.trim()) {
      setError("Please enter a product name first.")
      return
    }

    setError("")
    setStatus("generating")

    try {
      const product = productName.trim()
      const desc = description.trim() || "A product designed to make everyday moments better."
      const objective = goalText[goal] || goalText.sales
      const creativeStyle = styleText[style] || styleText.viral
      const t = getCampaignLanguage(language)

      const generated = [
        { id: `local-1-${Date.now()}`, name: t.names[0], strategy: t.strategies[0](creativeStyle, objective), hook: t.hooks[0](product), script: t.scripts[0](product, desc), cta: t.ctas[0], viralScore: 94, style: t.style },
        { id: `local-2-${Date.now()}`, name: t.names[1], strategy: t.strategies[1](audience, country), hook: t.hooks[1], script: t.scripts[1](product, desc), cta: t.ctas[1], viralScore: 91, style: t.style },
        { id: `local-3-${Date.now()}`, name: t.names[2], strategy: t.strategies[2](product), hook: t.hooks[2](product), script: t.scripts[2](product, desc), cta: t.ctas[2], viralScore: 93, style: t.style },
        { id: `local-4-${Date.now()}`, name: t.names[3], strategy: t.strategies[3](product), hook: t.hooks[3](product), script: t.scripts[3](product), cta: t.ctas[3], viralScore: 95, style: t.style },
        { id: `local-5-${Date.now()}`, name: t.names[4], strategy: t.strategies[4](product, objective), hook: t.hooks[4](product), script: t.scripts[4](product, desc), cta: t.ctas[4], viralScore: 89, style: t.style },
      ]

      await new Promise((resolve) => window.setTimeout(resolve, 350))
      setConcepts(generated)
      setStatus("done")
      window.setTimeout(() => {
        document.getElementById("concepts")?.scrollIntoView({ behavior: "smooth", block: "start" })
      }, 50)
    } catch (err) {
      setStatus("idle")
      setError(err instanceof Error ? err.message : "Unable to generate the campaign.")
    }
  }


  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Create Campaign"
        description="Tell us about your product and audience. VIRALFORGE AI will generate five advertising concepts optimized for engagement."
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display">
              <Wand2 className="h-5 w-5 text-primary" />
              Campaign brief
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <ImageUpload label="Product image" hint="PNG or JPG, up to 10MB" />
              <ImageUpload label="Brand logo" hint="Transparent PNG recommended" aspect="square" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="product">Product name</Label>
              <Input
                id="product"
                placeholder="e.g. Radiance Serum"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="desc">Product description</Label>
              <Textarea
                id="desc"
                rows={4}
                placeholder="Describe what your product does, its key benefits, and what makes it special..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label>Target country</Label>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Target audience</Label>
                <Select value={audience} onValueChange={setAudience}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select audience" />
                  </SelectTrigger>
                  <SelectContent>
                    {AUDIENCES.map((a) => (
                      <SelectItem key={a} value={a}>
                        {a}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Campaign language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose output language" />
                </SelectTrigger>
                <SelectContent>
                  {CAMPAIGN_LANGUAGES.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Campaign ideas, hooks, scripts and CTAs are generated in the selected language.</p>
            </div>

            <div className="grid gap-2">
              <Label>Campaign goal</Label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {GOALS.map((g) => (
                  <OptionChip key={g.id} active={goal === g.id} onClick={() => setGoal(g.id)}>
                    {g.label}
                  </OptionChip>
                ))}
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Advertising style</Label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                {STYLES.map((s) => (
                  <OptionChip key={s.id} active={style === s.id} onClick={() => setStyle(s.id)}>
                    {s.label}
                  </OptionChip>
                ))}
              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <button
              type="button"
              className="forge-glow flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:pointer-events-none disabled:opacity-60"
              onClick={generate}
              disabled={status === "generating"}
            >
              {status === "generating" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Forging concepts...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate Campaign
                </>
              )}
            </button>
          </CardContent>
        </Card>

        {/* Tips sidebar */}
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-display">
                <Target className="h-4 w-4 text-primary" />
                How it works
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 text-sm text-muted-foreground">
              {[
                "Add your product details and brand assets.",
                "Choose the goal and advertising style that fit your objective.",
                "Generate five distinct concepts, each with strategy, hook, and script.",
                "Edit, score, and send your favorite straight to Video Studio.",
              ].map((t, i) => (
                <div key={i} className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                    {i + 1}
                  </span>
                  <p className="leading-relaxed">{t}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-primary/25 bg-primary/5">
            <CardContent className="p-5">
              <p className="text-sm leading-relaxed text-muted-foreground">
                VIRALFORGE AI optimizes advertising content for stronger engagement and performance. Results depend on
                your product, audience, and platform.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Results */}
      {status !== "idle" && (
        <div id="concepts" className="flex flex-col gap-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold tracking-tight">
                {status === "generating" ? "Generating concepts..." : "Your 5 advertising concepts"}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {productName ? `For "${productName}"` : "Tailored to your brief"} · {STYLES.find((s) => s.id === style)?.label} ·{" "}
                {GOALS.find((g) => g.id === goal)?.label} · {language}
              </p>
            </div>
            {status === "done" && (
              <Button variant="outline" onClick={generate}>
                <RefreshCw className="h-4 w-4" />
                Regenerate
              </Button>
            )}
          </div>

          {status === "generating" ? (
            <div className="grid gap-6 lg:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-72 animate-pulse rounded-xl border border-border bg-card" />
              ))}
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">
              {concepts.map((c, i) => (
                <ConceptCard key={c.id} concept={c} index={i} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function OptionChip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors",
        active
          ? "border-primary bg-primary/15 text-primary"
          : "border-border bg-secondary/40 text-muted-foreground hover:border-primary/40 hover:text-foreground",
      )}
    >
      {children}
    </button>
  )
}
