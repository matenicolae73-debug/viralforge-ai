export const COUNTRIES = [
  'United States',
  'United Kingdom',
  'Canada',
  'Germany',
  'France',
  'United Arab Emirates',
  'Saudi Arabia',
  'Australia',
  'Japan',
  'Brazil',
  'India',
  'Global',
]

export const AUDIENCES = [
  'Gen Z (18–24)',
  'Millennials (25–40)',
  'Parents & Families',
  'Fitness Enthusiasts',
  'Luxury Shoppers',
  'Small Business Owners',
  'Tech Early Adopters',
  'Beauty & Skincare',
]

export const GOALS = [
  { id: 'sales', label: 'Sales' },
  { id: 'awareness', label: 'Brand Awareness' },
  { id: 'launch', label: 'Product Launch' },
  { id: 'social', label: 'Social Media' },
] as const

export const STYLES = [
  { id: 'emotional', label: 'Emotional' },
  { id: 'viral', label: 'Viral' },
  { id: 'luxury', label: 'Luxury' },
  { id: 'funny', label: 'Funny' },
  { id: 'cinematic', label: 'Cinematic' },
] as const

export const FORMATS = [
  { id: 'tiktok', label: 'TikTok', ratio: '9:16' },
  { id: 'reels', label: 'Instagram Reels', ratio: '9:16' },
  { id: 'facebook', label: 'Facebook', ratio: '1:1' },
  { id: 'shorts', label: 'YouTube Shorts', ratio: '9:16' },
  { id: 'youtube', label: 'YouTube', ratio: '16:9' },
] as const

export const VOICES = [
  'Aria — Warm Female',
  'Nova — Energetic Female',
  'Atlas — Deep Male',
  'Leo — Friendly Male',
  'Sage — Calm Neutral',
]

export const MUSIC_TRACKS = [
  'Neon Pulse — Electronic',
  'Golden Hour — Cinematic',
  'Street Heat — Hip Hop',
  'Soft Focus — Ambient',
  'Momentum — Corporate Uplift',
]

export type Concept = {
  id: string
  name: string
  strategy: string
  hook: string
  script: string
  cta: string
  viralScore: number
  style: string
}

export const SAMPLE_CONCEPTS: Concept[] = [
  {
    id: 'c1',
    name: 'The 3-Second Transformation',
    strategy:
      'Lead with an instant before/after reveal to stop the scroll, then anchor the product as the reason for the change. Optimized for high early-retention on short-form feeds.',
    hook: '"I did NOT expect this to work in 3 seconds..."',
    script:
      'Open on a frustrated close-up. Hard cut to the product in action. Snap transition to the glowing result. Overlay the key benefit as bold kinetic text while a confident VO seals the promise.',
    cta: 'Tap to try it risk-free today.',
    viralScore: 92,
    style: 'Viral',
  },
  {
    id: 'c2',
    name: 'Quiet Luxury Unboxing',
    strategy:
      'Slow, tactile cinematography that frames the product as an aspirational object. Builds perceived value and premium positioning for higher-intent buyers.',
    hook: '"This is what quality actually feels like."',
    script:
      'Macro shots of texture and material. Soft ambient score. A single hand reveals the product under warm light. Minimal text, maximum atmosphere, ending on the logo lockup.',
    cta: 'Discover the collection.',
    viralScore: 78,
    style: 'Luxury',
  },
  {
    id: 'c3',
    name: 'POV: Your New Morning',
    strategy:
      'First-person storytelling that lets the viewer imagine the product inside their own routine, driving relatability and save/share behavior.',
    hook: '"POV: you finally fixed your mornings."',
    script:
      'Handheld POV through a real morning. The product appears naturally at the friction point and removes it. Quick, authentic beats with trending audio and captions.',
    cta: 'Make it yours — link in bio.',
    viralScore: 88,
    style: 'Emotional',
  },
  {
    id: 'c4',
    name: 'The Honest Review Bit',
    strategy:
      'Comedy-driven skit that disarms skepticism with humor while still landing the core benefit. Great for comments and shares.',
    hook: '"My honest review after being forced to try this."',
    script:
      'Deadpan talking-head skit. Playful objections get comedically dismantled as the product proves itself. Punchline lands on the value prop.',
    cta: 'Go on, prove me wrong.',
    viralScore: 84,
    style: 'Funny',
  },
  {
    id: 'c5',
    name: 'Origin Story Cinematic',
    strategy:
      'A short cinematic narrative that ties the brand mission to the viewer’s aspiration, building emotional brand equity beyond a single sale.',
    hook: '"Every great product starts with a problem worth solving."',
    script:
      'Wide cinematic establishing shots. A protagonist faces the problem. The product enters as the turning point. Triumphant resolution, brand promise, logo reveal.',
    cta: 'Join the story.',
    viralScore: 81,
    style: 'Cinematic',
  },
]

