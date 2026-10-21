import certificatesFile from '~~/content/settings/certificates.json'
import { certificatesSchema } from '~~/shared/content-schema'

/**
 * JSON imports widen enums to `string`, so the page reads certificates through their schema.
 * The build already rejects an invalid file; parsing here adds the typed defaults for optional fields.
 */
const { certificates } = certificatesSchema.parse(certificatesFile)

/** Certificates in display order, split the way the About page shows them. */
export function useCertificates() {
  return {
    certificates,
    featuredCertificates: certificates.filter(certificate => certificate.featured),
    otherCertificates: certificates.filter(certificate => !certificate.featured)
  }
}
