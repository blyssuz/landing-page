import type { Locale } from './i18n'

const translations = {
  hero: {
    title: {
      ru: 'Запишитесь к лучшим мастерам',
      uz: 'Eng yaxshi ustalarga yoziling',
    },
    subtitle: {
      ru: 'Найдите и запишитесь к мастерам красоты рядом с вами',
      uz: 'Yaqiningizdagi go\'zallik ustalarini toping va yoziling',
    },
  },
  search: {
    treatments: {
      ru: 'Все услуги и салоны',
      uz: 'Barcha xizmatlar va salonlar',
    },
    location: {
      ru: 'Текущее местоположение',
      uz: 'Joriy joylashuv',
    },
    button: {
      ru: 'Найти',
      uz: 'Qidirish',
    },
  },
  venues: {
    recentlyViewed: {
      ru: 'Недавно просмотренные',
      uz: 'Yaqinda ko\'rilgan',
    },
    recommended: {
      ru: 'Рекомендуемые',
      uz: 'Tavsiya etilgan',
    },
    newToBlyss: {
      ru: 'Новые на Blyss',
      uz: 'Blyss\'da yangi',
    },
    trending: {
      ru: 'Популярные',
      uz: 'Ommabop',
    },
    nearest: {
      ru: 'Рядом с вами',
      uz: 'Sizga yaqin',
    },
  },
  business: {
    title: {
      ru: 'Blyss для бизнеса',
      uz: 'Blyss biznes uchun',
    },
    description: {
      ru: 'Управляйте записями, календарём, оплатами и взаимоотношениями с клиентами на одной платформе. Развивайте свой бизнес с удобными инструментами Blyss.',
      uz: 'Buyurtmalar, taqvim, to\'lovlar va mijozlar bilan munosabatlarni bitta platformada boshqaring. Blyss\'ning qulay vositalari bilan biznesingizni rivojlantiring.',
    },
    cta: {
      ru: 'Узнать больше',
      uz: 'Batafsil',
    },
    days: {
      ru: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
      uz: ['Ya', 'Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh'],
    },
  },
  browse: {
    title: {
      ru: 'Поиск по регионам',
      uz: 'Hududlar bo\'yicha qidirish',
    },
    inCity: {
      ru: 'в',
      uz: '',
    },
  },
  review: {
    title: {
      ru: 'Оцените визит',
      uz: 'Tashrifni baholang',
    },
    subtitle: {
      ru: 'Оцените каждую услугу',
      uz: 'Har bir xizmatni baholang',
    },
    employee: {
      ru: 'Мастер',
      uz: 'Usta',
    },
    comment: {
      ru: 'Комментарий (необязательно)',
      uz: 'Izoh (ixtiyoriy)',
    },
    commentPlaceholder: {
      ru: 'Расскажите о вашем визите...',
      uz: 'Tashrifingiz haqida yozing...',
    },
    submit: {
      ru: 'Отправить',
      uz: 'Yuborish',
    },
    submitting: {
      ru: 'Отправка...',
      uz: 'Yuborilmoqda...',
    },
    success: {
      ru: 'Спасибо за отзыв!',
      uz: 'Fikringiz uchun rahmat!',
    },
    successMessage: {
      ru: 'Ваша оценка помогает нам становиться лучше',
      uz: 'Bahoyingiz bizga yaxshilanishga yordam beradi',
    },
    expired: {
      ru: 'Срок ссылки истёк',
      uz: 'Havola muddati tugagan',
    },
    expiredMessage: {
      ru: 'Эта ссылка для отзыва больше не действительна',
      uz: 'Bu baho havolasi endi amal qilmaydi',
    },
    notFound: {
      ru: 'Отзыв не найден',
      uz: 'Baho topilmadi',
    },
    notFoundMessage: {
      ru: 'Ссылка недействительна или была удалена',
      uz: 'Havola noto\'g\'ri yoki o\'chirilgan',
    },
    alreadySubmitted: {
      ru: 'Отзыв уже отправлен',
      uz: 'Baho allaqachon yuborilgan',
    },
    alreadySubmittedMessage: {
      ru: 'Вы уже оценили этот визит. Спасибо!',
      uz: 'Siz bu tashrifni allaqachon baholdingiz. Rahmat!',
    },
    rateAll: {
      ru: 'Оцените все услуги для отправки',
      uz: 'Yuborish uchun barcha xizmatlarni baholang',
    },
    backToHome: {
      ru: 'На главную',
      uz: 'Bosh sahifaga',
    },
    stars: {
      1: { ru: 'Плохо', uz: 'Yomon' },
      2: { ru: 'Ниже среднего', uz: 'O\'rtadan past' },
      3: { ru: 'Нормально', uz: 'O\'rtacha' },
      4: { ru: 'Хорошо', uz: 'Yaxshi' },
      5: { ru: 'Отлично', uz: 'A\'lo' },
    },
  },
} as const

export default translations
