# 20 — Profile photo instead of the "aa" avatar

The text "aa" avatar on Home, in the profile sidebar and on project cards is replaced by a real photo.

**Choice.** Candidates were searched in the owner's Documents, Pictures and Obsidian vault. The chosen source (1254 × 1254, `~/Documents/f6d07bc6-….png`) is a sharp head-and-shoulders shot with natural colour, soft light and a plain wall. It is the same picture as the LinkedIn photo (`edited_image.jpg`, with the #OpenToBuild ring), so recruiters see one consistent face. The alternatives were a colour-graded copy of the same shot (greyer skin) and the previous About portrait (lower resolution, serious expression).

**Assets.** `alexander-avatar.webp` is a 256 px square face crop (6 KB) for the 34–86 px avatars. `alexander.webp`, the About and article-author portrait, is replaced by a looser 720 px crop of the same photo (27 KB) for consistency.

**Model.** `avatar` is a new profile field next to `photo`: the Zod schema, the content validation (it must be an existing public image), the Sveltia CMS profile form, and `profile.json`. Components read `profile.avatar`. The avatars stay decorative (`aria-hidden`, empty `alt`) because the name is next to each one. The home avatar keeps its status dot; the image is rounded inside the 6 px ring instead of clipping the frame. The home `Person` JSON-LD now includes `image`.

**Checks.** The settings e2e test asserts that every avatar uses the CMS value and has loaded, and that `Person.image` points to the profile photo. The inventory unit test rejects a missing avatar. The CMS console check caught an unquoted comma in the new field's YAML hint, which is now fixed. `pnpm check` (51 unit tests), `pnpm build` and 69/69 browser/axe checks pass. Screenshots: [dark 1440](screenshots/av-dark-1440.png), [light 402](screenshots/av-light-402.png).
