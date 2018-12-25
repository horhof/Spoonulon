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
        expect([a.text, b.text]).to.eql([`a`, `ndrew`])
      }
      {
        const result = n.split(3)
        if (result instanceof Error) throw result
        const [a, b] = result
        expect([a.text, b.text]).to.eql([`and`, `rew`])
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
      expectJoinSuccess(a, b, `hopo`)
    })

    it(`should join a leading + trailing (-ho Po-)`, () => {
      const a = new Chunk(`ho`, Side.LEADING)
      const b = new Chunk(`Po`, Side.TRAILING)
      expectJoinSuccess(a, b, `poho`)
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
      expectJoinFailure(a, b, WordError.JOIN_SIDE_MISMATCH)
    })

    it(`should NOT join consonant + consonant (Hof- -tenho)`, () => {
      const a = new Chunk(`Hof`, Side.TRAILING)
      const b = new Chunk(`tenho`, Side.LEADING)
      expectJoinFailure(a, b, WordError.JOIN_SIDE_MISMATCH)
    })

    it(`should join vowel + consonant (Ho- -futenho)`, () => {
      const a = new Chunk(`Ho`, Side.TRAILING)
      const b = new Chunk(`futenho`, Side.LEADING)
      expectJoinSuccess(a, b, `hofutenho`)
    })

    it(`should join consonant + vowel (Hof- -unabu)`, () => {
      const a = new Chunk(`Hof`, Side.TRAILING)
      const b = new Chunk(`unabu`, Side.LEADING)
      expectJoinSuccess(a, b, `hofunabu`)
    })
  })

  describe(`Iteration / split points`, () => {
    it(`should count the right number of available split points`, () => {
      // Aaron can be split:
      // A, aron - Invalid
      // Aa, ron
      // Aar, on
      // Aaro, n
      const c = new Word(`Aaron`)
      expect(c.getSplitPoints()).to.eql([2, 3, 4])
    })

    it(`should count the right number of available split points`, () => {
      const c = new Word(`Aaron`)
      const results: string[] = []
      c.iterate(([a, b]) => results.push(`${a.text}/${b.text}`))
      expect(results).to.eql([
        `aa/ron`,
        `aar/on`,
        `aaro/n`,
      ])
    })

    it(`should count the right number of available split points 2`, () => {
      const c = new Word(`Jackson`)
      const results: string[] = []
      c.iterate(([a, b]) => results.push(`${a.text}/${b.text}`))
      expect(results).to.eql([
        `j/ackson`,
        `ja/ckson`,
        `jacks/on`,
        `jackso/n`,
      ])
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