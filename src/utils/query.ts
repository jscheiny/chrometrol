import { each, chain, maxBy } from "lodash";

export interface QueryRange {
    start: number;
    length: number;
}

export interface QueryMatches {
    score: number,
    ranges: QueryRange[];
}

function getPossibleIndices(haystack: string, needle: string, haystackIndex: number, needleIndex: number): number[][] {
    if (needleIndex === needle.length) {
        return [[]];
    } else if (haystackIndex === haystack.length) {
        return [];
    }

    let results: number[][] = [];
    for (let index = haystackIndex; index < haystack.length; index++) {
        if (haystack[index] === needle[needleIndex]) {
            each(getPossibleIndices(haystack, needle, index + 1, needleIndex + 1), subindices => {
                results.push([index, ...subindices]);
            });
        }
    }
    return results;
}

function makeRanges(indices: number[]): QueryRange[] {
    let result = chain(indices)
        .tail()
        .concat(Infinity)
        .zip(indices)
        .map(([first, second]) => [second, first])
        .filter(([first, second]) => first !== second - 1)
        .flatten()
        .initial()
        .value();
    result.unshift(indices[0]);
    return chain(result)
        .chunk(2)
        .map(([start, end]: [number, number]) => {
            return { start, length: end - start + 1 };
        })
        .value();
}

function scoreRanges(ranges: QueryRange[]): number {
    return chain(ranges)
        .map(({start, length}) => length * length / Math.log(5 + start))
        .sum()
        .value();
}

function allQueryResults(needle: string, haystack: string): QueryMatches[] {
    return getPossibleIndices(haystack, needle, 0, 0).map(indices => {
        let ranges = makeRanges(indices);
        let score = scoreRanges(ranges);
        return { score, ranges };
    });
}

export function findMatches(needle: string, haystack: string): QueryMatches {
    if (needle.length === 0) {
        return {
            ranges: [],
            score: 0
        };
    }
    return maxBy(allQueryResults(needle, haystack), result => result.score);
}
