import { readFile } from 'fs/promises'
import path from 'path'

export type ForthProject = {
  id: string
  title: string
  status: string
  owner: string
  note: string
}

export type ForthLiveFile = {
  lastCheckedAt: string
  reachable: boolean
  httpStatus: number | null
}

export type ForthStatus = {
  source: string
  sourceLabel: string
  updatedAt: string
  summary: string
  projects: ForthProject[]
  howToRefresh?: string
  live?: ForthLiveFile
}

export async function loadForthStatus (): Promise<ForthStatus> {
  const file = path.join(process.cwd(), 'data', 'forth-status.json')
  const raw = await readFile(file, 'utf8')
  return JSON.parse(raw) as ForthStatus
}
