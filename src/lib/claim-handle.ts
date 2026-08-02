/** Normalize email local-part to a GitHub-handle-shaped claim key. */
export function handleFromEmail (email: string): string {
  const local = email.split('@')[0] ?? ''
  return local.replace(/[^A-Za-z0-9-]/g, '').slice(0, 39)
}

export function isValidGithubHandle (handle: string): boolean {
  return /^[A-Za-z0-9-]{1,39}$/.test(handle)
}
