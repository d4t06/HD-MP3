import { useAudioControl } from "@/hooks";
import { useLyricEditorContext } from "../_components/LyricEditorContext";
import createKeyFrame from "@/utils/createKeyFrame";
import { useEffect } from "react";
import { useEditLyricContext } from "@/modules/lyric-editor/_components/EditLyricContext";

type Props = {
	audioEle: HTMLAudioElement;
};

export default function usePlayer({ audioEle }: Props) {
	const { currentLyricWordsData } = useEditLyricContext();
	const {
		eleRefs,
		growList,
		actuallyEndRef,
		actuallyStartRef,
		tempActuallyStartRef,
		wordsRatioRef,
		mergedGrowListRef,
		status,
		setStatus,
	} = useLyricEditorContext();

	const { play, pause, statusRef } = useAudioControl({
		audioEle,
		statusFromParent: status,
		setStatusFromParent: setStatus,
	});

	const { overlayRef } = eleRefs;

	const _pause = () => {
		pause();

		if (overlayRef.current) overlayRef.current.style.animation = "none";
	};

	const _play = () => {
		audioEle.currentTime = actuallyStartRef.current - 0.3;

		if (!tempActuallyStartRef.current && overlayRef.current) {
			const name = createKeyFrame(mergedGrowListRef.current, wordsRatioRef.current);

			overlayRef.current.style.animation = `${name} ${(
				(actuallyEndRef.current - actuallyStartRef.current) /
				audioEle.playbackRate
			).toFixed(1)}s linear`;
		}

		play();
	};

	const handlePlayPause = () => {
		if (statusRef.current === "paused") _play();
		else {
			_pause();
		}
	};

	const handleTimeUpdate = () => {
		if (+audioEle.currentTime.toFixed(1) >= actuallyEndRef.current) return _pause();
	};

	useEffect(() => {
		if (!audioEle) return;

		audioEle.addEventListener("timeupdate", handleTimeUpdate);

		audioEle.playbackRate = 1.2;

		return () => {
			audioEle.removeEventListener("timeupdate", handleTimeUpdate);
		};
	}, []);

	useEffect(() => {
		const mergeGrow = () => {
			const numberOfCutByWord = currentLyricWordsData.map(
				(data) => data.cutPositions.length,
			);

			const mergeGrows: number[] = [];

			let i = 0;
			numberOfCutByWord.forEach((number) => {
				if (number === 0) {
					mergeGrows.push(growList[i]);
					i++;
				} else if (number > 0) {
					const slices = growList.slice(i, i + number + 1);

					const total = slices.reduce((p, c) => {
						i++;
						return p + c;
					}, 0);
					mergeGrows.push(total);
				}
			});

			mergedGrowListRef.current = mergeGrows;
		};

		mergeGrow();
	}, [growList]);

	return { handlePlayPause, _pause, _play, status };
}
