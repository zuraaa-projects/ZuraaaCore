export class NotBot extends Error {
  constructor (
    public bot: boolean,
    public id: string
  ) {
    super()
  }
}
