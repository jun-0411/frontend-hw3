import type { Map2048 } from '../types';
import styles from './Board.module.css';
import Tile from './Tile';

type BoardProps = {
  board: Map2048;
};

function Board({ board }: BoardProps) {
  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {Array(16).fill(null).map((_, index) => (
          <div key={index} className={styles.cell} />
        ))}
      </div>

      <div className={styles.grid}>
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <Tile key={`${rowIndex}-${colIndex}`} value={cell} />
          ))
        )}
      </div>
    </div>
  );
};

export default Board;