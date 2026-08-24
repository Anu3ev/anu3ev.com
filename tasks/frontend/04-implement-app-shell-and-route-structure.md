# FE-04: Implement the App Shell and Route Structure

**Status:** Planned  
**Depends on:** FE-02, CMP-04

## Objective

Create the shared semantic page shell, layouts, route boundaries, navigation, and global error experience.

## Deliverables

- Default layout with skip link, header, main landmark, and footer.
- Route structure for Home, Work, Case Study, Writing, Article, About, Contact, Privacy, and 404.
- Locale-aware internal navigation.
- Mobile navigation and theme/language controls.
- Global loading and error boundaries where Nuxt requires them.

## Acceptance criteria

- Every route renders directly through SSR and client navigation.
- Landmark order and heading structure are meaningful.
- Navigation works with keyboard, pointer, and touch input.
- Locale and theme controls remain available at every supported viewport.
- The 404 page provides localized recovery links.

