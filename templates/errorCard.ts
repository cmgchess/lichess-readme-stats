import { Theme } from '../types/types';

export interface ErrorCardProps {
  message?: string;
  reason?: string;
  theme?: Theme;
  hideBorder?: boolean;
}

interface ThemeColors {
  bg: string;
  title: string;
  text: string;
  muted: string;
  border: string;
  divider: string;
}

const themeColors: Record<Theme, ThemeColors> = {
  [Theme.DARK]: {
    bg: '#26272b',
    title: '#ff6b6b',
    text: '#fff',
    muted: '#aaa',
    border: '#444',
    divider: '#444',
  },
  [Theme.LIGHT]: {
    bg: '#ffffff',
    title: '#d73a49',
    text: '#24292e',
    muted: '#6a737d',
    border: '#e1e4e8',
    divider: '#e1e4e8',
  },
};

function getErrorIcon({ size = 24, fill = '#ff6b6b' } = {}) {
  return `
      <svg y="-4" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill="${fill}" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8 0-4.42 3.58-8 8-8 4.42 0 8 3.58 8 8 0 4.42-3.58 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
      </svg>
    `;
}

export function renderErrorCard({
  message = 'Something went wrong',
  reason = 'Unable to fetch Lichess data.',
  theme = Theme.DARK,
  hideBorder = false,
}: ErrorCardProps): string {
  const colors = themeColors[theme];

  return `
    <svg width="400" height="120" viewBox="0 0 400 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <style>
        .title { font: bold 18px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${
          colors.title
        }; }
        .text { font: 400 14px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${
          colors.text
        }; }
        .info { font: 400 12px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${
          colors.muted
        }; }
        
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.7; }
          100% { opacity: 1; }
        }
        .error-icon {
          animation: pulse 2s ease-in-out infinite;
        }
      </style>
      <rect x="0" y="0" width="100%" height="100%" rx="5" fill="${
        colors.bg
      }" stroke="${hideBorder ? 'none' : colors.border}" />
      <!-- Error icon with pulsing animation -->
      <g transform="translate(20, 30)" class="error-icon">
        ${getErrorIcon({ size: 24, fill: colors.title })}
      </g> 
      <text x="54" y="44" class="title">${message}</text>
      <line x1="20" y1="60" x2="380" y2="60" stroke="${
        colors.divider
      }" stroke-width="1" />
      <text x="20" y="85" class="text">${reason}</text>
      <text x="20" y="102" class="info">${
        new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC'
      }</text>
    </svg>
  `;
}
