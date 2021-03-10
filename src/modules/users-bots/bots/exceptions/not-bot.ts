export class NotBot extends Error {
  constructor (message: string) {
    super()
    this.message = message
  }
}
