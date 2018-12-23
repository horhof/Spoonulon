import { capitalize } from 'lodash'

import { Blacklist } from './Blacklist'
import { Word } from './Word'

/**
 * A Phrase is a pair of Words separated by a space that can generate many
 * combinations o the two Words split in various ways.
 */
export class Phrase {
  readonly head: Word

  readonly tail: Word

  constructor(phrase: string) {
    const [head, tail] = phrase.split(' ')
    this.head = new Word(head)
    this.tail = new Word(tail)
  }

  generateCombinations() {
    const w = new Word()
    const results: string[] = []

    this.head.iterate(([a1, a2]) => {
      return this.tail.iterate(([b1, b2]) => {
        const firstResult = w.join(a1, b2)
        const first = w.text
        const secondResult = w.join(a2, b1)
        const second = w.text
        if (firstResult instanceof Error || secondResult instanceof Error) return
        if (!first || !second) return
        for (const pattern of Blacklist) if (pattern.test(first) || pattern.test(second)) return
        results.push(`${capitalize(first)} ${capitalize(second)}`)
      })
    })

    return results
  }
}