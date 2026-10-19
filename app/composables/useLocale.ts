import { messages } from '~/i18n/messages'

/** Localizes stable routes without a mutable global singleton during static rendering. */
export function useLocale() {
  const route = useRoute()
  const locale = computed(() => route.params.lang === 'ru' ? 'ru' : 'en')
  const copy = computed(() => messages[locale.value])
  const alternatePath = computed(() => locale.value === 'ru'
    ? route.path.replace(/^\/ru(?=\/|$)/, '') || '/'
    : `/ru${route.path === '/' ? '' : route.path}`)

  /** Prefixes an internal absolute path with the active language. */
  function localePath(path: string) {
    return locale.value === 'ru' ? `/ru${path === '/' ? '' : path}` : path
  }

  return { locale, copy, alternatePath, localePath }
}
