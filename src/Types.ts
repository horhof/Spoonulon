/**
 * A failure is a normal Error except it takes a code (which is an enum of type
 * T) that describes the specific failure. The message is the secondary piece
 * of data and a generic message ("Error code 1") will be used if omitted.
 */
export class Failure<T> extends Error {
  constructor(
    readonly code: T,
    message?: string
  ) {
    super(message || `Error code ${code}`)
  }
}

/**
 * An Either is either a valid data value of type T or a Failure with an error
 * code of type C.
 */
export type Either<T, C> = T | Failure<C>

/**
 * A Possible is either a Failure with an error code of type T or a void return
 * because the operation was a success.
 */
export type Possible<T> = Failure<T> | void