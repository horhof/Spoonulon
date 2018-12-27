import { Failure } from './Failure'

/**
 * An Either is a return value from a function that can either succeed and
 * return a value or fail and return an error code.
 *
 * The value is of type T and the error code is of type C within a Failure.
 *
 * Version 1.0.0
 */
export type Either<T, C> = T | Failure<C>