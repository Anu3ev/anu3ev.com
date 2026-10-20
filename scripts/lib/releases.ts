interface ReleaseVersions {
  version: string
  previousVersion: string
}

/** Releases use stable semver only; equal versions are content updates and never retag an existing release. */
export function getReleaseTag({ version, previousVersion }: ReleaseVersions) {
  const stableVersion = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/
  if (stableVersion.exec(version)?.[0] !== version || stableVersion.exec(previousVersion)?.[0] !== previousVersion) {
    throw new Error('Release versions must use stable major.minor.patch without leading zeros')
  }
  if (version === previousVersion) return ''
  if (version.localeCompare(previousVersion, 'en', { numeric: true }) < 0) throw new Error('Release versions must increase')

  return `v${version}`
}
