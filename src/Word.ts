import * as Debug from 'debug'
import { times } from 'ramda'

import { Chunk, ChunkPair, Side } from './Chunk'
import { Either, Failure, Possible } from './types'

/**
 * A function to be run on each of the available splits for a Word. Receives the
 * position that the Word was split on and the pair of Chunks that resulted.
 */
export type WordIterator = (chunks: ChunkPair, position: number) => void

export enum WordError {
  /** A split position was provided that result in an empty Chunk. */
  INVALID_SPLIT_POSITION,
  /** Since Words can be instantiated without text, the split can fail. */
  NO_TEXT,
  /** The two Chunks for a join can't accept on the same side. */
  JOIN_SIDE_MISMATCH,
}

/**
 * A Word can be split into two Chunks both of which can be exchanges with other
 * Words to form new ones.
 */
export class Word {
  constructor(
    /**
     * The full contents of the word
     *
     * This can be omitted if this Word is going to be constructed from joined
     * Chunks.
     */
    public text?: string,
  ) { }

  /** Split this Word into two Chunks. */
  split(position: number): Either<ChunkPair, WordError> {
    if (!this.text)
      return new Failure(WordError.NO_TEXT, `Word has no text. Can't split.`)

    if (position === 0 || position === this.text.length)
      return new Failure(WordError.INVALID_SPLIT_POSITION, `${position} position results in empty chunk. Can't split.`)

    const head = this.text.slice(0, position)
    const tail = this.text.slice(position, this.text.length)

    return [new Chunk(head, Side.TRAILING), new Chunk(tail, Side.LEADING)]
  }

  /** Join two Chunks into one Word. */
  join(a: Chunk, b: Chunk): Possible<WordError> {
    if (a.leading && b.leading)
      return new Failure(WordError.JOIN_SIDE_MISMATCH, `The two chunks are leading. Can't join.`)

    if (a.trailing && b.trailing)
      return new Failure(WordError.JOIN_SIDE_MISMATCH, `The two chunks are trailing. Can't join.`)

    this.text = a.trailing && b.leading ? `${a.text}${b.text}` : `${b.text}${a.text}`
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
   */
  getSplitPoints(): Either<number[], WordError> {
    if (!this.text)
      return new Failure(WordError.NO_TEXT, `Word has no text. Can't get split points.`)

    return times(i => i + 1, this.text.length - 1)
  }

  /**
   * Loop over each of the possible splits of this Word, running a lambda for
   * each one.
   */
  iterate(lambda: WordIterator): Possible<WordError> {
    const points = this.getSplitPoints()
    if (points instanceof Error)
      return new Failure(WordError.NO_TEXT, `Word has no text. Can't iterate.`)

    for (const position of points) {
      const split = this.split(position)
      if (split instanceof Error) continue
      lambda(split, position)
    }
  }
}