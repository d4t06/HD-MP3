export function getFixedCutsByLength(word: string, numCuts: number) {
  if (numCuts <= 0 || numCuts >= word.length) {
    return []; // No valid cuts possible
  }

  const cutPositions: number[] = [];
  const segmentLength = word.length / (numCuts + 1); // Divide into (numCuts + 1) segments

  for (let i = 1; i <= numCuts; i++) {
    const cutIndex = Math.round(segmentLength * i); // Calculate approximate cut position
    if (cutIndex > 0 && cutIndex < word.length) {
      cutPositions.push(cutIndex);
    }
  }

  // Ensure cut positions are unique and sorted (though should be by default)
  return [...new Set(cutPositions)].sort((a, b) => a - b);
}

export function splitStringByCutPositions(text: string, cutPositions: number[]) {
  if (cutPositions.length === 1 && cutPositions[0] === 0) return [text];

  const parts: string[] = [];
  let start = 0;

  // Ensure cutPositions are sorted in ascending order
  cutPositions.sort((a, b) => a - b);

  for (const cut of cutPositions) {
    if (cut > text.length || cut < 0) {
      continue; // Skip invalid cut positions
    }
    parts.push(text.substring(start, cut));
    start = cut;
  }

  parts.push(text.substring(start)); // Add the last part

  return parts;
}
