import pages from '~~/content/settings/pages.json'
import type { SitePages } from '~~/shared/page-content'

const settings: SitePages = pages

/** Editorial copy is build-validated JSON; interface labels remain owned by useLocale. */
export function useSiteContent() {
  const { locale } = useLocale()
  return computed(() => settings[locale.value])
}
