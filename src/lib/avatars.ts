export function githubAvatarUrl (handle: string) {
  return `https://github.com/${handle}.png?size=128`
}

export function memberAvatarUrl (avatarUrl: string | null | undefined, handle: string) {
  return avatarUrl?.trim() || githubAvatarUrl(handle)
}
