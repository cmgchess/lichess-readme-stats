import { renderChessRatingCard } from '../templates/defaultCard';
import { formatGames, formatJoinedDate } from '../utils/format';
import { VercelRequest, VercelResponse } from '@vercel/node';
import { renderErrorCard } from '../templates/errorCard';
import { LichessUser, Theme } from '../types/types';
import axios from 'axios';
import {
  getFirstRowPerfs,
  getFormattedRatings,
  getSecondRowPerfs,
} from '../utils/rating';

const CACHE_DURATION = 1800;

const getUserData = async (username: string): Promise<LichessUser> => {
  const response = await axios.get(`https://lichess.org/api/user/${username}`);
  return response.data;
};

export default async (req: VercelRequest, res: VercelResponse) => {
  const { username, theme = Theme.DARK } = req.query;
  const hideBorder = theme === Theme.DARK;

  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', `max-age=${CACHE_DURATION}`);

  if (!username || typeof username !== 'string') {
    const errorCard = renderErrorCard({
      message: 'Username is required',
      reason: 'Please provide a valid Lichess username.',
      theme: theme as Theme,
      hideBorder,
    });
    res.status(400).send(errorCard);
    return;
  }

  let userData: LichessUser;

  try {
    userData = await getUserData(username);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      const errorCard = renderErrorCard({
        message: 'User Not Found',
        reason: `The user ${username} does not exist on Lichess.`,
        theme: theme as Theme,
        hideBorder,
      });
      return res.status(404).send(errorCard);
    }

    const errorCard = renderErrorCard({
      message: 'Something went wrong',
      reason: 'Unable to fetch Lichess data.',
      theme: theme as Theme,
      hideBorder,
    });

    res.status(500).send(errorCard);
    return;
  }

  const joinedDateString = formatJoinedDate(userData.createdAt ?? 0);
  const gamesCountString = formatGames(userData.count?.all ?? 0);
  const perfs = userData.perfs!;
  const firstRowPerfs = getFirstRowPerfs(perfs);
  const secondRowPerfs = getSecondRowPerfs(perfs, 4);
  const secondRowFormattedRatings = getFormattedRatings(secondRowPerfs);
  const firstRowFormattedRatings = getFormattedRatings(firstRowPerfs);

  const card = renderChessRatingCard({
    username: userData.username,
    patron: userData.patron ?? false,
    title: userData.title,
    firstRowPerfs: firstRowFormattedRatings,
    secondRowPerfs: secondRowFormattedRatings,
    gamesCountString,
    joinedDateString,
    theme: theme as Theme,
    hideBorder,
  });

  return res.status(200).send(card);
};