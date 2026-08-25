# DES-06: Build the Core Figma Component Library

**Status:** Design completed locally; Figma component synchronization blocked by Starter quota
**Depends on:** DES-04, DES-05

**Result:** Reusable component contracts and states are documented in the [design system](../../docs/design/design-system.md) and rendered on the [state board](../../docs/design/prototype/states.html).

## Objective

Build the minimum reusable component set required to validate the design on real screens.

## Deliverables

- Button, IconButton, Link, Badge, Avatar, ThemeToggle, and LanguageSwitcher.
- TextField, Textarea, Checkbox, and FormMessage.
- Header, NavigationItem, MobileMenu, and Footer.
- Default, hover, focus, pressed, disabled, loading, filled, error, and success states where meaningful.
- Auto Layout, component properties, token bindings, usage descriptions, and visual examples.
- Structural and visual validation for every component.

## Acceptance criteria

- Every component is required by the approved information architecture.
- Variant matrices contain no more than 30 combinations.
- Icons use instance swapping rather than icon-specific variants.
- No component contains unexplained hardcoded visual values.
- Both themes and both languages are represented in validation examples.
- Keyboard and focus behaviour is documented for interactive components.
