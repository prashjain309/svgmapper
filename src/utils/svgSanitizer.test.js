import { describe, it, expect } from 'vitest';
import { sanitizeSVG, validateSVGFile } from './svgSanitizer';

describe('sanitizeSVG', () => {
  it('removes script tags from SVG', () => {
    const input =
      '<svg xmlns="http://www.w3.org/2000/svg"><script>alert("xss")</script><rect width="100" height="100"/></svg>';
    const result = sanitizeSVG(input);
    expect(result).not.toContain('<script');
    expect(result).toContain('<rect');
  });

  it('removes inline event handlers', () => {
    const input =
      '<svg xmlns="http://www.w3.org/2000/svg"><rect onclick="alert(1)" onload="alert(2)" width="100" height="100"/></svg>';
    const result = sanitizeSVG(input);
    expect(result).not.toContain('onclick');
    expect(result).not.toContain('onload');
    expect(result).toContain('<rect');
  });

  it('preserves valid SVG elements', () => {
    const input =
      '<svg xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="red"/><circle cx="50" cy="50" r="25"/></svg>';
    const result = sanitizeSVG(input);
    expect(result).toContain('<rect');
    expect(result).toContain('<circle');
    expect(result).toContain('fill="red"');
  });

  it('throws on invalid SVG', () => {
    expect(() => sanitizeSVG('<not-svg>broken')).toThrow('Invalid SVG');
  });
});

describe('validateSVGFile', () => {
  it('returns null for valid SVG file', () => {
    const file = { type: 'image/svg+xml', name: 'test.svg', size: 1000 };
    expect(validateSVGFile(file)).toBeNull();
  });

  it('returns error for non-SVG file', () => {
    const file = { type: 'image/png', name: 'test.png', size: 1000 };
    expect(validateSVGFile(file)).toContain('SVG');
  });

  it('returns error for no file', () => {
    expect(validateSVGFile(null)).toContain('No file');
  });

  it('returns error for oversized file', () => {
    const file = {
      type: 'image/svg+xml',
      name: 'big.svg',
      size: 20 * 1024 * 1024,
    };
    expect(validateSVGFile(file)).toContain('too large');
  });

  it('accepts .svg extension even without correct MIME type', () => {
    const file = { type: '', name: 'test.svg', size: 1000 };
    expect(validateSVGFile(file)).toBeNull();
  });
});
