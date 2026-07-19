export const site = {
  name: 'Александр Аликин',
  fullName: 'Александр Сергеевич Аликин',
  title: 'Инженер, педагог и предприниматель',
  description:
    'Персональная цифровая платформа Александра Аликина: проекты, инженерное образование, искусственный интеллект, предпринимательский опыт, мысли и истории.',
  repository: 'https://github.com/spikeal8-maker/alexander-alikin',
  location: 'Москва, Россия',
  contact: {
    primary: 'https://t.me/spikeal',
    max: 'https://web.max.ru/5708133'
  },
  socials: [
    { name: 'Telegram', url: 'https://t.me/spikeal', purpose: 'Личный контакт и авторские публикации' },
    { name: 'ВКонтакте', url: 'https://vk.ru/spikeal.site', purpose: 'Личный профиль и архив деятельности' },
    { name: 'MAX', url: 'https://web.max.ru/5708133', purpose: 'Контакт и проектные сообщества' },
    { name: 'RUTUBE', url: 'https://rutube.ru/channel/2420333/', purpose: 'Видео, уроки и архив проектов' },
    { name: 'Дзен', url: 'https://dzen.ru/alikinas', purpose: 'Статьи и тематические публикации' },
    { name: 'Instagram', url: 'https://www.instagram.com/spikea.site/', purpose: 'Визуальный архив; идентификатор требует унификации' }
  ],
  projects: [
    { name: 'ИЗО АСА', url: 'https://izo.alikinas.ru/' },
    { name: 'ИИ для бизнеса', url: 'https://ii-busi.ru' }
  ],
  nav: [
    { label: 'Главная', href: '/' },
    { label: 'Обо мне', href: '/about/' },
    { label: 'Проекты', href: '/projects/' },
    { label: 'Истории', href: '/stories/' },
    { label: 'Мысли', href: '/thoughts/' },
    { label: 'Сейчас', href: '/now/' },
    { label: 'Новости', href: '/news/' },
    { label: 'Сотрудничество', href: '/collaboration/' }
  ]
} as const;
