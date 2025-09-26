import { useCallback, useEffect, useState } from 'react';
import type { Direction, GameState, Map2048 } from '../types';
import { addNewTile,  checkGameStatus,  moveMapIn2048Rule } from '../utils/gameLogic';
import { BEST_SCORE_KEY, BOARD_KEY, SCORE_KEY, loadItemFromStorage, saveItemToStorage } from '../utils/storage';

const getInitialMap = (): Map2048 => {
  let initialMap: Map2048 = Array(4).fill(null).map(() => Array(4).fill(null));
  initialMap = addNewTile(initialMap);
  initialMap = addNewTile(initialMap);
  return initialMap;
};

const getInitialState = (): GameState => {
  return {
    board: loadItemFromStorage<Map2048>(BOARD_KEY) || getInitialMap(),
    score: loadItemFromStorage<number>(SCORE_KEY) || 0,
    bestScore: loadItemFromStorage<number>(BEST_SCORE_KEY) || 0,
    gameStatus: 'playing',
  };
};

export const useGame = () => {
  const [gameState, setGameState] = useState<GameState>(getInitialState);
  const [history, setHistory] = useState<GameState[]>([]);


  useEffect(() => {
    saveItemToStorage(BOARD_KEY, gameState.board);
    saveItemToStorage(SCORE_KEY, gameState.score);
    if (gameState.score > gameState.bestScore) {
      setGameState(prev => ({ ...prev, bestScore: prev.score }));
      saveItemToStorage(BEST_SCORE_KEY, gameState.score);
    }
  }, [gameState.score, gameState.bestScore, gameState.board]);

  useEffect(() => {
    const status = checkGameStatus(gameState.board);
    if (status !== gameState.gameStatus) {
      setGameState(prev => ({ ...prev, gameStatus: status }));
    }
  }, [gameState.board, gameState.gameStatus]);

  const move = useCallback((direction: Direction) => {
    if (gameState.gameStatus !== 'playing') return;

    const newMap = moveMapIn2048Rule(gameState.board, direction);
    if (newMap.isMoved) {
      setHistory(prev => [...prev, gameState]);

      const boardWithNewTile = addNewTile(newMap.result);

      setGameState(prev => ({
        ...prev,
        board: boardWithNewTile,
        score: prev.score + newMap.score,
      }));
    }
  }, [gameState]);

  const undo = () => {
    if (history.length === 0) return;
    const previousState = history[history.length - 1];

    setGameState(previousState);
    setHistory(history.slice(0, -1));
  };

  const restartGame = () => {
    setHistory([]);
    setGameState(prevGameState => ({
      board: getInitialMap(),
      score: 0,
      bestScore: prevGameState.bestScore,
      gameStatus: 'playing',
    }));
  };

  return { gameState, move, undo, restartGame };
};