import { components } from '@lichess-org/types';

export enum Theme {
    LIGHT = 'light',
    DARK = 'dark',
}

export enum PerfType {
    BULLET = 'bullet',
    BLITZ = 'blitz',
    RAPID = 'rapid',
    CLASSICAL = 'classical',
    CORRESPONDENCE = 'correspondence',
    ULTRABULLET = 'ultraBullet',
    CRAZYHOUSE = 'crazyhouse',
    CHESS960 = 'chess960',
    KING_OF_THE_HILL = 'kingOfTheHill',
    THREE_CHECK = 'threeCheck',
    ANTICHESS = 'antichess',
    ATOMIC = 'atomic',
    HORDE = 'horde',
    RACING_KINGS = 'racingKings'
}

export type LichessUser = components['schemas']['UserExtended'];
export type Perfs = components["schemas"]["Perfs"];
export type Perf =components["schemas"]["Perf"];
