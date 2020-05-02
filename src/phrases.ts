const PHRASE_SEP = ' '

const generatePair =
  (input: string): Error | string[] => {
    const text = input.split(PHRASE_SEP)
    const inputWordA = createWord(text[0])
    const inputWordB = createWord(text[1])

    const results: string[] = []

    forEachWordSplit(inputWordA, ([aLeft, aRight]) => {
      forEachWordSplit(inputWordB, ([bLeft, bRight]) => {
        const wordA = joinChunks(aLeft, bRight)
        if (wordA instanceof Error) {
          // $(`New A was an error: %o`, newA.message)
          return
        }

        const wordB = joinChunks(bLeft, aRight)
        if (wordB instanceof Error) {
          // $(`New B was an error: %o`, newB.message)
          return
        }

        if (wordA.text === inputWordA.text || wordA.text === inputWordB.text) {
          console.error(`Same as inputs.`)
          return
        }

        const result = `${wordA.text}${PHRASE_SEP}${wordB.text}`

        if (results.includes(result)) {
          // $(`Already included.`)
          return
        }

        // $(`Pushing %o...`, result)
        results.push(result)
      })
    })

    return results
  }
