import { useState } from 'react';
import { useMapper } from '../../context/MapperContext';
import { parseCategories } from '../../utils/categoryParser';
import styles from './CategoryInput.module.css';

export default function CategoryInput() {
  const { prefix, setCategories } = useMapper();
  const [text, setText] = useState('');
  const [error, setError] = useState(null);

  const handleConvert = () => {
    setError(null);
    try {
      const parsed = parseCategories(text);
      if (parsed.length === 0) {
        setError('No valid categories found. Use format: Name(Code)');
        return;
      }
      // Apply prefix to each category code
      const withPrefix = parsed.map((cat) => ({
        ...cat,
        fullCode: prefix + cat.code,
      }));
      setCategories(withPrefix);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.wrapper}>
      <textarea
        id="category-input"
        className={styles.textarea}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter categories in format: CategoryName(CategoryCode)&#10;Example: CAT1(1000000001)"
        rows={5}
        aria-label="Category definitions"
      />
      <button
        type="button"
        className={styles.convertBtn}
        onClick={handleConvert}
      >
        Convert
      </button>
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
