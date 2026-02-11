import { useRef } from 'react';
import { useMapper } from '../../context/MapperContext';
import { useSVGUpload } from '../../hooks/useSVGUpload';
import styles from './SVGUploader.module.css';

export default function SVGUploader() {
  const fileInputRef = useRef(null);
  const { svgFileName } = useMapper();
  const { handleFileUpload, error, isLoading } = useSVGUpload();

  const onChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
    // Reset input so same file can be re-selected
    e.target.value = '';
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={styles.uploader}>
      <button
        type="button"
        className={`${styles.btn} ${svgFileName ? styles.reupload : ''}`}
        onClick={handleClick}
        disabled={isLoading}
        aria-label={svgFileName ? 'Re-upload SVG' : 'Upload SVG'}
      >
        {isLoading ? (
          'Loading...'
        ) : svgFileName ? (
          <span>
            Mapping <strong>{svgFileName}</strong>
            <br />
            Click to Re-Upload
          </span>
        ) : (
          'Upload SVG'
        )}
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".svg"
        onChange={onChange}
        className={styles.hiddenInput}
        aria-label="Choose SVG file"
      />
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
