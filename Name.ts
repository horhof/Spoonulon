class Name {
  get head() { return this.split[0] }

  get tail() { return this.split[1] }

  get vowelStart() { return /^[aeiouy]/i.test(this.text) }

  private get split(): string[] {
    // If it starts with a vowel, match all the starting vowels together with
    // all the consonants that follow it.
    if (this.vowelStart) return this.text.match(/^([aeiouy]+[^aeiouy]+)(.+)/i).splice(1)
    // Else match all the consonants at the beginning.
    else return this.text.match(/^([^aeiouy]+)(.+)/i).splice(1)
  }

  constructor(
    private readonly text: string
  ) { }

  // A name has many different combinations of donate + accept.
  donate() {

  }
}

class FullName {
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

new FullName(`George Clooney`).reverse