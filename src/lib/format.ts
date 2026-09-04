/** Initials from a display name */
export function initials(name: string | null | undefined): string {
  if (!name?.trim()) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

/** Format YYYY-MM-DD for display */
export function formatTargetDate(iso: string | null | undefined): string | null {
  if (!iso) return null
  try {
    const d = new Date(iso + (iso.length === 10 ? 'T12:00:00' : ''))
    return d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: d.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
    })
  } catch {
    return iso
  }
}
