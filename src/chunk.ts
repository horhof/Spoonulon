enum ChunkType {
  VOWEL = 'v',
  CONSONANT = 'c',
}

enum Side {
  LEADING = '<',
  TRAILING = '>',
}

/**
 * A Chunk is one of the pieces of a Word that has been split. Chunks either
 * open on the leading or trailing side and that side accepts either a vowel
 * or a consonant.
 */
interface Chunk {
  text: string
  side: Side
}

const createChunk =
  (text: string, side: Side) => ({
    text: text.toLowerCase(),
    side,
  })

const isLeadingChunk =
  (c: Chunk): boolean => c.side === Side.LEADING

const isTrailingChunk =
  (c: Chunk): boolean => c.side === Side.TRAILING

const getAcceptType =
  (c: Chunk): ChunkType => {
    if (isLeadingChunk(c)) {
      return /^[aeiouy]/i.test(c.text)
        ? ChunkType.CONSONANT
        : ChunkType.VOWEL
    } else {
      return /[aeiouy]$/i.test(c.text)
        ? ChunkType.CONSONANT
        : ChunkType.VOWEL
    }
  }

const getDonateType =
  (c: Chunk): ChunkType => {
    if (isLeadingChunk(c)) {
      return /^[aeiouy]/i.test(c.text)
        ? ChunkType.VOWEL
        : ChunkType.CONSONANT
    } else {
      return /[aeiouy]$/i.test(c.text)
        ? ChunkType.VOWEL
        : ChunkType.CONSONANT
    }
  }
