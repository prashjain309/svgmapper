import { useMapper } from '../../context/MapperContext';
import PrefixInput from './PrefixInput';
import CategoryInput from './CategoryInput';
import CategoryList from './CategoryList';
import styles from './CategoryPanel.module.css';

export default function CategoryPanel() {
  const { categories } = useMapper();

  return (
    <section className={styles.panel} aria-label="Category Configuration">
      <PrefixInput />
      <CategoryInput />
      {categories.length > 0 && (
        <>
          <div className={styles.sampleLabel}>Categories:</div>
          <CategoryList />
        </>
      )}
    </section>
  );
}
