import { Chunk, LetterType, Side } from '../src/Chunk'
import { expect } from './common'

describe(`Chunk`, () => {
  describe(`Edges`, () => {
    it(`should recognize a trailing consonant`, () => {
      const c = new Chunk(`Ho`, Side.TRAILING)
      expect(c.accepts).to.equal(LetterType.CONSONANT)
    })

    it(`should recognize a trailing vowel`, () => {
      const c = new Chunk(`Hof`, Side.TRAILING)
      expect(c.accepts).to.equal(LetterType.VOWEL)
    })

    it(`should recognize a leading consonant`, () => {
      const c = new Chunk(`ho`, Side.LEADING)
      expect(c.accepts).to.equal(LetterType.VOWEL)
    })

    it(`should recognize a leading vowel`, () => {
      const c = new Chunk(`of`, Side.LEADING)
      expect(c.accepts).to.equal(LetterType.CONSONANT)
    })
  })

  describe(`Pairs`, () => {
    it(`should recognize Chunks that accept the same thing`, () => {
      const a = new Chunk(`Hof`, Side.TRAILING)
      const b = new Chunk(`Hor`, Side.TRAILING)
      expect(a.accepts).to.equal(b.accepts)
    })

    it(`should recognize Chunks that don't accept the same thing`, () => {
      const a = new Chunk(`Hofu`, Side.TRAILING)
      const b = new Chunk(`Hor`, Side.TRAILING)
      expect(a.accepts).to.not.equal(b.accepts)
    })
  })
})