import { useMapper } from '../../context/MapperContext';
import styles from './PrefixInput.module.css';

export default function PrefixInput() {
  const { prefix, setPrefix } = useMapper();

  return (
    <div className={styles.wrapper}>
      <label className={styles.label} htmlFor="prefix-input">
        Prefix:
      </label>
      <input
        id="prefix-input"
        type="text"
        value={prefix}
        onChange={(e) => setPrefix(e.target.value)}
        placeholder="Enter Prefix"
        className={styles.input}
      />
    </div>
  );
}
