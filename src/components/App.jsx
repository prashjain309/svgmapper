import { useRef } from 'react';
import { DndContext } from '@dnd-kit/core';
import { MapperProvider, useMapper } from '../context/MapperContext';
import Header from './Header';
import SVGPanel from './SVGPanel/SVGPanel';
import CategoryPanel from './CategoryPanel/CategoryPanel';
import DownloadButton from './DownloadButton';
import Tooltip from './Tooltip';
import styles from './App.module.css';

function AppContent() {
  const svgContainerRef = useRef(null);
  const { svgContent, mappings, mapElement } = useMapper();

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const elementId = over.id;
    const category = active.data.current;

    // Check if already mapped
    if (mappings[elementId]) {
      const confirmed = window.confirm(
        `This element is already mapped as "${mappings[elementId].fullCode}". Remap it?`,
      );
      if (!confirmed) return;
    }

    mapElement(elementId, category);
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className={styles.app}>
        <Header />
        <main className={styles.wrapper}>
          <SVGPanel svgContainerRef={svgContainerRef} />
          <CategoryPanel />
        </main>
        {svgContent && <DownloadButton svgContainerRef={svgContainerRef} />}
        <Tooltip />
      </div>
    </DndContext>
  );
}

export default function App() {
  return (
    <MapperProvider>
      <AppContent />
    </MapperProvider>
  );
}
