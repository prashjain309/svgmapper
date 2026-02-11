const TEMP_CLASSES = [
  'enabled',
  'heyo',
  'mapped',
  'pre-mapped',
  'svg-mapping-category',
  'droping-zone',
];

/**
 * Prepares SVG content for export by removing temporary classes
 * and ensuring proper XML namespaces.
 */
export function exportSVG(svgElement) {
  const clone = svgElement.cloneNode(true);

  // Remove temporary classes from all elements
  clone.querySelectorAll('*').forEach((el) => {
    TEMP_CLASSES.forEach((cls) => el.classList.remove(cls));
    // Remove empty class attributes
    if (el.getAttribute('class') === '') {
      el.removeAttribute('class');
    }
  });

  const serializer = new XMLSerializer();
  let source = serializer.serializeToString(clone);

  // Add SVG namespace if missing
  if (!source.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)) {
    source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
  }

  // Add xlink namespace if missing
  if (!source.match(/^<svg[^>]+"http:\/\/www\.w3\.org\/1999\/xlink"/)) {
    source = source.replace(
      /^<svg/,
      '<svg xmlns:xlink="http://www.w3.org/1999/xlink"',
    );
  }

  // Add XML declaration
  source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

  return source;
}

/**
 * Triggers a download of SVG content as a file.
 */
export function downloadSVG(svgSource, fileName) {
  const url =
    'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgSource);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName || 'mapped.svg';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
