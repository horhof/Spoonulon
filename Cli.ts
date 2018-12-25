/**
 * Generate the combinations for a two-word phrase separated by a space.
 *
 * Usage:
 *
 *     $ ts-node Cli "Han Solo"
 *     Holo San
 *     Hlo Soan
 *     Ho Solan
 *     Haolo Sn
 *     Halo Son
 *     Hao Soln
 */

import { Phrase } from './src/Phrase'

/** Isolate arg from arguments ['node', 'Cli', arg]. */
const arg = process.argv[2]
const p = new Phrase(arg)
const results = p.generate()
for (const result of results) console.log(result)