import { NextResponse } from 'next/server'
import { probeForth } from '@/lib/forth-live'
import { loadForthStatus } from '@/lib/forth-status'
import { buildHealthPayload } from '@/lib/health'

export const dynamic = 'force-dynamic'

export async function GET () {
  const forth = await loadForthStatus()
  const live = await probeForth(forth.source)
  return NextResponse.json(buildHealthPayload({ forth, live }))
}
