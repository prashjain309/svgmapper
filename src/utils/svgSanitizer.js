/**
 * Sanitizes SVG content by removing potentially dangerous elements and attributes.
 * Strips <script> tags, inline event handlers (on*), and external resource references.
 */
export function sanitizeSVG(svgString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, 'image/svg+xml');

  const parserError = doc.querySelector('parsererror');
  if (parserError) {
    throw new Error('Invalid SVG: failed to parse');
  }

  // Remove <script> elements
  const scripts = doc.querySelectorAll('script');
  scripts.forEach((el) => el.remove());

  // Remove all event handler attributes (on*)
  const allElements = doc.querySelectorAll('*');
  allElements.forEach((el) => {
    const attrs = [...el.attributes];
    attrs.forEach((attr) => {
      if (attr.name.toLowerCase().startsWith('on')) {
        el.removeAttribute(attr.name);
      }
    });
  });

  const serializer = new XMLSerializer();
  return serializer.serializeToString(doc.documentElement);
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Validates an SVG file before processing.
 * Returns null if valid, or an error message string.
 */
export function validateSVGFile(file) {
  if (!file) {
    return 'No file selected';
  }
  if (file.type !== 'image/svg+xml' && !file.name.endsWith('.svg')) {
    return 'Please upload an SVG file only';
  }
  if (file.size > MAX_FILE_SIZE) {
    return 'File is too large (max 10MB)';
  }
  return null;
}
