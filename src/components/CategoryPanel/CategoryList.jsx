import { useMapper } from '../../context/MapperContext';
import CategoryItem from './CategoryItem';
import styles from './CategoryList.module.css';

export default function CategoryList() {
  const { categories } = useMapper();

  return (
    <div className={styles.list} role="list" aria-label="Draggable categories">
      <table className={styles.table}>
        <tbody>
          {categories.map((cat, index) => (
            <CategoryItem key={`${cat.code}-${index}`} category={cat} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
