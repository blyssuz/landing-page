export interface ServiceLink {
  name: { ru: string; uz: string };
  slug: string;
}

export interface Region {
  id: string;
  name: { ru: string; uz: string };
  services: ServiceLink[];
}

const S = {
  hairSalons: { name: { ru: 'Салоны красоты', uz: "Go'zallik salonlari" }, slug: 'hair-salons' },
  barbers: { name: { ru: 'Барбершопы', uz: 'Sartaroshxonalar' }, slug: 'barbers' },
  nailSalons: { name: { ru: 'Маникюр и педикюр', uz: 'Manikur va pedikur' }, slug: 'nail-salons' },
  spas: { name: { ru: 'СПА', uz: 'SPA' }, slug: 'spas' },
  massage: { name: { ru: 'Массаж', uz: 'Massaj' }, slug: 'massage' },
  skincare: { name: { ru: 'Косметология', uz: 'Kosmetologiya' }, slug: 'skincare' },
  makeup: { name: { ru: 'Визажисты', uz: 'Vizajistlar' }, slug: 'makeup' },
  eyelash: { name: { ru: 'Наращивание ресниц', uz: "Kiprik qo'yish" }, slug: 'eyelash' },
} as const;

export const regions: Region[] = [
  {
    id: 'tashkent_city',
    name: { ru: 'Ташкент', uz: 'Toshkent' },
    services: [S.hairSalons, S.barbers, S.nailSalons, S.spas, S.skincare],
  },
  {
    id: 'tashkent_region',
    name: { ru: 'Ташкентская область', uz: 'Toshkent viloyati' },
    services: [S.hairSalons, S.barbers, S.nailSalons, S.massage],
  },
  {
    id: 'samarkand',
    name: { ru: 'Самарканд', uz: 'Samarqand' },
    services: [S.hairSalons, S.barbers, S.nailSalons, S.spas, S.skincare],
  },
  {
    id: 'bukhara',
    name: { ru: 'Бухара', uz: 'Buxoro' },
    services: [S.hairSalons, S.barbers, S.nailSalons, S.massage],
  },
  {
    id: 'fergana',
    name: { ru: 'Фергана', uz: "Farg'ona" },
    services: [S.hairSalons, S.barbers, S.nailSalons, S.spas],
  },
  {
    id: 'andijan',
    name: { ru: 'Андижан', uz: 'Andijon' },
    services: [S.hairSalons, S.barbers, S.nailSalons, S.massage],
  },
  {
    id: 'namangan',
    name: { ru: 'Наманган', uz: 'Namangan' },
    services: [S.hairSalons, S.barbers, S.nailSalons, S.skincare],
  },
  {
    id: 'kashkadarya',
    name: { ru: 'Кашкадарья', uz: 'Qashqadaryo' },
    services: [S.hairSalons, S.barbers, S.nailSalons, S.massage],
  },
  {
    id: 'surkhandarya',
    name: { ru: 'Сурхандарья', uz: 'Surxondaryo' },
    services: [S.hairSalons, S.barbers, S.nailSalons],
  },
  {
    id: 'khorezm',
    name: { ru: 'Хорезм', uz: 'Xorazm' },
    services: [S.hairSalons, S.barbers, S.nailSalons, S.massage],
  },
  {
    id: 'navoi',
    name: { ru: 'Навои', uz: 'Navoiy' },
    services: [S.hairSalons, S.barbers, S.nailSalons],
  },
  {
    id: 'jizzakh',
    name: { ru: 'Джизак', uz: 'Jizzax' },
    services: [S.hairSalons, S.barbers, S.nailSalons],
  },
  {
    id: 'syrdarya',
    name: { ru: 'Сырдарья', uz: 'Sirdaryo' },
    services: [S.hairSalons, S.barbers, S.nailSalons],
  },
  {
    id: 'karakalpakstan',
    name: { ru: 'Каракалпакстан', uz: "Qoraqalpog'iston" },
    services: [S.hairSalons, S.barbers, S.nailSalons, S.spas],
  },
];
