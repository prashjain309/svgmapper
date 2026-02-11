import { useCallback } from 'react';
import { exportSVG, downloadSVG } from '../utils/svgExporter';
import { useMapper } from '../context/MapperContext';

export function useDownload(svgContainerRef) {
  const { svgFileName } = useMapper();

  const handleDownload = useCallback(() => {
    if (!svgContainerRef.current) return;

    const svgElement = svgContainerRef.current.querySelector('svg');
    if (!svgElement) return;

    const source = exportSVG(svgElement);
    downloadSVG(source, svgFileName);
  }, [svgContainerRef, svgFileName]);

  return { handleDownload };
}
