export const SITE = {
  name: 'EudaMarket',
  tagline: 'Proof over pitch — inspect the cohort on GitHub.',
  cohort: 'Hult Summer Pilot 2026',
  pmUrl: process.env.NEXT_PUBLIC_EUDA_PM_URL ?? 'https://pm-joes9987.vercel.app',
  chatUrl: process.env.NEXT_PUBLIC_EUDA_CHAT_URL ?? 'https://comms-joes9987.vercel.app',
  forthUrl: process.env.NEXT_PUBLIC_FORTH_URL ?? 'https://forth-bice.vercel.app',
  marketUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://showcase-joes9987.vercel.app',
  placementEmail: process.env.PLACEMENT_LEAD_EMAIL ?? 'singhjoe57@gmail.com'
} as const

export type MemberLinks = {
  github?: string | null
  pmRepo?: string | null
  pmDeploy?: string | null
  chatRepo?: string | null
  chatDeploy?: string | null
  showcaseRepo?: string | null
  showcaseDeploy?: string | null
  forth?: string | null
}

export type ShowcaseMember = {
  github_handle: string
  display_name: string
  headline: string | null
  bio: string | null
  avatar_url: string | null
  banner_url: string | null
  campus: string | null
  skills: string[]
  opt_out: boolean
  links: MemberLinks | null
  claimed_by: string | null
  updated_at?: string
}
