import { Phrase } from '../src/Phrase'
import { expect } from './common'

describe(`Phrase`, () => {
  describe(`Combination`, () => {
    it(`should make valid combinations`, () => {
      const p = new Phrase(`Han Solo`)
      const results = p.generate()
      expect(results).to.eql([
        `Holo San`,
        `Ho Solan`,
        `Halo Son`,
      ])
    })
  })
})