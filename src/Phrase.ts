import { capitalize } from 'lodash'

import { Either, Failure, Possible } from './types'
import { Word, WordError } from './Word'

const debug = require('debug')('Spoonulon:Phrase')

export enum PhraseError {
  INVALID_INPUT,
}

/**
 * A Phrase is a pair of Words separated by a space that can generate many
 * combinations of the two Words split in various ways.
 */
export class Phrase {
  static SEP = ` `

  readonly head!: Word

  readonly tail!: Word

  private valid: boolean

  constructor(phrase: string) {
    if (this.valid = /^\w+ \w+$/i.test(phrase)) {
      const [head, tail] = phrase.split(' ')
      this.head = new Word(head)
      this.tail = new Word(tail)
    }
  }

  /** Generate all valid combinations of the two Word Phrease. */
  generate(): Either<string[], PhraseError> {
    if (!this.valid) return new Failure(PhraseError.INVALID_INPUT)

    const a = new Word()
    const b = new Word()
    const results: string[] = []

    this.head.iterate(([head1, tail1]) => {
      this.tail.iterate(([head2, tail2]) => {
        // Join both words and if they couldn't be joined, continue to the next.
        let err: Possible<WordError>
        if (err = a.join(head1, tail2), err instanceof Error)
          return debug(`Generate> [%s, %s] has an error %s.`, head1.text, tail2.text, WordError[err.code])
        if (err = b.join(head2, tail1), err instanceof Error)
          return debug(`Generate> [%s, %s] has an error %s.`, head2.text, tail1.text, WordError[err.code])

        // If the swap results in a word that's the same as either of the two
        // original inputs, then nothing has changed and it can be skipped. If a
        // is the same as an input, then b has to be the same as well because
        // nothing was donated or accepted.
        if (a.text === this.head.text || a.text === this.tail.text)
          return debug(`Generate> "%s" is the same as one of the inputs. (%s, %s)`, a.text, this.head.text, this.tail.text)

        const result = `${capitalize(a.text)}${Phrase.SEP}${capitalize(b.text)}`

        // If the result has already been generated, skip it.
        if (results.includes(result))
          return debug(`Generate> "%s" was already generated.`, result)

        results.push(result)
      })
    })

    return results
  }
}