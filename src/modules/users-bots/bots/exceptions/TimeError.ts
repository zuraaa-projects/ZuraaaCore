export default class TimeError extends Error {
  constructor (next: Date) {
    super()
    this.next = next
  }

  next: Date
}
