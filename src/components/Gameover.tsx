import Button from './Button';
import styles from './GameOver.module.css';

type GameOverProps = {
  status: 'win' | 'lose';
  onRestart: () => void;
};

function GameOver({ status, onRestart }: GameOverProps) {
  const message = status === 'win' ? 'You Win!' : 'You Lose';

  const overlayClassName = `${styles.overlay} ${styles[status]}`;

  return (
    <div className={overlayClassName}>
      <div className={styles.content}>
        <p className={styles.message}>{message}</p>
        <Button onClick={onRestart}>Try Again</Button>
      </div>
    </div>
  );
};

export default GameOver;