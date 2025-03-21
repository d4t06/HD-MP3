import { Button } from "@/components";
import { useLyricEditorContext } from "./LyricEditorContext";
import { BackwardIcon, ForwardIcon } from "@heroicons/react/24/outline";
import { useEditLyricContext } from "@/modules/lyric-editor/_components/EditLyricContext";
import useEditLyricModalAction from "../_hooks/useEditLyricModalAction";
import { getDisable } from "@/utils/appHelpers";

type Props = {
	closeModal: () => void;
};
export default function BottomCta({ closeModal }: Props) {
	const { setSelectLyricIndex, selectLyricIndex, lyrics } = useEditLyricContext();

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
				onClick={() => handleNavigate("prev")}
				className={`font-playwriteCU`}
			>
				<BackwardIcon className="w-6" />
				<span>Previous</span>
			</Button>
			<Button
				color="primary"
				onClick={() => handleNavigate("next")}
				className={`font-playwriteCU`}
			>
				<span>Next</span>
				<ForwardIcon className="w-6" />
			</Button>
			<Button
				disabled={!isChangedRef.current}
				color="primary"
				onClick={handleUpdateLyricTune}
				className={`font-playwriteCU`}
			>
				Ok
			</Button>
		</div>
	);
}
