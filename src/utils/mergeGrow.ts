export function mergeGrow(words: string[], cut: number[][], grow: number[]) {
	const mergedGrow: number[] = [];

	if (!grow.length) return []; // for clients

	let i = 0;
	words.forEach((_w, j) => {
		const numberOfCut = cut[j].length;

		if (numberOfCut === 0) {
			mergedGrow.push(grow[i]);
			i++;
		} else if (numberOfCut > 0) {
			const slices = grow.slice(i, i + numberOfCut + 1);

			const total = slices.reduce((p, c) => {
				i++;
				return +(p + c).toFixed(1);
			}, 0);
			mergedGrow.push(total);
		}
	});

	return mergedGrow;
}
