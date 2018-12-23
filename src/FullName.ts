import { Name } from './Name'

export class FullName {
  readonly first: Name

  readonly last: Name

  get reverse() {
    return `${this.last.head}${this.first.tail} ${this.first.head}${this.last.tail}`
  }

  constructor(name: string) {
    const [first, last] = name.split(' ')
    this.first = new Name(first)
    this.last = new Name(last)
  }
}