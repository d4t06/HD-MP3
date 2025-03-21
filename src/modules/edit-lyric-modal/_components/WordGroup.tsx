import { Button, Modal, ModalRef } from "@/components";
import { useLyricEditorContext } from "./LyricEditorContext";
import { ScissorsIcon } from "@heroicons/react/24/outline";
import { useThemeContext } from "@/stores";
import { splitStringByCutPositions } from "@/utils/lyricEditorHelper";
import { useMemo, useRef } from "react";
import SplitWordModal from "./SplitWordModal";
import { useEditLyricContext } from "@/modules/lyric-editor/_components/EditLyricContext";

type WordItemProps = {
	text: string;
	openModal: () => void;
	index: number;
};

function WordItem({ text, openModal, index }: WordItemProps) {
	const { theme } = useThemeContext();
	const { growList, wordIndex, setWordIndex, eventRefs, eleRefs } =
		useLyricEditorContext();

	const { currentSplitWords } = useEditLyricContext();

	// error when i same two word
	const _index = useMemo(
		() => currentSplitWords.findIndex((t) => t === text),
		[text, currentSplitWords],
	);
	const active = wordIndex === _index;

	const handleSelectWord = () => {
		if (index === -1) return;
		setWordIndex(_index);
		eventRefs.moveArrowToGrowRef.current = true;
		// setIsChangeWordGrow(true); // for handle keyboard event

		eleRefs.growInputRef.current?.focus();
	};

	return (
		<div
			ref={(el) => (active ? (eleRefs.currentWordRef.current = el) : {})}
			style={{ flexGrow: growList[index] }}
			onClick={handleSelectWord}
			className={`word-item cursor-pointer relative rounded-full flex items-center justify-center border ${theme.content_border} ${
				active ? theme.content_bg : "bg-" + theme.alpha
			}`}
		>
			<span>
				{text} {index} {_index}
			</span>

			{text.length > 1 && active && (
				<Button
					onClick={openModal}
					size={"clear"}
					className="!absolute bottom-0 translate-y-[16px] bg-black/10 p-1.5"
				>
					<ScissorsIcon className="w-5" />
				</Button>
			)}
		</div>
	);
}

type Props = {
	index: number;
	wordData: { text: string; cutPositions: number[] };
};

export default function WordGroup({ index, wordData }: Props) {
	const modalRef = useRef<ModalRef>(null);

	const splitWords = useMemo(
		() =>
			splitStringByCutPositions(wordData.text, wordData.cutPositions).filter((w) => w),
		[wordData],
	);

	return (
		<>
			{splitWords.map((w, i) => (
				<WordItem key={i} index={i} openModal={() => modalRef.current?.open()} text={w} />
			))}

			<Modal variant="animation" ref={modalRef}>
				<SplitWordModal
					wordIndex={index}
					closeModal={() => modalRef.current?.close()}
					wordData={wordData}
				/>
			</Modal>
		</>
	);
}
