'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { X, Loader2, Phone, User, AlertCircle } from 'lucide-react'
import { sendOtp, verifyOtp, registerUser } from '@/app/[locale]/[tenant]/actions'

// ─── Types ───

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  locale: 'uz' | 'ru'
}

type Step = 'phone' | 'otp' | 'register'

// ─── Translations ───

const T: Record<'uz' | 'ru', Record<string, string>> = {
  uz: {
    loginTitle: 'Kirish',
    phone: 'Telefon raqam',
    sendCode: 'Kod yuborish',
    enterCode: 'Kodni kiriting',
    codeSentSms: 'Kod SMS orqali yuborildi',
    codeSentTelegram: 'Kod Telegram orqali yuborildi',
    resendIn: 'Qayta yuborish: ',
    resend: 'Qayta yuborish',
    verify: 'Tasdiqlash',
    registerTitle: "Ro'yxatdan o'tish",
    firstName: 'Ism',
    firstNameRequired: 'Ism kiritish majburiy (kamida 2 ta harf)',
    lastName: 'Familiya (ixtiyoriy)',
    register: "Ro'yxatdan o'tish",
    error: 'Xatolik yuz berdi',
    sec: 'son',
  },
  ru: {
    loginTitle: 'Вход',
    phone: 'Номер телефона',
    sendCode: 'Отправить код',
    enterCode: 'Введите код',
    codeSentSms: 'Код отправлен по SMS',
    codeSentTelegram: 'Код отправлен через Telegram',
    resendIn: 'Отправить снова: ',
    resend: 'Отправить снова',
    verify: 'Подтвердить',
    registerTitle: 'Регистрация',
    firstName: 'Имя',
    firstNameRequired: 'Имя обязательно (минимум 2 буквы)',
    lastName: 'Фамилия (необязательно)',
    register: 'Зарегистрироваться',
    error: 'Произошла ошибка',
    sec: 'сек',
  },
}

const ERROR_CODES: Record<'uz' | 'ru', Record<string, string>> = {
  uz: {
    INVALID_OTP: 'Noto\'g\'ri kod kiritildi',
    OTP_EXPIRED: 'Kod muddati tugagan, qaytadan yuboring',
    RATE_LIMITED: 'Ko\'p urinishlar, keyinroq qaytadan urinib ko\'ring',
    OTP_DELIVERY_FAILED: 'Kodni yuborishda xatolik. Qaytadan urinib ko\'ring',
    OTP_INVALID_STATE: 'Kod muddati tugagan yoki ishlatilgan',
    PHONE_EXISTS: 'Bu raqam allaqachon ro\'yxatdan o\'tgan',
    PHONE_MISMATCH: 'Telefon raqamlar mos kelmaydi',
    OTP_MAX_ATTEMPTS: 'Kod urinishlari tugadi. Yangi kod so\'rang',
  },
  ru: {
    INVALID_OTP: 'Неверный код',
    OTP_EXPIRED: 'Код истёк, запросите новый',
    RATE_LIMITED: 'Слишком много попыток, попробуйте позже',
    OTP_DELIVERY_FAILED: 'Ошибка отправки кода. Попробуйте ещё раз',
    OTP_INVALID_STATE: 'Код истёк или уже использован',
    PHONE_EXISTS: 'Этот номер уже зарегистрирован',
    PHONE_MISMATCH: 'Номера телефонов не совпадают',
    OTP_MAX_ATTEMPTS: 'Исчерпаны попытки ввода кода. Запросите новый',
  },
}

function getAuthErrorMessage(locale: 'uz' | 'ru', errorCode?: string, fallback?: string): string {
  if (errorCode && ERROR_CODES[locale][errorCode]) return ERROR_CODES[locale][errorCode]
  return fallback || T[locale].error
}

// ─── Helpers ───

function formatPhoneDisplay(digits: string): string {
  const d = digits.replace(/\D/g, '')
  let result = ''
  if (d.length > 0) result += d.slice(0, 2)
  if (d.length > 2) result += ' ' + d.slice(2, 5)
  if (d.length > 5) result += ' ' + d.slice(5, 7)
  if (d.length > 7) result += ' ' + d.slice(7, 9)
  return result
}

function extractDigits(value: string): string {
  return value.replace(/\D/g, '').slice(0, 9)
}

// ─── Component ───

