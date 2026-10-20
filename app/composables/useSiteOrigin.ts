import { getSiteOrigin } from '~~/shared/site'

/** Nuxt may override runtime config from an environment value; every public URL uses the normalized origin. */
export function useSiteOrigin() {
  return getSiteOrigin(useRuntimeConfig().public.siteUrl)
}
