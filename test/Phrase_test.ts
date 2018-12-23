import { Phrase } from '../src/Phrase'
import { expect } from './common'

describe(`Phrase`, () => {
  describe(`Combination`, () => {
    it(`should make valid combinations`, () => {
      const p = new Phrase(`Han Solo`)
      const results = p.generateCombinations()
      expect(results)
        .to.include(`Holo San`).and
        .to.include(`Ho Solan`)
    })
  })
})