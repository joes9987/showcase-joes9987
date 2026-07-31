import { ImageResponse } from 'next/og'
import { SITE } from '@/lib/site'

export const alt = `${SITE.name} — ${SITE.cohort}`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpengraphImage () {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          background: 'linear-gradient(135deg, #0f172a 0%, #0e7490 55%, #4f46e5 100%)',
          color: '#f8fafc',
          fontFamily: 'sans-serif'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 72,
              height: 72,
              borderRadius: 20,
              background: 'rgba(248, 250, 252, 0.15)',
              border: '2px solid rgba(248, 250, 252, 0.4)',
              fontSize: 32,
              fontWeight: 700
            }}
          >
            EM
          </div>
          <div style={{ fontSize: 40, fontWeight: 700 }}>{SITE.name}</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.1 }}>{SITE.tagline}</div>
          <div style={{ fontSize: 32, color: 'rgba(248, 250, 252, 0.85)' }}>
            {`${SITE.cohort} · people, portfolios, and Forth project status`}
          </div>
        </div>

        <div style={{ display: 'flex', fontSize: 26, color: 'rgba(248, 250, 252, 0.75)' }}>
          showcase-joes9987.vercel.app
        </div>
      </div>
    ),
    size
  )
}
