import { Phrase } from './Phrase'
import * as Debug from 'debug'

const debug = Debug('Spoonulon:Editor')

export class Editor {
  input = ``

  output: string[] | undefined

  haveResults = false

  valid = false

  phrase = new Phrase()

  constructor($location: any) {
    const phrase = $location.hash()
    if (phrase) {
      this.input = phrase
      this.update()
    }
  }

  update() {
    debug(`Update>`)
    const results = this.phrase.generate(this.input)
    if (results instanceof Error) {
      this.valid = false
      this.output = undefined
    }
    else {
      this.valid = true
      this.output = results
      this.haveResults = results.length > 0
    }
  }
}