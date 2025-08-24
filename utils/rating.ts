import { Perfs, PerfType, Perf } from '../types/types';

const provisionalDeviation: number = 110;
const cluelessDeviation: number = 230;

const firstRow: PerfType[] = [
  PerfType.BULLET,
  PerfType.BLITZ,
  PerfType.RAPID,
  PerfType.CLASSICAL,
];

const secondRowPerfs: PerfType[] = [
  PerfType.CORRESPONDENCE,
  PerfType.ULTRABULLET,
  PerfType.CRAZYHOUSE,
  PerfType.CHESS960,
  PerfType.KING_OF_THE_HILL,
  PerfType.THREE_CHECK,
  PerfType.ANTICHESS,
  PerfType.ATOMIC,
  PerfType.HORDE,
  PerfType.RACING_KINGS,
];

const secondRow: Set<PerfType> = new Set<PerfType>(secondRowPerfs);

const totalTimeRoughEstimationMap: Partial<Record<PerfType, number>> = {
  [PerfType.ULTRABULLET]: 25 * 100,
  [PerfType.BULLET]: 90 * 100,
  [PerfType.BLITZ]: 7 * 60 * 100,
  [PerfType.RAPID]: 12 * 60 * 100,
  [PerfType.CLASSICAL]: 30 * 60 * 100,
  [PerfType.CORRESPONDENCE]: 60 * 60 * 100,
};

const getTotalTimeRoughEstimation = (perf: PerfType): number =>
  totalTimeRoughEstimationMap[perf] ?? 7 * 60 * 100;

export const getFirstRowPerfs = (perfs: Perfs): [PerfType, Perf][] =>
  firstRow.map((key) => {
    const perf = perfs[key]!;
    return [key, perf];
  });

export const getSecondRowPerfs = (
  perfs: Perfs,
  nb: number
): [PerfType, Perf][] => {
  const filteredPerfs = Object.entries(perfs)
    .filter(([key]) => {
      return secondRow.has(key as PerfType);
    })
    .sort(([keyA, perfA], [keyB, perfB]) => {
      const nbA = 'games' in perfA ? perfA.games : 0;
      const nbB = 'games' in perfB ? perfB.games : 0;
      const valA = -(nbA * getTotalTimeRoughEstimation(keyA as PerfType));
      const valB = -(nbB * getTotalTimeRoughEstimation(keyB as PerfType));
      return valA - valB;
    })
    .slice(0, nb);

  return padPerfs(filteredPerfs as [PerfType, Perf][], nb, secondRowPerfs);
};

export const getFormattedRatings = (
  perfs: [PerfType, Perf][]
): [PerfType, string][] =>
  perfs.map(([key, perf]) => {
    if (!perf.games) return [key, '&#160;&#160;&#160;-'];
    if (perf.rd >= cluelessDeviation) return [key, '&#160;&#160;&#160;?'];
    if (perf.rd >= provisionalDeviation) return [key, `${perf.rating}?`];
    return [key, `${perf.rating}`];
  });

const padPerfs = (
  result: [PerfType, Perf][],
  targetLength: number,
  availablePerfs: PerfType[]
): [PerfType, Perf][] => {
  const paddingNeeded = targetLength - result.length;
  if (paddingNeeded <= 0) return result;

  const existingTypes = new Set(result.map(([type]) => type));

  for (
    let i = 0;
    i < availablePerfs.length && result.length < targetLength;
    i++
  ) {
    const paddingType = availablePerfs[i];
    if (!existingTypes.has(paddingType)) {
      result.push([
        paddingType,
        {
          games: 0,
          rating: 1500,
          rd: 500,
          prog: 0,
          prov: true,
        },
      ]);
    }
  }

  return result;
};
