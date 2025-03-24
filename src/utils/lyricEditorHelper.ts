export function splitStringByCutPositions(text: string, cut: number[]) {
  if (cut.length === 1 && cut[0] === 0) return [text];

  const parts: string[] = [];
  let start = 0;

  // Ensure cutPositions are sorted in ascending order
  cut.sort((a, b) => a - b);

  for (const positon of cut) {
    if (positon > text.length || positon < 0) {
      continue; // Skip invalid cut positions
    }
    parts.push(text.substring(start, positon));
    start = positon;
  }

  parts.push(text.substring(start)); // Add the last part

  return parts;
}
