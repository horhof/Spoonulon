import { Failure } from './Failure'

/**
 * A Possible is the return value of a function that either succeeds and
 * returns void or fails and returns a Failure.
 *
 * Version 1.0.0
 */
export type Possible<T> = Failure<T> | void