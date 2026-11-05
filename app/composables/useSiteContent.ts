import pages from '~~/content/settings/pages.json'
import profile from '~~/content/settings/profile.json'
import type { SitePages } from '~~/shared/page-content'
import { applyPositioning } from '~~/shared/positioning'
import { typesetSettings } from '~~/shared/typography'

const positioned: SitePages = applyPositioning({ settings: pages, profile })
const settings: SitePages = {
  en: typesetSettings({ settings: positioned.en, locale: 'en' }),
  ru: typesetSettings({ settings: positioned.ru, locale: 'ru' })
}

/** Editorial copy is build-validated JSON; interface labels remain owned by useLocale. */
export function useSiteContent() {
  const { locale } = useLocale()
  return computed(() => settings[locale.value])
}
