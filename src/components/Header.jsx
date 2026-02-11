import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.heading}>
      <h1 className={styles.title}>SVG Mapper</h1>
    </header>
  );
}
