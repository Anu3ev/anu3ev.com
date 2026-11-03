import pages from '~~/content/settings/pages.json'
import profile from '~~/content/settings/profile.json'
import type { SitePages } from '~~/shared/page-content'
import { applyPositioning } from '~~/shared/positioning'

const settings: SitePages = applyPositioning({ settings: pages, profile })

/** Editorial copy is build-validated JSON; interface labels remain owned by useLocale. */
export function useSiteContent() {
  const { locale } = useLocale()
  return computed(() => settings[locale.value])
}
