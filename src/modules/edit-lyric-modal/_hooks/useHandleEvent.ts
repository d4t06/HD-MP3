import { useEffect } from "react";
import { useLyricEditorContext } from "../_components/LyricEditorContext";

export default function useHandleEvent() {
	const {
		isOpenEditLyricModal,
		playerRef,
		eleRefs: { currentWordRef },
		eventRefs,
	} = useLyricEditorContext();

	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.key === " ") {
			if (!eventRefs.playWhenSpaceRef.current) return;
			e.preventDefault();

			console.log('handle play pause')

			playerRef.current?.handlePlayPause();
		}

		if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
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

		window.addEventListener("mousedown", handleClickOutsideWordItem);
		window.addEventListener("keydown", handleKeyDown);

		return () => {
			window.removeEventListener("mousedown", handleClickOutsideWordItem);
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [isOpenEditLyricModal]);

	// useEffect(() => {

	// 	return () => {
	// 	};
	// }, [isChangeWordGrow]);
}
