import { useState, useCallback } from 'react';
import { sanitizeSVG, validateSVGFile } from '../utils/svgSanitizer';
import { useMapper } from '../context/MapperContext';

export function useSVGUpload() {
  const { svgContent, setSvg } = useMapper();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = useCallback(
    (file) => {
      setError(null);

      const validationError = validateSVGFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      // Confirm before replacing existing SVG
      if (svgContent) {
        const confirmed = window.confirm(
          'You already have an SVG loaded. Uploading a new one will reset all mappings. Continue?',
        );
        if (!confirmed) return;
      }

      setIsLoading(true);
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const sanitized = sanitizeSVG(e.target.result);
          setSvg(sanitized, file.name);
        } catch (err) {
          setError(err.message || 'Failed to process SVG file');
        } finally {
          setIsLoading(false);
        }
      };

      reader.onerror = () => {
        setError('Failed to read file');
        setIsLoading(false);
      };

      reader.readAsText(file, 'UTF-8');
    },
    [svgContent, setSvg],
  );

  return { handleFileUpload, error, isLoading };
}
