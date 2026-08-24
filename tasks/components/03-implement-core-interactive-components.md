# CMP-03: Implement Core Interactive Components

**Status:** Planned  
**Depends on:** DES-06, CMP-02

## Objective

Implement the reusable interactive primitives defined by the design system without adding one-to-one wrappers that provide no contract.

## Deliverables

- Button, IconButton, Link, Badge, Avatar, and ThemeToggle.
- TextField, Textarea, Checkbox, and FormMessage.
- Typed props and events reflecting actual visual or behavioural variants.
- Default, hover, focus, pressed, disabled, loading, filled, error, and success states where applicable.
- Accessible names, semantic elements, keyboard behaviour, and reduced-motion handling.

## Acceptance criteria

- Every custom component owns meaningful behaviour, styling, or domain semantics.
- Vuetify components are used directly when a wrapper would only forward props.
- All variants use design tokens and support both themes.
- English and Russian labels do not overflow at approved content lengths.
- Component tests cover at least the default, keyboard-focus, disabled, and error-related contracts.

