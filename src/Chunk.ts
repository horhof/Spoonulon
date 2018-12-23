/** A Chunk pair is an arrangement of Chunks that can be joined into a Word. */
export type ChunkPair = [Chunk, Chunk]

export enum LetterType {
  VOWEL,
  CONSONANT,
}

export enum Side {
  LEADING,
  TRAILING,
}

/**
 * A Chunk is one of the pieces of a Word that has been split. Chunks either
 * open on the leading or trailing side and that side accepts either a vowel
 * or a consonant.
 */
export class Chunk {
  get leading() { return this.side === Side.LEADING }

  get trailing() { return this.side === Side.TRAILING }

  get accepts() {
    if (this.leading) return /^[aeiou]/.test(this.text) ? LetterType.CONSONANT : LetterType.VOWEL
    else return /[aeiou]$/.test(this.text) ? LetterType.CONSONANT : LetterType.VOWEL
  }

  get donates() {
    if (this.leading) return /^[aeiou]/.test(this.text) ? LetterType.VOWEL : LetterType.CONSONANT
    else return /[aeiou]$/.test(this.text) ? LetterType.VOWEL : LetterType.CONSONANT
  }

  get acceptsVowel() { return this.accepts === LetterType.VOWEL }

  get acceptsConsonant() { return this.accepts === LetterType.CONSONANT }

  get donatesVowel() { return this.donates === LetterType.VOWEL }

  get donatesConsonant() { return this.donates === LetterType.CONSONANT }

  constructor(
    readonly text: string,
    /**
     * A Chunk whose side is marked as trailing will another chunk after it and
     * vice versa.
     */
    readonly side: Side,
  ) { }
}