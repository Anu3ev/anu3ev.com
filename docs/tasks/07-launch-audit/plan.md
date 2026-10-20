# 07 — Public release audit

Publish master `6541daa29fb14356337f354cb4e75751d19afc3f`, Release v1.0.1, using the already tested CI export rather than rebuilding after tests. Verify the GitHub artifact ZIP SHA256, inner tar digest against the Release asset and version/commit in `version.json`. Validate extraction paths and reject symlinks before unpacking.

The Sites source remote must have the same commit. Standard packaging adds only its hosting manifest; compare every public-file hash against the CI export. Save and deploy a version of the existing public Site. Credentials and signed references remain in memory and pass through hidden stdin.

Verify in a fresh guest session: full production browser/axe suite, direct canonical/sitemap URLs, version endpoint, CMS configuration, mobile Lighthouse and screenshot inspection. Record actual Release checks and external-account limits. Commit/push/merge reports as a separate task.
