import { timeago } from './timeago';

export const formatGames = (count: number): string => {
  const formattedCount = count.toLocaleString('en-US');
  return count === 1 ? `${formattedCount} game` : `${formattedCount} games`;
};

export const formatJoinedDate = (timestamp: number): string =>
  `Joined ${timeago(timestamp)}`;
