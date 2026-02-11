import { describe, it, expect, beforeEach } from 'vitest';
import { exportSVG } from './svgExporter';

describe('exportSVG', () => {
  let svgElement;

  beforeEach(() => {
    document.body.innerHTML = '';
    const div = document.createElement('div');
    div.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg"><rect class="mapped svg-mapping-category enabled heyo" data-category="test" width="100" height="100"/></svg>';
    document.body.appendChild(div);
    svgElement = div.querySelector('svg');
  });

  it('removes temporary classes from exported SVG', () => {
    const result = exportSVG(svgElement);
    expect(result).not.toContain('mapped');
    expect(result).not.toContain('svg-mapping-category');
    expect(result).not.toContain('enabled');
    expect(result).not.toContain('heyo');
  });

  it('preserves data-category attributes', () => {
    const result = exportSVG(svgElement);
    expect(result).toContain('data-category="test"');
  });

  it('adds XML declaration', () => {
    const result = exportSVG(svgElement);
    expect(result).toContain('<?xml version="1.0" standalone="no"?>');
  });

  it('does not modify the original SVG element', () => {
    exportSVG(svgElement);
    const rect = svgElement.querySelector('rect');
    expect(rect.classList.contains('mapped')).toBe(true);
  });
});
