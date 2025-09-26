import Button from './Button';
import styles from './Header.module.css';

type HeaderProps = {
  score: number;
  bestScore: number;
  onUndo: () => void;
  onRestart: () => void;
};

function Header({ score, bestScore, onUndo, onRestart }: HeaderProps) {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>2048</h1>

      <div className={styles.bottomRow}>
        <div className={styles.scoresContainer}>
          <div className={styles.scoreBox}>
            <span className={styles.scoreTitle}>SCORE</span>
            <span className={styles.scoreValue}>{score}</span>
          </div>
          <div className={styles.scoreBox}>
            <span className={styles.scoreTitle}>BEST</span>
            <span className={styles.scoreValue}>{bestScore}</span>
          </div>
        </div>

        <div className={styles.buttonsContainer}>
          <Button onClick={onRestart}>New Game</Button>
          <Button onClick={onUndo}>Undo</Button>
        </div>
      </div>
    </div>
  );
};

export default Header;