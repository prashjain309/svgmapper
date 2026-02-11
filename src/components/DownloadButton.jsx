import { useDownload } from '../hooks/useDownload';
import styles from './DownloadButton.module.css';

export default function DownloadButton({ svgContainerRef }) {
  const { handleDownload } = useDownload(svgContainerRef);

  return (
    <button
      type="button"
      className={styles.downloadBtn}
      onClick={handleDownload}
      aria-label="Download mapped SVG"
    >
      Download Mapped SVG
    </button>
  );
}
