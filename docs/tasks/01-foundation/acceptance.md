# Acceptance criteria

- Primary navigation, project cards and articles open real pages; direct reload works.
- Compare all four MagicPath screens at the supplied mobile **402×874**, tablet **1133×744** and browser **1440×1024** sizes. Also check 375 and 320 px for reflow. Mobile uses the reference's bottom navigation; desktop-derived assumptions are insufficient.
- Use native links, buttons and labels, meaningful accessible names and control titles, skip navigation, visible focus, semantic landmarks and one h1. Fixed navigation must not obscure content or focused controls.
- Keyboard navigation and focus remain predictable. Locale switching preserves the equivalent page; theme preference survives reload without hydration mismatch. Client-only controls stay disabled until their handlers are ready.
- Main copy and navigation remain available without JavaScript.
- Blog pagination covers 0, 1, 10, 11, 20 and 21 records, boundaries, duplicates, draft/future exclusion and invalid-URL 404s. All topics must include every published category and work after navigation from Home.
- External HTTP(S) resources open in a new tab with `noopener noreferrer`. Internal routes, anchors and email actions retain their native behavior.
- `/admin/` is reachable and configured for the actual repository and content. Builds contain no secrets. Do not equate a working login screen with an authenticated GitHub write; the owner performs the first personal-token sign-in.
- Check title, description, canonical, OG image dimensions, hreflang and valid JSON-LD. Sitemap/RSS exclude drafts, admin, 404s and duplicates.
- Unit tests cover pagination and unsafe inputs. Browser tests cover navigation, reading, cases, mobile navigation, locale/theme, 404s and hydration. Axe covers the main templates in both themes; automated checks do not establish full WCAG certification.
- GitHub CI succeeds; a semver release and archive exist; production is publicly accessible over HTTPS without login. The final launch uses **anu3ev.com** after remaining site changes and DNS/HTTPS verification.
- Do not publish secrets, entire private notes, private employer code or invented metrics.
- Task summaries report actual pass/fail/skip counts, verification limits, commit/PR references and the published result.
