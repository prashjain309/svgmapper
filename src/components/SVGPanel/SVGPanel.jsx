import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { useMapper } from '../../context/MapperContext';
import SVGUploader from './SVGUploader';
import SVGDisplay from './SVGDisplay';
import { ZoomControlButtons } from './ZoomControls';
import styles from './SVGPanel.module.css';

export default function SVGPanel({ svgContainerRef }) {
  const { svgContent } = useMapper();

  return (
    <section className={styles.panel} aria-label="SVG Upload and Display">
      <SVGUploader />
      {svgContent && (
        <div className={styles.displayWrapper}>
          <TransformWrapper
            initialScale={1}
            minScale={1}
            maxScale={5}
            wheel={{ step: 0.1 }}
            panning={{ disabled: false }}
          >
            {({ zoomIn, zoomOut, resetTransform }) => (
              <>
                <TransformComponent wrapperClass={styles.zoomWrapper}>
                  <SVGDisplay svgContainerRef={svgContainerRef} />
                </TransformComponent>
                <ZoomControlButtons
                  zoomIn={zoomIn}
                  zoomOut={zoomOut}
                  resetTransform={resetTransform}
                />
              </>
            )}
          </TransformWrapper>
        </div>
      )}
    </section>
  );
}
