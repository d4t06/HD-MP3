import { useEffect } from "react";
import { useLyricEditorContext } from "../_components/LyricEditorContext";

export default function useHandleEvent() {
	const {
		isOpenEditLyricModal,
		playerRef,
		eleRefs: { currentWordRef },
		// isChangeWordGrow,
		// setIsChangeWordGrow,
		// isEditText,
		eventRefs,
	} = useLyricEditorContext();

	const playSongWhenSpace = (e: KeyboardEvent) => {
		if (!eventRefs.playWhenSpaceRef.current) return;

		if (e.key === " ") {
			e.preventDefault();

			playerRef.current?.handlePlayPause();
		}
	};

	const moveArrowToGrow = (e: KeyboardEvent) => {
		if (!eventRefs.moveArrowToGrowRef.current) return;

		const selectedWord = currentWordRef.current;
		if (!selectedWord) return;

		switch (e.key) {
			case "ArrowRight":
				e.preventDefault();
				if (selectedWord?.nextSibling)
					(selectedWord?.nextSibling as HTMLDivElement).click();

				break;
			case "ArrowLeft":
				e.preventDefault();
				if (selectedWord?.previousSibling)
					(selectedWord?.previousSibling as HTMLDivElement).click();

				break;
		}
	};

	const handleClickOutsideWordItem: EventListener = (e) => {
		if (!eventRefs.moveArrowToGrowRef.current) return;

		const node = e.target as Node;

		const word = document.querySelectorAll(".word-item");

		let isClickedWordItem = false;

		word.forEach((modalContent) =>
			modalContent.contains(node) ? (isClickedWordItem = true) : {},
		);

		if (isClickedWordItem) return;

		eventRefs.moveArrowToGrowRef.current = false;

		// setIsChangeWordGrow(false);
	};

	useEffect(() => {
		// if (isEditText) return;

		window.addEventListener("keydown", playSongWhenSpace);
		window.addEventListener("mousedown", handleClickOutsideWordItem);
		window.addEventListener("keydown", moveArrowToGrow);

		return () => {
			window.removeEventListener("mousedown", handleClickOutsideWordItem);
			window.removeEventListener("keydown", playSongWhenSpace);
			window.removeEventListener("keydown", moveArrowToGrow);
		};
	}, [isOpenEditLyricModal]);

	// useEffect(() => {

	// 	return () => {
	// 	};
	// }, [isChangeWordGrow]);
}
