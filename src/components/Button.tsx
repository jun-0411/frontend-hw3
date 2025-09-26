import styles from './Button.module.css';

type ButtonProps = {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
};

function Button({ onClick, children, className = '' }: ButtonProps) {
  const combinedClassName = `${styles.button} ${className}`;

  return (
    <button onClick={onClick} className={combinedClassName}>
      {children}
    </button>
  );
}

export default Button;