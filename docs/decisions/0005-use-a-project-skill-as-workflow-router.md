# 0005: Use a Project Skill as the Workflow Router

**Status:** Accepted

**Date:** 2026-08-24

## Context

anu3ev.com spans product discovery, verified professional evidence, bilingual content, Figma design-system work, Nuxt implementation, lead collection, SEO, and deployment. Relying on conversation history would make future work inconsistent, while copying all project knowledge into one skill would duplicate maintained documentation and consume unnecessary context.

## Decision

- Maintain anu3ev-project as an automatically discoverable Codex skill.
- Keep its canonical source under D:\documents\Obsidian\Notes\AI Models and Agents\skills\anu3ev-project.
- Keep a synchronized runtime copy under C:\Users\maggi\.codex\skills\anu3ev-project.
- Use the skill as a short workflow router to repository docs, tasks, specialized skills, and three mode-specific references.
- Keep current product facts in docs/product and durable choices in docs/decisions rather than duplicating them throughout the skill.
- Use tailor-alexander-resume for professional truth constraints and linkedin-writer for Alexander's public voice.

## Consequences

- Future sessions can recover the project workflow without relying on chat history.
- Updating a project fact usually changes docs/product, not SKILL.md.
- Updating the skill requires Notes/Codex synchronization and parity verification.
- The skill does not authorize unrelated external writes, deployments, messages, or Figma changes.

## Related documents

- [Documentation index](../README.md)
- [Task index](../../tasks/README.md)

Skill source: D:\documents\Obsidian\Notes\AI Models and Agents\skills\anu3ev-project\SKILL.md

Runtime copy: C:\Users\maggi\.codex\skills\anu3ev-project\SKILL.md
