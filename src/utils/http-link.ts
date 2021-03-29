export function httpLink (link: string): string | null {
  if (link == null) {
    return null
  } else {
    if (link.match(/^https?:\/\//) != null) {
      return link
    }

    return 'http://' + link
  }
}