export function LoginModal({ isOpen, onClose, onSuccess, locale }: LoginModalProps) {
  const t = T[locale]

  // State
  const [step, setStep] = useState<Step>('phone')
  const [phoneDigits, setPhoneDigits] = useState('')
  const [otpValues, setOtpValues] = useState<string[]>(['', '', '', '', ''])
  const [deliveryMethod, setDeliveryMethod] = useState<string>('sms')
  const [timer, setTimer] = useState(0)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [otpId, setOtpId] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)

  // Refs
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const phoneInputRef = useRef<HTMLInputElement>(null)

  // Full phone number for API calls
  const fullPhone = '998' + phoneDigits

  // ─── Body scroll lock ───

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      requestAnimationFrame(() => setVisible(true))
    } else {
      document.body.style.overflow = ''
      setVisible(false)
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // ─── Timer ───

  useEffect(() => {
    if (timer > 0) {
      timerRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [timer])

  // ─── Reset on close ───

  const handleClose = useCallback(() => {
    setVisible(false)
    setTimeout(() => {
      onClose()
      setStep('phone')
      setPhoneDigits('')
      setOtpValues(['', '', '', '', ''])
      setFirstName('')
      setLastName('')
      setOtpId('')
      setError('')
      setLoading(false)
      setTimer(0)
    }, 200)
  }, [onClose])

  // ─── Escape key ───

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) handleClose()
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [isOpen, handleClose])

  // ─── Phone step ───

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = extractDigits(e.target.value)
    setPhoneDigits(digits)
    setError('')
  }

  const handleSendCode = async () => {
    if (phoneDigits.length !== 9) return
    setLoading(true)
    setError('')

    try {
      const result = await sendOtp(fullPhone)
      if (result.success) {
        setDeliveryMethod(result.delivery_method)
        setStep('otp')
        setTimer(60)
        setTimeout(() => otpRefs.current[0]?.focus(), 100)
      } else {
        if (result.wait_seconds && result.wait_seconds > 0) {
          setStep('otp')
          setTimer(result.wait_seconds)
          setTimeout(() => otpRefs.current[0]?.focus(), 100)
        } else {
          setError(getAuthErrorMessage(locale, result.error_code, result.error))
        }
      }
    } catch {
      setError(t.error)
    } finally {
      setLoading(false)
    }
  }

  const handlePhoneKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSendCode()
  }

  // ─── OTP step ───

  const doVerify = useCallback(
    async (code: string) => {
      setLoading(true)
      setError('')
      try {
        const result = await verifyOtp(fullPhone, parseInt(code, 10))
        if (result.success) {
          if (result.needs_registration) {
            setOtpId(result.otp_id)
            setStep('register')
          } else {
            onSuccess()
          }
        } else {
          setError(getAuthErrorMessage(locale, result.error_code, result.error))
          setOtpValues(['', '', '', '', ''])
          setTimeout(() => otpRefs.current[0]?.focus(), 100)
        }
      } catch {
        setError(t.error)
      } finally {
        setLoading(false)
      }
    },
    [fullPhone, onSuccess, t.error]
  )

  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1)
    const newValues = [...otpValues]
    newValues[index] = digit
    setOtpValues(newValues)
    setError('')

    if (digit && index < 4) {
      otpRefs.current[index + 1]?.focus()
    }

    if (digit && index === 4) {
      const code = newValues.join('')
      if (code.length === 5) {
        doVerify(code)
      }
    } else if (digit) {
      const allNewValues = [...newValues]
      if (allNewValues.every((v) => v !== '')) {
        doVerify(allNewValues.join(''))
      }
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
    if (e.key === 'Enter') {
      const code = otpValues.join('')
      if (code.length === 5) doVerify(code)
    }
  }

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 5)
    if (!pasted) return

    const newValues = [...otpValues]
    for (let i = 0; i < 5; i++) {
      newValues[i] = pasted[i] || ''
    }
    setOtpValues(newValues)

    const nextEmpty = newValues.findIndex((v) => !v)
    if (nextEmpty >= 0) {
      otpRefs.current[nextEmpty]?.focus()
    } else {
      otpRefs.current[4]?.focus()
      doVerify(newValues.join(''))
    }
  }

  const handleResend = async () => {
    if (timer > 0) return
    setLoading(true)
    setError('')
    setOtpValues(['', '', '', '', ''])

    try {
      const result = await sendOtp(fullPhone)
      if (result.success) {
        setDeliveryMethod(result.delivery_method)
        setTimer(60)
        setTimeout(() => otpRefs.current[0]?.focus(), 100)
      } else {
        if (result.wait_seconds && result.wait_seconds > 0) {
          setTimer(result.wait_seconds)
        } else {
          setError(getAuthErrorMessage(locale, result.error_code, result.error))
        }
      }
    } catch {
      setError(t.error)
    } finally {
      setLoading(false)
    }
  }

  // ─── Register step ───

  const validateFirstName = (name: string): boolean => {
    const trimmed = name.trim()
    if (trimmed.length < 2) return false
    if (!/^[\p{L}\s\-']+$/u.test(trimmed)) return false
    return true
  }

  const handleRegister = async () => {
    if (!validateFirstName(firstName)) {
      setError(t.firstNameRequired)
      return
    }
    setLoading(true)
    setError('')

    try {
      const result = await registerUser(otpId, fullPhone, firstName.trim(), lastName.trim())
      if (result.success) {
        onSuccess()
      } else {
        setError(getAuthErrorMessage(locale, result.error_code, result.error))
      }
    } catch {
      setError(t.error)
    } finally {
      setLoading(false)
    }
  }

  const handleRegisterKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleRegister()
  }

  // ─── Render guards ───

  if (!isOpen) return null

  // ─── Render ───

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/50 overflow-y-auto transition-opacity duration-200 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose()
      }}
    >
      <div
        className={`bg-white rounded-2xl p-6 sm:p-8 w-full max-w-md lg:w-2xl mx-4 my-auto shadow-2xl relative transition-all duration-200 ${
          visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 w-9 h-9 flex items-center justify-center rounded-full hover:bg-stone-100 transition-colors"
          aria-label="Close"
        >
          <X size={20} className="text-stone-500" />
        </button>

        {/* ─── Phone Step ─── */}
        {step === 'phone' && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Phone size={22} className="text-primary" />
              </div>
              <h2 className="text-2xl lg:text-3xl font-semibold text-stone-900">{t.loginTitle}</h2>
            </div>

            <label className="block text-base font-medium text-stone-700 mb-2">{t.phone}</label>
            <div className="flex items-center border border-stone-200 rounded-xl overflow-hidden focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
              <span className="px-4 py-3.5 bg-stone-50 text-stone-500 font-medium text-base border-r border-stone-200 select-none">
                +998
              </span>
              <input
                ref={phoneInputRef}
                type="tel"
                inputMode="numeric"
                value={formatPhoneDisplay(phoneDigits)}
                onChange={handlePhoneChange}
                onKeyDown={handlePhoneKeyDown}
                placeholder="XX XXX XX XX"
                className="flex-1 px-4 py-3.5 text-base outline-none bg-white text-stone-900 placeholder-stone-400"
                autoFocus
              />
            </div>

            <button
              onClick={handleSendCode}
              disabled={phoneDigits.length !== 9 || loading}
              className="w-full mt-5 py-3.5 rounded-xl text-white font-semibold text-base bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              {t.sendCode}
            </button>
          </div>
        )}

        {/* ─── OTP Step ─── */}
        {step === 'otp' && (
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Phone size={22} className="text-primary" />
              </div>
              <h2 className="text-2xl lg:text-3xl font-semibold text-stone-900">{t.enterCode}</h2>
            </div>

            <p className="text-base text-stone-500 mb-6 ml-[60px]">
              {deliveryMethod === 'telegram' ? t.codeSentTelegram : t.codeSentSms}
            </p>

            {/* OTP inputs */}
            <div className="flex justify-center gap-3 mb-4" onPaste={handleOtpPaste}>
              {otpValues.map((val, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    otpRefs.current[i] = el
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={val}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  className="w-14 h-14 text-center text-2xl font-semibold border border-stone-200 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-stone-900 bg-white"
                  disabled={loading}
                />
              ))}
            </div>

            {/* Timer / resend */}
            <div className="text-center mb-4">
              {timer > 0 ? (
                <span className="text-base text-stone-400">
                  {t.resendIn}
                  {timer} {t.sec}
                </span>
              ) : (
                <button
                  onClick={handleResend}
                  disabled={loading}
                  className="text-base text-primary hover:text-primary/90 font-medium transition-colors disabled:opacity-50"
                >
                  {t.resend}
                </button>
              )}
            </div>

            {/* Verify button */}
            <button
              onClick={() => {
                const code = otpValues.join('')
                if (code.length === 5) doVerify(code)
              }}
              disabled={otpValues.some((v) => !v) || loading}
              className="w-full py-3.5 rounded-xl text-white font-semibold text-base bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              {t.verify}
            </button>
          </div>
        )}

        {/* ─── Register Step ─── */}
        {step === 'register' && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <User size={22} className="text-primary" />
              </div>
              <h2 className="text-2xl lg:text-3xl font-semibold text-stone-900">{t.registerTitle}</h2>
            </div>

            {/* First name */}
            <label className="block text-base font-medium text-stone-700 mb-1.5">{t.firstName}</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value)
                setError('')
              }}
              onKeyDown={handleRegisterKeyDown}
              placeholder={t.firstName}
              className="w-full px-4 py-3.5 border border-stone-200 rounded-xl text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-stone-900 bg-white placeholder-stone-400 mb-4"
              autoFocus
            />

            {/* Last name */}
            <label className="block text-base font-medium text-stone-700 mb-1.5">{t.lastName}</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              onKeyDown={handleRegisterKeyDown}
              placeholder={t.lastName}
              className="w-full px-4 py-3.5 border border-stone-200 rounded-xl text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-stone-900 bg-white placeholder-stone-400 mb-1"
            />

            <button
              onClick={handleRegister}
              disabled={loading}
              className="w-full mt-4 py-3.5 rounded-xl text-white font-semibold text-base bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              {t.register}
            </button>
          </div>
        )}
      </div>

      {/* ─── Error Popup ─── */}
      {error && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40"
          onClick={() => setError('')}
        >
          <div
            className="bg-white rounded-2xl p-6 mx-4 max-w-sm w-full shadow-2xl text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-red-100 flex items-center justify-center">
              <AlertCircle size={24} className="text-red-500" />
            </div>
            <p className="text-stone-900 font-medium text-base mb-4">{error}</p>
            <button
              onClick={() => setError('')}
              className="px-8 py-2.5 rounded-xl bg-stone-900 text-white text-base font-medium hover:bg-stone-800 transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
