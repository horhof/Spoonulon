import { Name } from '../src/Name'
import { expect, log } from './common'

describe(`Names`, () => {
  it(`should split with a normal number`, () => {
    const n = new Name(`Andrew`)
    const [a, b] = n.split(1)
    expect([a.text, b.text]).to.eql([`A`, `ndrew`])
  })
})