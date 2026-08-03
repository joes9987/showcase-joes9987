import { redirect } from 'next/navigation'

/** Nav label is “Evidence”; keep /evidence working for typed/shared links. */
export default function EvidenceRedirectPage () {
  redirect('/for-partners')
}
