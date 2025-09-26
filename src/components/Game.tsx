import { useEffect } from 'react';
import { useGame } from '../hooks/useGame';
import Board from './Board';
import GameOver from './Gameover';
import Header from './Header';

function Game() {
  const { gameState, move, undo, restartGame } = useGame();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {      
      switch (event.key) {
        case 'ArrowUp':
          move('up');
          break;
        case 'ArrowDown':
          move('down');
          break;
        case 'ArrowLeft':
          move('left');
          break;
        case 'ArrowRight':
          move('right');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [move]);

  return (
    <div className="game-container">
      <Header
        score={gameState.score}
        bestScore={gameState.bestScore}
        onUndo={undo}
        onRestart={restartGame}
      />
      <div className="board-wrapper">
        {gameState.gameStatus !== 'playing' && (
          <GameOver status={gameState.gameStatus} onRestart={restartGame} />
        )}
        <Board board={gameState.board} />
      </div>
    </div>
  );
};

export default Game;