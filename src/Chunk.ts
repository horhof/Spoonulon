export enum Accept {
  VOWEL,
  CONSONANT,
}

export enum Side {
  LEADING,
  TRAILING,
}

/**
 * A chunk is one of the pieces of a name that has been split. Chunks either
 * open on the leading or trailing side and that side accepts either a vowel
 * or a consonant.
 */
export class Chunk {
  readonly accepts: Accept

  constructor(
    readonly text: string,
    readonly side: Side,
  ) {
    if (this.side === Side.LEADING)
      this.accepts = /^[aeiou]/.test(this.text)
        ? Accept.VOWEL
        : Accept.CONSONANT
    else
      this.accepts = /[aeiou]$/.test(this.text)
        ? Accept.VOWEL
        : Accept.CONSONANT
  }
}