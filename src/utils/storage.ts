export const BOARD_KEY = '2048-game-board';
export const SCORE_KEY = '2048-current-score';
export const BEST_SCORE_KEY = '2048-best-score';

export const saveItemToStorage = (key: string, value: unknown): void => {
  window.localStorage.setItem(key, JSON.stringify(value));
};

export const loadItemFromStorage = <T>(key: string): T | null => {
  const item = window.localStorage.getItem(key);
  if (item) {
    return JSON.parse(item) as T;
  }
  return null;
};