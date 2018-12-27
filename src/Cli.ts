/**
 * Generate the combinations for a two-word phrase separated by a space.
 *
 * Usage:
 *
 *     $ ts-node cli "Han Solo"
 *     Holo San
 *     Ho Solan
 *     Halo Son
 */

import { Phrase } from './Phrase'

/** Isolate arg from arguments ['node', 'cli', arg]. */
const arg = process.argv[2]
const p = new Phrase()
const results = p.generate(arg)
if (results instanceof Error) {
  console.error(`Error: "${arg}" is an invalid phrase.`)
  process.exit(1)
}
else {
  if (results.length === 0) {
    console.error(`Error: "${arg}" has no available results.`)
    process.exit(1)
  }
  for (const result of results) console.log(result)
}