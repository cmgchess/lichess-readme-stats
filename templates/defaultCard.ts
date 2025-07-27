import { getLichessLogo, getPatronIcon, perfIconMap } from '../utils/icons';
import { PerfType, Theme } from '../types/types';

interface ThemeColors {
  bg: string;
  title: string;
  header: string;
  text: string;
  muted: string;
  border: string;
  divider: string;
}

interface LichessCardProps {
  username: string;
  title?: string;
  patron: boolean;
  firstRowPerfs: [PerfType, string][];
  secondRowPerfs: [PerfType, string][];
  gamesCountString: string;
  joinedDateString: string;
  theme: Theme;
  hideBorder?: boolean;
}

const themeColors: Record<Theme, ThemeColors> = {
  [Theme.DARK]: {
    bg: '#26272b',
    title: '#bd7537',
    header: '#fff',
    text: '#fff',
    muted: '#aaa',
    border: '#444',
    divider: '#444',
  },
  [Theme.LIGHT]: {
    bg: '#f4f4f4',
    title: '#bd7537',
    header: '#4d4d4d',
    text: '#4d4d4d',
    muted: '#6a737d',
    border: '#e1e4e8',
    divider: '#e1e4e8',
  },
};

const renderRow = (
  perfs: [PerfType, string][],
  colors: ThemeColors,
  initialX: number,
  y: number,
  itemSpacing: number
): string => {
  return perfs
    .map(([type, rating], index) => {
      const Icon = perfIconMap[type];
      return `
      <g transform="translate(${initialX + index * itemSpacing}, ${y})">
        ${Icon({ size: '17', fill: colors.text })}
        <text x="22" y="13" class="rating">${rating}</text>
      </g>
    `;
    })
    .join('');
};

const renderHeader = (
  props: { username: string; title?: string; patron?: boolean },
  colors: ThemeColors
): string => {
  const textX = props.patron ? 25 : 1;

  return `
        <g transform="translate(10, 18)">
      ${
        props.patron
          ? getPatronIcon({ x: 1, y: -5, size: '1.2em', fill: colors.header })
          : ''
      }
      <text x="${textX}" y="12">
        ${props.title ? `<tspan class="title">${props.title} </tspan>` : ''}
        <tspan y="11.5" class="username">${props.username}</tspan>
      </text>
        ${getLichessLogo({ x: 265, y: -1, size: '16', fill: colors.header })}
      </g>`;
};

const styles = (colors: ThemeColors): string => {
  return `
      <style>
        .title { font: bold 15.4px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${colors.title}; }
        .username { font: 400 15.4px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${colors.header}; }
        .rating { font: 14px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${colors.text}; }
        .info { font: 400 12px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${colors.muted}; }
      </style>`;
};

export function renderChessRatingCard({
  username,
  title,
  patron,
  firstRowPerfs,
  secondRowPerfs,
  gamesCountString,
  joinedDateString,
  theme = Theme.LIGHT,
  hideBorder = false,
}: LichessCardProps): string {
  const colors = themeColors[theme];
  const intialX = 15;
  const ratingItemSpacing = 70;

  return `
    <svg width="300" height="150" viewBox="0 0 300 150" fill="none" xmlns="http://www.w3.org/2000/svg">
      ${styles(colors)}
      <rect x="0" y="0" width="100%" height="100%" rx="5" fill="${
        colors.bg
      }" stroke="${hideBorder ? 'none' : colors.border}" />

      ${renderHeader({ username, title, patron }, colors)}
            
      ${renderRow(firstRowPerfs, colors, intialX, 45, ratingItemSpacing)}

      ${renderRow(secondRowPerfs, colors, intialX, 75, ratingItemSpacing)}
      
      <line x1="0" y1="110" x2="300" y2="110" stroke="${
        colors.divider
      }" stroke-width="1" />

      <text x="15" y="130" class="info">${gamesCountString}</text>
      <text x="170" y="130" class="info">${joinedDateString}</text>
    </svg>
  `;
}
