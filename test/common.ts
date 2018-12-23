import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import * as Debug from 'debug'

import { Failure } from '../src/types'

chai.use(chaiAsPromised)
export const expect = chai.expect
export const log = Debug('Spoonulon:Test')

/**
 * Expect the result to be a Failure with the specific code. Throw an exception
 * if the result wasn't an Error or if the code wasn't the expected value.
 */
export function expectFailure(result: any, code: number) {
  if (!(result instanceof Error)) throw new Error(`Result should have been an Error`)
  expect((result as Failure<any>).code).to.equal(code)
}