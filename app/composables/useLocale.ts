import { messages } from '~/i18n/messages'
import { canonicalPagePath } from '~~/shared/seo'

/** Localizes stable routes without a mutable global singleton during static rendering. */
export function useLocale() {
  const route = useRoute()
  const locale = computed(() => /^\/ru(?:\/|$)/.test(route.path) ? 'ru' : 'en')
  const copy = computed(() => messages[locale.value])
  const alternatePath = computed(() => canonicalPagePath(locale.value === 'ru'
    ? route.path.replace(/^\/ru(?=\/|$)/, '') || '/'
    : `/ru${route.path === '/' ? '' : route.path}`))

  /** Prefixes an internal absolute path with the active language. */
  function localePath(path: string) {
    const canonical = canonicalPagePath(path)
    return locale.value === 'ru' ? `/ru${canonical}` : canonical
  }

  return { locale, copy, alternatePath, localePath }
}
