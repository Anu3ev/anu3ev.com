/** The grammatical forms of the positioning title. They all live in content/settings/profile.json, the only place to change it. */
interface PositioningForms {
  headline_en: string
  headline_ru: string
  headline_sentence_en: string
  headline_genitive_ru: string
}

/**
 * Replaces `{{headline_en}}`-style placeholders in editorial copy with the forms from the profile.
 * A placeholder with no matching form throws, so a typo fails the build instead of reaching the page.
 */
export function applyPositioning<Settings>({ settings, profile }: { settings: Settings, profile: PositioningForms }): Settings {
  const forms = new Map(Object.entries({
    headline_en: profile.headline_en,
    headline_ru: profile.headline_ru,
    headline_sentence_en: profile.headline_sentence_en,
    headline_genitive_ru: profile.headline_genitive_ru
  }))
  const resolved = JSON.stringify(settings).replace(/\{\{(\w+)\}\}/g, (placeholder, name: string) => {
    const form = forms.get(name)
    if (!form) throw new Error(`Unknown positioning placeholder ${placeholder}`)

    return JSON.stringify(form).slice(1, -1)
  })

  return JSON.parse(resolved)
}

/**
 * The social card for pages without their own image. Telegram and other link previews cache an image by its URL,
 * so the file is named after the title: a new title gets a new URL. `pnpm social-image` creates the file.
 */
export function defaultSocialImagePath(headline: string) {
  return `/images/og/${headline.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.png`
}
