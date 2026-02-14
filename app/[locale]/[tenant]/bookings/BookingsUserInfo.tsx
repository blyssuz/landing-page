'use client'

import { LogOut } from 'lucide-react'
import { logout } from '../actions'
import type { Locale } from '@/lib/i18n'

interface BookingsUserInfoProps {
  user: { phone: string; first_name: string; last_name: string }
  locale: Locale
}

const T: Record<Locale, { logOut: string }> = {
  uz: { logOut: 'Chiqish' },
  ru: { logOut: 'Выйти' },
}

export function BookingsUserInfo({ user, locale }: BookingsUserInfoProps) {
  const t = T[locale]
  const name = [user.first_name, user.last_name].filter(Boolean).join(' ')
  const displayName = name || user.phone
  const initial = name ? name[0].toUpperCase() : user.phone[0]

  const handleLogout = async () => {
    await logout()
    window.location.reload()
  }

  return (
    <div className="flex items-center justify-between px-4 lg:px-5 py-3 lg:py-4">
      <div className="flex items-center gap-3 lg:gap-4">
        <div className="w-11 h-11 lg:w-14 lg:h-14 rounded-full bg-[#088395] text-white flex items-center justify-center text-base lg:text-xl font-bold">
          {initial}
        </div>
        <div>
          <p className="text-base lg:text-2xl font-bold text-zinc-900 dark:text-zinc-100">{displayName}</p>
          {name && <p className="text-sm lg:text-lg text-zinc-500 dark:text-zinc-400">+{user.phone}</p>}
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="flex items-center gap-1.5 lg:gap-2 px-3 lg:px-4 py-1.5 lg:py-2 text-sm lg:text-base text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
      >
        <LogOut size={16} className="lg:hidden" />
        <LogOut size={18} className="hidden lg:block" />
        {t.logOut}
      </button>
    </div>
  )
}
