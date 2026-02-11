import { useDraggable } from '@dnd-kit/core';
import styles from './CategoryItem.module.css';

export default function CategoryItem({ category }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `category-${category.fullCode}`,
    data: category,
  });

  return (
    <tr
      ref={setNodeRef}
      className={isDragging ? styles.dragging : ''}
      role="listitem"
      {...listeners}
      {...attributes}
    >
      <td className={styles.code} draggable="true">
        {category.fullCode}
      </td>
      <td className={styles.name}>{category.name}</td>
    </tr>
  );
}
