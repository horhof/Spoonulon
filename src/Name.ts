import * as Debug from 'debug'

import { Chunk, Side } from './Chunk'

const log = Debug(`Names:Name`)

/**
 * A name is a thing that can be split into two chunks, a head and a tail, both
 * of which cna be donated to another names.
 */
export class Name {
  /*
  private get split(): string[] {
    // If it starts with a vowel, match all the starting vowels together with
    // all the consonants that follow it.
    if (this.vowelStart) return this.text.match(/^([aeiouy]+[^aeiouy]+)(.+)/i).splice(1)
    // Else match all the consonants at the beginning.
    else return this.text.match(/^([^aeiouy]+)(.+)/i).splice(1)
  }
  */
  constructor(
    private readonly text: string,
  ) { }

  split(position: number) {
    log(`Split> Position=%o`, position)
    const head = this.text.slice(0, position)
    const tail = this.text.slice(position, this.text.length)
    log(`Split> Split=[%o, %o]`, head, tail)
    return [new Chunk(head, Side.TRAILING), new Chunk(tail, Side.LEADING)]
  }
}