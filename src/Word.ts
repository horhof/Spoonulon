import { inRange } from 'lodash'

import { Chunk, ChunkPair, LetterType, Side } from './Chunk'
import { Either, Failure, Possible } from './types'

const debug = require('debug')('Spoonulon:Word')

/**
 * A function to be run on each of the available splits for a Word. Receives the
 * position that the Word was split on and the pair of Chunks that resulted.
 */
export type WordIterator = (chunks: ChunkPair, index: number) => void

export enum WordError {
  /** A split position was provided that result in an empty Chunk. */
  INVALID_SPLIT_POSITION = 1,
  /** Since Words can be instantiated without text, the split can fail. */
  NO_TEXT,
  /** The two Chunks for a join can't accept on the same side. */
  JOIN_SIDE_MISMATCH,
}

/**
 * A Word can be split into two Chunks both of which can be exchanges with other
 * Words to form new ones.
 *
 * ## API
 * - Split: index / chunk pair or error
 * - Join: chunk, chunk / error*
 * - Get split points / points or error
 * - Iterate: {chunk pair, index} / error*
 */
export class Word {
  /** Optional separation character between chunks when joined. */
  static SEP = ``

  /**
   * The full contents of the word
   *
   * This can be omitted if this Word is going to be constructed from joined
   * Chunks.
   */
  text: string | undefined

  constructor(text?: string) {
    if (text) this.text = text.toLowerCase()
  }

  /**
   * Split this Word into two Chunks.
   *
   * Note that this interface permits splitting the Word in places which may be
   * invalid, such as index 0.
   *
   * @return A pair of chunks on success, otherwise NO_TEXT or
   * INVALID_SPLIT_POSITION errors.
   */
  split(index: number): Either<ChunkPair, WordError> {
    if (!this.text)
      return new Failure(WordError.NO_TEXT, `Word has no text. Can't split.`)

    if (!this.canSplit(index))
      return new Failure(WordError.INVALID_SPLIT_POSITION, `${index} position results in empty chunk. Can't split.`)

    const head = this.text.slice(0, index)
    const tail = this.text.slice(index, this.text.length)

    return [new Chunk(head, Side.TRAILING), new Chunk(tail, Side.LEADING)]
  }

  /**
   * Join two Chunks into one Word.
   *
   * @return Possible JOIN_SIDE_MISMATCH error if the chunks couldn't be joined.
   */
  join(a: Chunk, b: Chunk): Possible<WordError> {
    if (a.leading && b.leading) {
      const msg = `The two chunks are leading. Can't join.`
      debug(`Join> Error: ${msg}`)
      return new Failure(WordError.JOIN_SIDE_MISMATCH, msg)
    }

    if (a.trailing && b.trailing) {
      const msg = `The two chunks are trailing. Can't join.`
      debug(`Join> Error: ${msg}`)
      return new Failure(WordError.JOIN_SIDE_MISMATCH, msg)
    }

    let head: Chunk
    let tail: Chunk
    if (a.trailing) head = a, tail = b
    else head = b, tail = a

    if (head.accepts != tail.donates) {
      const msg = `Head chunk "${head.text}" doesn't accept what tail chunk "${tail.text}" donates (${LetterType[tail.donates]}).`
      debug(`Join> Error: ${msg}`)
      return new Failure(WordError.JOIN_SIDE_MISMATCH, msg)
    }

    this.text = `${head.text}${Word.SEP}${tail.text}`
  }

  /**
   * A Word has a set of valid split points which can't include the two ends
   * where the resulting Chunks would be empty.
   *
   *    new Word('Hofu').getSplitPoints()
   *    // => [1, 2, 3]
   *
   * The positions are:
   *
   * 0. [, Hofu] Invalid
   * 1. [H, ofu]
   * 2. [Ho, fu]
   * 3. [Hof, u]
   * 4. [Hofu, ] Invalid
   *
   * @return A set of indices or a NO_TEXT error if this Word wasn't
   * instantiated with text and it hasn't been joined yet.
   */
  getSplitPoints(): Either<number[], WordError> {
    if (!this.text)
      return new Failure(WordError.NO_TEXT, `Word has no text. Can't get split points.`)

    /** The final set of valid splitting points in this word. */
    const points: number[] = []
    /** The last letter type so we can figure out when it's changed. */
    let last: LetterType | undefined

    // Loop through the letters in the text, saving a split point whenever it
    // changes from vowel to consonant or vice versa. The loop starts at index 0
    // so that the letter type can be saved.
    for (let index = 0; index < this.text.length; index++)
      last = this.checkForSplit(this.text as string, index, points, last)

    return points
  }

  /** Run a lambda for each of the valid splits of this Word. */
  iterate(lambda: WordIterator): Possible<WordError> {
    const points = this.getSplitPoints()
    if (points instanceof Error)
      return new Failure(WordError.NO_TEXT, `Word has no text. Can't iterate.`)

    for (const position of points) {
      const result = this.split(position)
      if (!(result instanceof Error)) lambda(result, position)
    }
  }

  /**
   * Check if this index within the text is a valid split point and mutate the
   * given result set.
   *
   * @param results The final set of valid split points that is mutated.
   * @return The type of the letter that was just evaluated.
   */
  private checkForSplit(text: string, index: number, results: number[], last?: LetterType) {
    const letter = text[index];
    const vowel = /[aeiou]/i.test(letter)
    const current = vowel ? LetterType.VOWEL : LetterType.CONSONANT

    // If we have a last letter type to compare to, we've changed letter types
    // since then, and we're on a splittable index, then save the index.
    if (last && this.canSplit(index) && current !== last)
      results.push(index)

    return current
  }

  /**
   * Is this index a valid position in which to split the Word?
   *
   * Splitting on index 0 or the last index of the text woudl result in invalid
   * Chunks of zero length.
   */
  private canSplit(index: number) {
    if (!this.text) return false
    return inRange(index, 1, this.text.length)
  }
}