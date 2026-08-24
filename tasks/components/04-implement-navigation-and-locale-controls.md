# CMP-04: Implement Navigation and Locale Controls

**Status:** Planned  
**Depends on:** DES-06, CMP-02, FE-02

## Objective

Implement reusable site navigation that preserves route context across viewport, theme, and locale changes.

## Deliverables

- Header, NavigationItem, MobileMenu, Footer, and LanguageSwitcher.
- Text-based `EN` and `RU` locale controls with an accessible name and current-state indication.
- Route-aware active navigation states.
- Theme and locale controls for desktop and mobile navigation.
- Focus management for opening and closing the mobile menu.

## Acceptance criteria

- Language switching opens the translated equivalent of the current route.
- Current locale and active navigation are not indicated by colour alone.
- Mobile menu focus enters predictably and returns to its trigger when closed.
- Escape and keyboard navigation work where the interaction pattern requires them.
- No navigation label is truncated in either locale.
