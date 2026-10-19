/** Responsive widths cover the 720px feed and common mobile/retina slots without an image service. */
export const PROJECT_IMAGE_WIDTHS = [640, 960, 1200] as const

/** Shared asset names keep build output and native HTML srcset consistent across both locales. */
export function projectImagePath({ locale, slug, width }: { locale: 'en' | 'ru', slug: string, width: typeof PROJECT_IMAGE_WIDTHS[number] }) {
  return `/images/responsive/${locale}/${slug}-${width}.webp`
}
