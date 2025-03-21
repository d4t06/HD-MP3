import { useEditLyricContext } from "@/modules/lyric-editor/_components/EditLyricContext";
import { useEffect } from "react";
import { useLyricEditorContext } from "../_components/LyricEditorContext";
import { getWordsRatio } from "@/utils/getWordsRatio";

export default function useEditLyricModalSideEffect() {
	const { selectLyricIndex, currentLyric, currentWords, currentSplitWords } =
		useEditLyricContext();

	const {
		eleRefs,
		actuallyEndRef,
		actuallyStartRef,
		mergedGrowListRef,
		wordsRatioRef,
		growList,
		setGrowList,
	} = useLyricEditorContext();

	const { tempWordRef, endTimeRangeRef, startTimeRangeRef, startRefText, endRefText } =
		eleRefs;

	useEffect(() => {
		if (!tempWordRef.current) return;

		const list = getWordsRatio(tempWordRef.current);
		wordsRatioRef.current = list;
	}, [currentWords]);


// update growListRef in usePlayer
	// useEffect(() => {
	// 	growListRef.current = growList;
	// }, [growList]);

	// update growlist
	useEffect(() => {
		const _growList = currentLyric?.tune
			? currentLyric.tune.grow.split("_").map((v) => +v)
			: [];

		currentSplitWords.forEach((_w, index) => {
			if (typeof _growList[index] !== "number") _growList[index] = 1;
		});

		setGrowList(_growList);
	}, [currentLyric]);

	// update time
	useEffect(() => {
		if (!currentLyric) return;

		if (
			endRefText.current &&
			startRefText.current &&
			startTimeRangeRef.current &&
			endTimeRangeRef.current
		) {
			actuallyStartRef.current = currentLyric?.tune
				? currentLyric.tune.start
				: currentLyric.start;
			startRefText.current.innerText = `${currentLyric.start} / ${actuallyStartRef.current}`;

			startTimeRangeRef.current.max = currentLyric.end + "";
			startTimeRangeRef.current.value = actuallyStartRef.current + "";

			actuallyEndRef.current = currentLyric?.tune
				? currentLyric.tune.end
				: currentLyric.end;
			endRefText.current.innerText = `${actuallyEndRef.current} / ${currentLyric.end}`;

			endTimeRangeRef.current.max = currentLyric.end + "";
			endTimeRangeRef.current.value = actuallyEndRef.current + "";
		}
	}, [selectLyricIndex]);
}
