/**
 * Parses category text in the format "Name(Code)" separated by newlines or closing parens.
 * Returns an array of { name, code } objects.
 * Throws an error with a descriptive message for invalid input.
 */
export function parseCategories(text) {
  if (!text || !text.trim()) {
    return [];
  }

  const entries = text.split(')').filter((s) => s.trim());
  const categories = [];

  for (const entry of entries) {
    const parts = entry.split('(');
    if (parts.length < 2 || !parts[1]) {
      const cleaned = entry.trim();
      if (cleaned) {
        throw new Error(
          `Invalid format: "${cleaned}". Expected format: Name(Code)`,
        );
      }
      continue;
    }

    const name = parts[0].trim();
    const code = parts[1].trim();

    if (!name) {
      throw new Error(`Missing category name for code "${code}"`);
    }
    if (!code) {
      throw new Error(`Missing category code for name "${name}"`);
    }

    categories.push({ name, code });
  }

  return categories;
}