export type Campaign = {
  id: string
  name: string
  product: string
  goal: string
  style: string
  format: string
  status: 'Draft' | 'In Review' | 'Ready' | 'Published'
  viralScore: number
  updated: string
}

export const SAMPLE_CAMPAIGNS: Campaign[] = [
  {
    id: 'k1',
    name: 'Summer Glow Launch',
    product: 'Radiance Serum',
    goal: 'Product Launch',
    style: 'Luxury',
    format: 'Instagram Reels · 9:16',
    status: 'Published',
    viralScore: 90,
    updated: '2 days ago',
  },
  {
    id: 'k2',
    name: 'Back-to-School Push',
    product: 'FocusPods Earbuds',
    goal: 'Sales',
    style: 'Viral',
    format: 'TikTok · 9:16',
    status: 'Ready',
    viralScore: 87,
    updated: '5 hours ago',
  },
  {
    id: 'k3',
    name: 'Founder Story Series',
    product: 'Brew & Co. Coffee',
    goal: 'Brand Awareness',
    style: 'Cinematic',
    format: 'YouTube · 16:9',
    status: 'In Review',
    viralScore: 76,
    updated: '1 week ago',
  },
  {
    id: 'k4',
    name: 'Holiday Teaser',
    product: 'Aurora Smart Lamp',
    goal: 'Social Media',
    style: 'Emotional',
    format: 'YouTube Shorts · 9:16',
    status: 'Draft',
    viralScore: 68,
    updated: 'Just now',
  },
]

export type Scene = {
  id: string
  label: string
  duration: string
  description: string
}

export const SAMPLE_SCENES: Scene[] = [
  { id: 's1', label: 'Hook', duration: '0:00–0:03', description: 'Scroll-stopping open with kinetic text' },
  { id: 's2', label: 'Problem', duration: '0:03–0:07', description: 'Relatable pain point close-up' },
  { id: 's3', label: 'Reveal', duration: '0:07–0:12', description: 'Product enters, snap transition' },
  { id: 's4', label: 'Proof', duration: '0:12–0:20', description: 'Benefit demo with overlays' },
  { id: 's5', label: 'CTA', duration: '0:20–0:25', description: 'Logo lockup and call to action' },
]

export const VIRAL_METRICS = [
  { label: 'Hook Score', value: 91, note: 'Strong first-3-second retention signal' },
  { label: 'Emotion Score', value: 84, note: 'Clear emotional arc detected' },
  { label: 'Attention Score', value: 88, note: 'High pacing and visual variety' },
  { label: 'Share Potential', value: 79, note: 'Relatable, comment-friendly framing' },
]

export const OVERALL_VIRAL = 86

export const SAMPLE_BRANDS = [
  {
    id: 'b1',
    name: 'Lumen Skincare',
    voice: 'Warm, confident, science-backed',
    colors: ['#E8724C', '#F2C879', '#22201D'],
    products: ['Radiance Serum', 'Night Repair Cream', 'Daily SPF 50'],
    audiences: ['Beauty & Skincare', 'Millennials (25–40)'],
  },
  {
    id: 'b2',
    name: 'FocusPods',
    voice: 'Bold, energetic, playful',
    colors: ['#E8724C', '#5AA9E6', '#1B1B1F'],
    products: ['FocusPods Earbuds', 'FocusPods Case'],
    audiences: ['Gen Z (18–24)', 'Tech Early Adopters'],
  },
]
