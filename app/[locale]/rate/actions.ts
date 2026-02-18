'use server'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export async function getReview(token: string) {
  try {
    const res = await fetch(`${API_URL}/public/reviews/${encodeURIComponent(token)}`, {
      cache: 'no-store',
    })

    if (res.status === 404) {
      return { error: 'not_found' as const }
    }
    if (res.status === 410) {
      return { error: 'expired' as const }
    }
    if (!res.ok) {
      return { error: 'unknown' as const }
    }

    const data = await res.json()
    return { data }
  } catch {
    return { error: 'unknown' as const }
  }
}

export async function submitReview(
  token: string,
  ratings: { booking_item_id: string; rating: number }[],
  comment: string
) {
  try {
    const res = await fetch(`${API_URL}/public/reviews/${encodeURIComponent(token)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ratings, comment }),
    })

    if (res.status === 409) {
      return { error: 'already_submitted' as const }
    }
    if (res.status === 410) {
      return { error: 'expired' as const }
    }
    if (!res.ok) {
      return { error: 'unknown' as const }
    }

    return { success: true }
  } catch {
    return { error: 'unknown' as const }
  }
}
