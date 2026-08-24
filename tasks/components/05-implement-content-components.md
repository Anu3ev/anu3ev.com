# CMP-05: Implement Content Components

**Status:** Planned  
**Depends on:** DES-08, CMP-02

## Objective

Implement reusable content components that express portfolio, article, and professional-history concepts directly.

## Deliverables

- ProjectCard, ArticleCard, Metric, ExperienceItem, SectionHeading, CTA, Breadcrumbs, and TableOfContents.
- Prose styles for articles and case studies, including code, quotes, lists, figures, and captions.
- Image and media containers with reserved aspect ratios and meaningful fallbacks.
- Typed content inputs that match approved content collections.

## Acceptance criteria

- Components use domain-readable names rather than generic layout wrappers.
- Long titles, tags, dates, and descriptions work in English and Russian.
- Optional media can be absent without leaving a broken layout.
- Article content remains readable at the approved line width and text scale.
- Cards remain operable and understandable with keyboard focus.

