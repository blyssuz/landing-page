import { signedFetch } from '@/lib/api'
import { notFound } from 'next/navigation'
import type { Locale } from '@/lib/i18n'
import { isValidLocale, DEFAULT_LOCALE } from '@/lib/i18n'
import { LocationMap } from '../../../[tenant]/location/LocationMap'

function extractBusinessId(slug: string): string {
  const lastDash = slug.lastIndexOf('-')
  return lastDash !== -1 ? slug.slice(lastDash + 1) : slug
}

async function getBusinessLocation(businessId: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
    const response = await signedFetch(`${apiUrl}/public/businesses/${businessId}/services`, {
      next: { revalidate: 60 },
    })
    if (!response.ok) return null
    const data = await response.json()
    const b = data.business
    if (!b?.location?.lat || !b?.location?.lng) return null
    return {
      name: b.name as string,
      lat: b.location.lat as number,
      lng: b.location.lng as number,
      address: (b.location.address as string | undefined) ?? null,
      primaryColor: (b.primary_color as string | undefined) ?? null,
    }
  } catch {
    return null
  }
}

export default async function LocationPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>
}) {
  const { slug, locale: localeParam } = await params
  const locale: Locale = isValidLocale(localeParam) ? localeParam : DEFAULT_LOCALE
  const businessId = extractBusinessId(slug)

  const business = await getBusinessLocation(businessId)

  if (!business) {
    notFound()
  }

  return (
    <LocationMap
      locale={locale}
      businessName={business.name}
      address={business.address}
      lat={business.lat}
      lng={business.lng}
      primaryColor={business.primaryColor}
    />
  )
}
