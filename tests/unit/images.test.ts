import { describe, expect, it } from 'vitest'
import { PROJECT_IMAGE_WIDTHS, projectImagePath } from '../../shared/images'

describe('responsive image asset contract', () => {
  it('keeps mobile widths small and separates the generated assets of both languages', () => {
    expect(PROJECT_IMAGE_WIDTHS).toEqual([640, 960, 1200])
    expect(projectImagePath({ locale: 'en', slug: 'image-editor', width: 640 })).toBe('/images/responsive/en/image-editor-640.webp')
    expect(projectImagePath({ locale: 'ru', slug: 'image-editor', width: 1200 })).toBe('/images/responsive/ru/image-editor-1200.webp')
  })
})
