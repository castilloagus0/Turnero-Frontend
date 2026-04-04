export type StoredUserProfile = {
  fullName: string
  email: string
}

export const USER_PROFILE_KEY = 'turnero_user_profile'

export function getUserProfile(): StoredUserProfile | null {
  try {
    const raw = localStorage.getItem(USER_PROFILE_KEY)
    if (!raw) return null
    const p = JSON.parse(raw) as StoredUserProfile
    if (typeof p.fullName !== 'string' || typeof p.email !== 'string') return null
    return { fullName: p.fullName.trim(), email: p.email.trim() }
  } catch {
    return null
  }
}

export function saveUserProfile(p: StoredUserProfile): void {
  localStorage.setItem(
    USER_PROFILE_KEY,
    JSON.stringify({ fullName: p.fullName.trim(), email: p.email.trim() }),
  )
}

export function clearUserProfile(): void {
  localStorage.removeItem(USER_PROFILE_KEY)
}
