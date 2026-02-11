import styles from './ZoomControls.module.css';

export default function ZoomControls() {
  // Zoom is handled by react-zoom-pan-pinch at the SVGPanel level
  // These controls use the TransformWrapper's API
  return null;
}

/**
 * ZoomControls that work with react-zoom-pan-pinch's TransformWrapper.
 * To be rendered inside a <TransformWrapper> component.
 */
export function ZoomControlButtons({ zoomIn, zoomOut, resetTransform }) {
  return (
    <div className={styles.zoomButtons} role="group" aria-label="Zoom controls">
      <button
        type="button"
        className={styles.zoomBtn}
        onClick={() => zoomIn()}
        aria-label="Zoom in"
      >
        +
      </button>
      <button
        type="button"
        className={styles.zoomBtn}
        onClick={() => zoomOut()}
        aria-label="Zoom out"
      >
        −
      </button>
      <button
        type="button"
        className={styles.zoomBtn}
        onClick={() => resetTransform()}
        aria-label="Reset zoom"
      >
        Reset
      </button>
    </div>
  );
}
