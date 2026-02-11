import { useEffect, useRef, useCallback, useState } from 'react';
import { useMapper } from '../../context/MapperContext';
import styles from './SVGDisplay.module.css';

export default function SVGDisplay({ svgContainerRef }) {
  const { svgContent, mappings } = useMapper();
  const internalRef = useRef(null);
  const [hoveredElement, setHoveredElement] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Use the passed ref or internal one
  const containerRef = svgContainerRef || internalRef;

  // Initialize SVG elements after render
  useEffect(() => {
    if (!containerRef.current || !svgContent) return;

    const svg = containerRef.current.querySelector('svg');
    if (!svg) return;

    // Select all mappable SVG elements (excluding text and groups)
    const elements = svg.querySelectorAll(
      ':scope > *:not(text):not(g):not(defs):not(style), g > *:not(text):not(g):not(defs):not(style)',
    );

    elements.forEach((el, index) => {
      el.classList.add('svg-mapping-category');
      el.setAttribute('data-element-id', `svg-el-${index}`);

      // Preserve existing classes as pre-mapped
      const existingClass = el.getAttribute('data-original-class');
      if (!existingClass && el.getAttribute('class')) {
        const originalClasses = el
          .getAttribute('class')
          .replace('svg-mapping-category', '')
          .trim();
        if (originalClasses) {
          el.setAttribute('data-original-class', originalClasses);
          el.setAttribute('data-category', originalClasses);
          el.classList.add('pre-mapped');
        }
      }
    });
  }, [svgContent, containerRef]);

  // Apply mappings to SVG elements
  useEffect(() => {
    if (!containerRef.current) return;

    const svg = containerRef.current.querySelector('svg');
    if (!svg) return;

    const elements = svg.querySelectorAll('[data-element-id]');
    elements.forEach((el) => {
      const id = el.getAttribute('data-element-id');
      const mapping = mappings[id];

      // Remove old mapping classes
      el.classList.remove('mapped');
      const oldCategory = el.getAttribute('data-mapped-code');
      if (oldCategory) {
        el.classList.remove(oldCategory);
      }

      if (mapping) {
        el.classList.add('mapped');
        el.classList.add(mapping.fullCode);
        el.setAttribute('data-category', mapping.fullCode);
        el.setAttribute('data-mapped-code', mapping.fullCode);
      }
    });
  }, [mappings, containerRef]);

  // Handle hover on SVG elements
  const handleMouseOver = useCallback((e) => {
    const el = e.target.closest('[data-element-id]');
    if (!el) return;
    el.classList.add('enabled', 'heyo');
    const category = el.getAttribute('data-category');
    if (category) {
      setHoveredElement(category);
    }
  }, []);

  const handleMouseOut = useCallback((e) => {
    const el = e.target.closest('[data-element-id]');
    if (!el) return;
    el.classList.remove('enabled', 'heyo');
    setHoveredElement(null);
  }, []);

  const handleMouseMove = useCallback((e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  }, []);

  // Handle drop via native events (as fallback for direct SVG element drops)
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    const el = e.target.closest('[data-element-id]');
    if (el) {
      el.classList.add('droping-zone');
    }
  }, []);

  const handleDragLeave = useCallback((e) => {
    const el = e.target.closest('[data-element-id]');
    if (el) {
      el.classList.remove('droping-zone');
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const el = e.target.closest('[data-element-id]');
    if (el) {
      el.classList.remove('droping-zone');
    }
  }, []);

  if (!svgContent) return null;

  return (
    <>
      <div
        ref={containerRef}
        className={styles.svgContainer}
        dangerouslySetInnerHTML={{ __html: svgContent }}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
        onMouseMove={handleMouseMove}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        role="img"
        aria-label="Uploaded SVG with mapping regions"
      />
      {hoveredElement && (
        <div
          className={styles.tooltip}
          style={{
            left: mousePos.x,
            top: mousePos.y - 70,
          }}
        >
          {hoveredElement}
        </div>
      )}
    </>
  );
}
