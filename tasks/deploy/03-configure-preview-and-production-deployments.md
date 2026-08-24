# DEP-03: Configure Preview and Production Deployments

**Status:** Planned  
**Depends on:** DEP-01, DEP-02

## Objective

Deploy every reviewable change to an isolated preview and deploy the protected branch predictably to production.

## Deliverables

- GitHub-connected preview deployment for pull requests.
- Production deployment from the protected default branch.
- Separate preview and production environment configuration.
- Deployment status reported back to GitHub.
- Rollback procedure using provider-supported immutable or previous deployments.

## Acceptance criteria

- Preview deployments cannot use production-only secrets or submit real leads unintentionally.
- Production deploys only after required CI checks pass.
- Direct route loads work for localized and dynamic content pages.
- A failed deployment leaves the last healthy production version available.
- Rollback steps are documented and tested once.

