import { Button } from "@/components";
import { useLyricEditorContext } from "./LyricEditorContext";
import {
	ArrowLeftIcon,
	ArrowRightIcon,
	CheckIcon,
} from "@heroicons/react/24/outline";
import { useEditLyricContext } from "@/modules/lyric-editor/_components/EditLyricContext";
import useEditLyricModalAction from "../_hooks/useEditLyricModalAction";

type Props = {
	closeModal: () => void;
};
export default function BottomCta({ closeModal }: Props) {
	const { setSelectLyricIndex, selectLyricIndex, lyrics } =
		useEditLyricContext();

	const { isChangedRef, playerRef } = useLyricEditorContext();

	const { updateLyricTune } = useEditLyricModalAction();

	const handleUpdateLyricTune = () => {
		updateLyricTune();
		closeModal();
	};

	const handleNavigate = (action: "next" | "prev") => {
		if (typeof selectLyricIndex !== "number") return;

		if (isChangedRef.current) {
			isChangedRef.current = false;
			updateLyricTune();
		}

		playerRef.current?.pause();

		switch (action) {
			case "next":
				if (selectLyricIndex === lyrics.length - 1) return;

				setSelectLyricIndex((prev) => prev! + 1);
				break;
			case "prev":
				if (selectLyricIndex === 0) return;

				setSelectLyricIndex((prev) => prev! - 1);
				break;
		}
	};

	return (
		<div className={`flex justify-end space-x-2 mt-5 `}>
			<Button
				color="primary"
				disabled={selectLyricIndex === 0}
				onClick={() => handleNavigate("prev")}
			>
				<ArrowLeftIcon className="w-6" />
				<span className="hidden md:block">Previous</span>
			</Button>
			<Button
				color="primary"
				disabled={selectLyricIndex === lyrics.length - 1}
				onClick={() => handleNavigate("next")}
			>
				<span className="hidden md:block">Next</span>
				<ArrowRightIcon className="w-6" />
			</Button>
			<Button
				disabled={!isChangedRef.current}
				color="primary"
				onClick={handleUpdateLyricTune}
			>
				<CheckIcon className="w-6" />

				<span>Ok</span>
			</Button>
		</div>
	);
}
