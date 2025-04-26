export class ResourceNotFoundEror extends Error {
  constructor() {
    super('Resource not found.')
  }
}