import type { Cell } from '../types';
import styles from './Tile.module.css';

type TileProps = {
  value: Cell;
};

function Tile({ value }: TileProps) {
  const tileClass = value ? styles[`tile-${value}`] : styles.empty;
  const className = `${styles.tile} ${tileClass}`;

  return (
    <div className={className}>
      <div className={styles.inner}>{value}</div>
    </div>
  );
};

export default Tile;