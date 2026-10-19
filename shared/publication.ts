/** Editorial dates follow the owner's timezone, independent of the build runner's local timezone. */
export function getPublicationDate(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Tbilisi', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now)
}
