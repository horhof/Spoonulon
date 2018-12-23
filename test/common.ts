import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import * as Debug from 'debug'

import { Failure } from '../src/Types'

chai.use(chaiAsPromised)
export const expect = chai.expect
export const log = Debug('Spoonulon:Test')

/** Expect the result to be a Failure with the specific code. */
export function expectFailure(result: any, code: number) {
  if (!(result instanceof Error)) throw new Error(`Result should have been an Error`)
  expect((result as Failure<any>).code).to.equal(code);
}