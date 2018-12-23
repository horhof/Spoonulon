import { Chunk, Side } from '../src/Chunk'
import { Word, WordError } from '../src/Word'
import { expect, expectFailure } from './common'

describe(`Word`, () => {
  describe(`Splitting`, () => {
    it(`should split text into chunks`, () => {
      const n = new Word(`Andrew`)
      {
        const result = n.split(1)
        if (result instanceof Error) throw result
        const [a, b] = result
        expect([a.text, b.text]).to.eql([`A`, `ndrew`])
      }
      {
        const result = n.split(3)
        if (result instanceof Error) throw result
        const [a, b] = result
        expect([a.text, b.text]).to.eql([`And`, `rew`])
      }
    })

    it(`should yield chunks which accept trailing / leading chunks`, () => {
      const n = new Word(`Andrew`)
      const result = n.split(1)
      if (result instanceof Error) throw result
      const [a, b] = result
      expect([a.trailing, b.leading]).to.eql([true, true])
    })

    it(`should NOT split on a 0 position`, () => {
      const n = new Word(`Andrew`)
      const result = n.split(0)
      expectFailure(result, WordError.INVALID_SPLIT_POSITION)
    })

    it(`should NOT split on the last position`, () => {
      const n = new Word(`Bob`)
      const result = n.split(3)
      expectFailure(result, WordError.INVALID_SPLIT_POSITION)
    })
  })

  describe(`Joining chunks`, () => {
    it(`should join a trailing + leading (Ho- -po)`, () => {
      const a = new Chunk(`Ho`, Side.TRAILING)
      const b = new Chunk(`po`, Side.LEADING)
      expectJoinSuccess(a, b, `Hopo`)
    })

    it(`should join a leading + trailing (-ho Po-)`, () => {
      const a = new Chunk(`ho`, Side.LEADING)
      const b = new Chunk(`Po`, Side.TRAILING)
      expectJoinSuccess(a, b, `Poho`)
    })

    it(`should NOT join a leading + leading (-ho -po)`, () => {
      const a = new Chunk(`ho`, Side.LEADING)
      const b = new Chunk(`po`, Side.LEADING)
      expectJoinFailure(a, b, WordError.JOIN_SIDE_MISMATCH)
    })

    it(`should NOT join a trailing + trailing (Ho- Po-)`, () => {
      const a = new Chunk(`Ho`, Side.TRAILING)
      const b = new Chunk(`Po`, Side.TRAILING)
      expectJoinFailure(a, b, WordError.JOIN_SIDE_MISMATCH)
    })

    it(`should NOT join vowel + vowel (Ho- -utenho)`, () => {
      const a = new Chunk(`Ho`, Side.TRAILING)
      const b = new Chunk(`utenho`, Side.LEADING)
      expectJoinSuccess(a, b, `Houtenho`)
    })

    it(`should join consonant + consonant (Hof- -tenho)`, () => {
      const a = new Chunk(`Hof`, Side.TRAILING)
      const b = new Chunk(`tenho`, Side.LEADING)
      expectJoinSuccess(a, b, `Hoftenho`)
    })

    it(`should join vowel + consonant (Ho- -futenho)`, () => {
      const a = new Chunk(`Ho`, Side.TRAILING)
      const b = new Chunk(`futenho`, Side.LEADING)
      expectJoinSuccess(a, b, `Hofutenho`)
    })

    it(`should join consonant + vowel (Hof- -unabu)`, () => {
      const a = new Chunk(`Hof`, Side.TRAILING)
      const b = new Chunk(`unabu`, Side.LEADING)
      expectJoinSuccess(a, b, `Hofunabu`)
    })
  })

  describe(`Iteration`, () => {
    it(`should count the right number of available split points`, () => {
      const c = new Word(`Hofu`)
      expect(c.getSplitPoints()).to.eql([1, 2, 3])
    })
  })
})

function expectJoinSuccess(a: Chunk, b: Chunk, text: string) {
  const n = new Word()
  const result = n.join(a, b)
  if (result instanceof Error) throw result
  expect(n.text).to.equal(text)
}

function expectJoinFailure(a: Chunk, b: Chunk, code: number) {
  const n = new Word()
  const result = n.join(a, b)
  expectFailure(result, code)
}