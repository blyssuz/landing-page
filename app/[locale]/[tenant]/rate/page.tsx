import { redirect } from 'next/navigation'
import { isValidLocale, DEFAULT_LOCALE } from '@/lib/i18n'
import type { Locale } from '@/lib/i18n'
import type { Metadata } from 'next'
import { getReview } from './actions'
import RatingPage from './RatingPage'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const title = locale === 'uz' ? 'Tashrifni baholang — Blyss' : 'Оцените визит — Blyss'
  return {
    title,
    robots: { index: false, follow: false },
  }
}

export default async function TenantRatePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; tenant: string }>
  searchParams: Promise<{ token?: string }>
}) {
  const { locale, tenant } = await params
  const { token } = await searchParams

  if (!isValidLocale(locale)) {
    redirect(`/${DEFAULT_LOCALE}`)
  }

  if (!token) {
    return <RatingPage locale={locale as Locale} initialState="not_found" review={null} token="" />
  }

  const result = await getReview(token)

  if (result.error === 'not_found') {
    return <RatingPage locale={locale as Locale} initialState="not_found" review={null} token={token} />
  }

  if (result.error === 'expired') {
    return <RatingPage locale={locale as Locale} initialState="expired" review={null} token={token} />
  }

  if (result.error) {
    return <RatingPage locale={locale as Locale} initialState="not_found" review={null} token={token} />
  }

  const review = result.data!

  // Validate token belongs to this tenant
  if (review.tenant_url && review.tenant_url !== tenant) {
    return <RatingPage locale={locale as Locale} initialState="not_found" review={null} token={token} />
  }

  const initialState = review.status === 'submitted' ? 'already_submitted' : 'form'

  return (
    <RatingPage
      locale={locale as Locale}
      initialState={initialState as 'form' | 'already_submitted'}
      review={review}
      token={token}
      primaryColor={review.primary_color}
    />
  )
}
