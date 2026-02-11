import { describe, it, expect } from 'vitest';
import { parseCategories } from './categoryParser';

describe('parseCategories', () => {
  it('parses valid category input', () => {
    const result = parseCategories('Building(1001)Floor(1002)');
    expect(result).toEqual([
      { name: 'Building', code: '1001' },
      { name: 'Floor', code: '1002' },
    ]);
  });

  it('handles single category', () => {
    const result = parseCategories('Room(2001)');
    expect(result).toEqual([{ name: 'Room', code: '2001' }]);
  });

  it('returns empty array for empty input', () => {
    expect(parseCategories('')).toEqual([]);
    expect(parseCategories('   ')).toEqual([]);
    expect(parseCategories(null)).toEqual([]);
    expect(parseCategories(undefined)).toEqual([]);
  });

  it('trims whitespace from names and codes', () => {
    const result = parseCategories(' Building ( 1001 )');
    expect(result).toEqual([{ name: 'Building', code: '1001' }]);
  });

  it('throws on invalid format (missing code)', () => {
    expect(() => parseCategories('Building')).toThrow('Invalid format');
  });

  it('throws on missing name', () => {
    expect(() => parseCategories('(1001)')).toThrow('Missing category name');
  });

  it('handles multiline input with newlines', () => {
    const input = 'CAT1(1000000001)\nCAT2(1000000002)';
    const result = parseCategories(input);
    expect(result).toEqual([
      { name: 'CAT1', code: '1000000001' },
      { name: 'CAT2', code: '1000000002' },
    ]);
  });

  it('handles multiple categories on one line', () => {
    const input = 'A(100)B(200)C(300)';
    const result = parseCategories(input);
    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({ name: 'A', code: '100' });
    expect(result[1]).toEqual({ name: 'B', code: '200' });
    expect(result[2]).toEqual({ name: 'C', code: '300' });
  });
});
