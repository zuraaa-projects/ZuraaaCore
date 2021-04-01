export function httpLink (link: string): string | null {
  if (link == null) {
    return null
  } else {
    if (link.trim().match(/^https?:\/\//) != null) {
      return link
    }

    return 'http://' + link.trim()
  }
}
