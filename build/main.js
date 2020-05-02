var ChunkType;
(function (ChunkType) {
    ChunkType["VOWEL"] = "v";
    ChunkType["CONSONANT"] = "c";
})(ChunkType || (ChunkType = {}));
var Side;
(function (Side) {
    Side["LEADING"] = "<";
    Side["TRAILING"] = ">";
})(Side || (Side = {}));
const createChunk = (text, side) => ({
    text: text.toLowerCase(),
    side,
});
const isLeadingChunk = (c) => c.side === Side.LEADING;
const isTrailingChunk = (c) => c.side === Side.TRAILING;
const getAcceptType = (c) => {
    if (isLeadingChunk(c)) {
        return /^[aeiouy]/i.test(c.text)
            ? ChunkType.CONSONANT
            : ChunkType.VOWEL;
    }
    else {
        return /[aeiouy]$/i.test(c.text)
            ? ChunkType.CONSONANT
            : ChunkType.VOWEL;
    }
};
const getDonateType = (c) => {
    if (isLeadingChunk(c)) {
        return /^[aeiouy]/i.test(c.text)
            ? ChunkType.VOWEL
            : ChunkType.CONSONANT;
    }
    else {
        return /[aeiouy]$/i.test(c.text)
            ? ChunkType.VOWEL
            : ChunkType.CONSONANT;
    }
};
const WORD_SEP = ``;
const createWord = (text) => ({
    text: text.toLowerCase(),
});
const joinChunks = (a, b) => {
    if (isLeadingChunk(a) && isLeadingChunk(b)) {
        return new Error(`Can't join because the two chunks are leading`);
    }
    if (isTrailingChunk(a) && isTrailingChunk(b)) {
        return new Error(`Can't join because the two chunks are trailing`);
    }
    const head = isTrailingChunk(a) ? a : b;
    const tail = isTrailingChunk(a) ? b : a;
    if (getAcceptType(head) !== getDonateType(tail)) {
        return new Error(`Can't join because head chunk "${head.text}" doesn't accept what tail chunk "${tail.text}" donates`);
    }
    return createWord(`${head.text}${WORD_SEP}${tail.text}`);
};
/** Run a lambda for each of the valid splits of this Word. */
const forEachWordSplit = (w, lambda) => {
    const points = getSplitPoints(w);
    if (points instanceof Error) {
        return new Error(`Word has no text. Can't iterate.`);
    }
    for (const position of points) {
        const result = splitWord(w, position);
        if (result instanceof Error) {
            continue;
        }
        lambda(result, position);
    }
    return;
};
const splitWord = (w, index) => {
    if (!canSplitWord(w, index)) {
        return new Error(`Can't split because position ${index} position results in empty chunk`);
    }
    const { text } = w;
    const head = text.slice(0, index);
    const tail = text.slice(index, text.length);
    return [createChunk(head, Side.TRAILING), createChunk(tail, Side.LEADING)];
};
/**
 * A word has a set of valid split points which can't include the two ends
 * where the resulting chunks would be empty.
 */
const getSplitPoints = (w) => {
    const { text } = w;
    /** The final set of valid splitting points in this word. */
    const points = [];
    /** The last letter type so we can figure out when it's changed. */
    let last;
    // Loop through the letters in the text, saving a split point whenever it
    // changes from vowel to consonant or vice versa. The loop starts at index 0
    // so that the letter type can be saved.
    for (let index = 0; index < text.length; index++) {
        const letter = text[index];
        const vowel = /[aeiouy]/i.test(letter);
        const current = vowel ? ChunkType.VOWEL : ChunkType.CONSONANT;
        // If we have a last letter type to compare to, we've changed letter types
        // since then, and we're on a splittable index, then save the index.
        if (last && canSplitWord(w, index) && current !== last) {
            points.push(index);
        }
        last = current;
    }
    return points;
};
const canSplitWord = (w, index) => index >= 1 && index <= w.text.length;
const PHRASE_SEP = ' ';
const generatePair = (input) => {
    const text = input.split(PHRASE_SEP);
    const inputWordA = createWord(text[0]);
    const inputWordB = createWord(text[1]);
    const results = [];
    forEachWordSplit(inputWordA, ([aLeft, aRight]) => {
        forEachWordSplit(inputWordB, ([bLeft, bRight]) => {
            const wordA = joinChunks(aLeft, bRight);
            if (wordA instanceof Error) {
                // $(`New A was an error: %o`, newA.message)
                return;
            }
            const wordB = joinChunks(bLeft, aRight);
            if (wordB instanceof Error) {
                // $(`New B was an error: %o`, newB.message)
                return;
            }
            if (wordA.text === inputWordA.text || wordA.text === inputWordB.text) {
                console.error(`Same as inputs.`);
                return;
            }
            const result = `${wordA.text}${PHRASE_SEP}${wordB.text}`;
            if (results.includes(result)) {
                // $(`Already included.`)
                return;
            }
            // $(`Pushing %o...`, result)
            results.push(result);
        });
    });
    return results;
};
//# sourceMappingURL=main.js.map