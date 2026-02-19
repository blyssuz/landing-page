'use client'

import { useState } from 'react'
import { Star, Clock, User, CheckCircle, AlertCircle, XCircle, ArrowLeft } from 'lucide-react'
import type { Locale } from '@/lib/i18n'
import translations from '@/lib/translations'
import { submitReview } from './actions'

interface ReviewItem {
  booking_item_id: string
  service_name: { uz: string; ru: string }
  employee_name: string
  start_time: string
  price: number
  rating: number | null
}

interface ReviewData {
  token: string
  business_name: string
  customer_name: string
  booking_date: string
  items: ReviewItem[]
  status: string
  comment: string | null
}

type PageState = 'form' | 'success' | 'already_submitted' | 'expired' | 'not_found'

interface Props {
  locale: Locale
  initialState: PageState
  review: ReviewData | null
  token: string
}

function InteractiveStars({
  rating,
  onRate,
  locale,
}: {
  rating: number
  onRate: (r: number) => void
  locale: Locale
}) {
  const [hover, setHover] = useState(0)
  const active = hover || rating
  const t = translations.review

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRate(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="p-1 transition-transform hover:scale-110 active:scale-95"
          >
            <Star
              size={32}
              className={
                star <= active
                  ? 'text-amber-400 drop-shadow-sm'
                  : 'text-gray-300 dark:text-gray-600'
              }
              fill={star <= active ? 'currentColor' : 'none'}
            />
          </button>
        ))}
      </div>
      {active > 0 && (
        <span className="text-sm text-gray-500 dark:text-gray-400 animate-fadeIn">
          {t.stars[active as 1 | 2 | 3 | 4 | 5][locale]}
        </span>
      )}
    </div>
  )
}

function formatDate(dateStr: string, locale: Locale) {
  const [year, month, day] = dateStr.split('-')
  if (locale === 'ru') {
    const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
    return `${parseInt(day)} ${months[parseInt(month) - 1]} ${year}`
  }
  const months = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr']
  return `${parseInt(day)}-${months[parseInt(month) - 1]} ${year}`
}

function formatPrice(price: number) {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

export default function RatingPage({ locale, initialState, review, token }: Props) {
  const t = translations.review
  const [state, setState] = useState<PageState>(initialState)
  const [ratings, setRatings] = useState<Record<string, number>>({})
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const allRated = review ? review.items.every((item) => ratings[item.booking_item_id] > 0) : false

  async function handleSubmit() {
    if (!review || !allRated || submitting) return

    setSubmitting(true)
    setError('')

    const ratingsList = review.items.map((item) => ({
      booking_item_id: item.booking_item_id,
      rating: ratings[item.booking_item_id],
    }))

    const result = await submitReview(token, ratingsList, comment)

    if (result.error === 'already_submitted') {
      setState('already_submitted')
    } else if (result.error === 'expired') {
      setState('expired')
    } else if (result.error) {
      setError(locale === 'ru' ? 'Произошла ошибка. Попробуйте ещё раз.' : 'Xatolik yuz berdi. Qayta urinib ko\'ring.')
      setSubmitting(false)
    } else {
      setState('success')
    }
  }

  // Status screens
  if (state === 'not_found') {
    return (
      <StatusScreen
        icon={<XCircle size={48} className="text-gray-400" />}
        title={t.notFound[locale]}
        message={t.notFoundMessage[locale]}
        locale={locale}
      />
    )
  }

  if (state === 'expired') {
    return (
      <StatusScreen
        icon={<AlertCircle size={48} className="text-amber-400" />}
        title={t.expired[locale]}
        message={t.expiredMessage[locale]}
        locale={locale}
      />
    )
  }

  if (state === 'already_submitted') {
    return (
      <StatusScreen
        icon={<CheckCircle size={48} className="text-green-500" />}
        title={t.alreadySubmitted[locale]}
        message={t.alreadySubmittedMessage[locale]}
        locale={locale}
      />
    )
  }

  if (state === 'success') {
    return (
      <StatusScreen
        icon={<CheckCircle size={48} className="text-green-500" />}
        title={t.success[locale]}
        message={t.successMessage[locale]}
        locale={locale}
      />
    )
  }

  // Form state
  if (!review) return null

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-lg px-4 py-8">
        
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-foreground">{review.business_name}</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {formatDate(review.booking_date, locale)}
          </p>
          <p className="mt-3 text-base text-gray-600 dark:text-gray-300">{t.subtitle[locale]}</p>
        </div>

        {/* Service items */}
        <div className="space-y-4">
          {review.items.map((item) => (
            <div
              key={item.booking_item_id}
              className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 p-5 transition-shadow"
            >
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-foreground">
                  {item.service_name[locale]}
                </h3>
              </div>
              <InteractiveStars
                rating={ratings[item.booking_item_id] || 0}
                onRate={(r) => setRatings((prev) => ({ ...prev, [item.booking_item_id]: r }))}
                locale={locale}
              />
            </div>
          ))}
        </div>

        {/* Comment */}
        <div className="mt-6">
          <label className="mb-2 block text-sm font-medium text-gray-600 dark:text-gray-300">
            {t.comment[locale]}
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={t.commentPlaceholder[locale]}
            maxLength={1000}
            rows={3}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 px-4 py-3 text-foreground placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-primary focus:ring-1 focus:ring-primary resize-none transition-colors"
          />
        </div>

        {/* Error */}
        {error && (
          <p className="mt-3 text-center text-sm text-red-500">{error}</p>
        )}

        {/* Hint */}
        {!allRated && (
          <p className="mt-4 text-center text-sm text-gray-400 dark:text-gray-500">
            {t.rateAll[locale]}
          </p>
        )}

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          disabled={!allRated || submitting}
          className="mt-6 w-full rounded-xl bg-primary py-3.5 text-base font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {submitting ? t.submitting[locale] : t.submit[locale]}
        </button>
      </div>
    </div>
  )
}

function StatusScreen({
  icon,
  title,
  message,
  locale,
}: {
  icon: React.ReactNode
  title: string
  message: string
  locale: Locale
}) {
  const t = translations.review
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="text-center animate-fadeInUp">
        <div className="mb-4 flex justify-center">{icon}</div>
        <h1 className="text-xl font-bold text-foreground">{title}</h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">{message}</p>
        <a
          href={`/${locale}`}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98]"
        >
          <ArrowLeft size={16} />
          {t.backToHome[locale]}
        </a>
      </div>
    </div>
  )
}
