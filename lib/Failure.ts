/**
 * A Failure is a custom Error object that has an enum error code.
 *
 * The error code is mandatory and should be an enum of type T. If the message
 * is omitted, a generic (e.g. "Error code 1") will be used.
 *
 * Version 1.0.0
 */
export class Failure<T> extends Error {
  constructor(readonly code: T, message?: string) {
    super(message || `Error code ${code}`)
  }
}