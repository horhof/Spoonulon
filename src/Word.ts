import { inRange } from 'lodash'
import { times } from 'ramda'

import { Chunk, ChunkPair, LetterType, Side } from './Chunk'
import { Either, Failure, Possible } from './types'

const debug = require('debug')('Spoonulon:Word')
const debugAllow = require('debug')('Spoonulon:Allow')
const debugReject = require('debug')('Spoonulon:Reject')

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

    if (!this.canJoin(head, tail)) {
      const msg = `Head chunk "${head.text}" doesn't accept what tail chunk "${tail.text}" donates (${LetterType[tail.donates]}).`
      debug(`Join> Error: ${msg}`)
      return new Failure(WordError.JOIN_SIDE_MISMATCH, msg)
    }

    // if (head.accepts != tail.donates) {
    //   const msg = `Head chunk "${head.text}" doesn't accept what tail chunk "${tail.text}" donates (${LetterType[tail.donates]}).`
    //   debug(`Join> Error: ${msg}`)
    //   return new Failure(WordError.JOIN_SIDE_MISMATCH, msg)
    // }

    this.text = `${head.text}${Word.SEP}${tail.text}`
    debug(`Join> Accepted: ${head.text}/${tail.text}`)
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

    return times(i => i + 1, this.text.length - 1)
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

  private canJoin(a: Chunk, b: Chunk): boolean {
    type PatternList = { [identifier: string]: RegExp }

    /** Assumes that a colon separates the two Chunks.  */
    const Whitelist: PatternList = {
      'V+C': /[aeiou]:[^aeiou]/,
      'C+V': /[^aeiou]:[aeiou]/,
      'Co+oC': /[^aeiou]o:o[^aeiou]/,
    }

    const Blacklist: PatternList = {
      'Initial w followed by non-r C': /^w:[^aeiour]/,
      'y preceded by [i]': /:?[i]:?y/,
      'r pair sparated by vowel': /r:?[aeiou]:?r/,
    }

    const combo = `${a.text}:${b.text}`

    let allow = false
    for (const key in Whitelist) {
      if (Whitelist[key].test(combo)) {
        debugAllow(`Can join> Allowing %o on pattern %o.`, combo, key)
        allow = true
        break
      }
    }
    for (const key in Blacklist) {
      if (Blacklist[key].test(combo)) {
        debugReject(`Can join> Rejecting %o on pattern %o.`, combo, key)
        allow = false
        break
      }
    }
    // if (allow) debugAllow(`Can join> Passing through %o.`, combo)
    return allow
  }

  /**
   * Is this index a valid position in which to split the Word?
   *
   * Splitting on index 0 or the last index of the text woudl result in invalid
   * Chunks of zero length.
   */
  private canSplit(index: number): boolean {
    if (!this.text) return false
    return inRange(index, 1, this.text.length)
  }
}