import {
	Button,
	Label,
	Modal,
	ModalContentWrapper,
	ModalHeader,
	ModalRef,
} from "@/components";
import { useRef } from "react";
import { useLyricEditorContext } from "./LyricEditorContext";
import { useEditLyricContext } from "@/modules/lyric-editor/_components/EditLyricContext";

export default function SplitBtn() {
	const { currentWords } = useLyricEditorContext();
	const { currentLyric, lyrics, setLyrics, selectLyricIndex } =
		useEditLyricContext();

	const modalRef = useRef<ModalRef | null>(null);

	const handleSplitLyric = (index: number) => {
		if (!currentLyric || selectLyricIndex === undefined) return;

		const newLyrics = [...lyrics];

		const newWords = [...currentWords];

		// const newLyric = structuredClone(currentLyric);
		const newLyric = JSON.parse(JSON.stringify(currentLyric));

		// prettier-ignore
		const part1End =
			 +(newLyric.start + (newLyric.end - newLyric.start) / 2).toFixed(1);

		const part1: Lyric = {
			text: newWords.splice(0, index).join(" "),
			cut: newLyric.cut.splice(0, index),
			tune: {
				start: newLyric.start,
				grow: newLyric.tune.grow.splice(0, index),
				end: part1End,
			},
			start: newLyric.start,
			end: part1End,
		};

		const part2: Lyric = {
			text: newWords.join(" "),
			cut: newLyric.cut,
			tune: {
				start: part1End,
				grow: newLyric.tune.grow,
				end: newLyric.end,
			},
			start: part1End,
			end: newLyric.end,
		};

		newLyrics[selectLyricIndex] = part1;
		newLyrics.splice(selectLyricIndex + 1, 0, part2);

		setLyrics(newLyrics);

		modalRef.current?.close();
	};

	return (
		<>
			<Button
				onClick={() => modalRef.current?.open()}
				size={"clear"}
				className="p-1.5"
				color="primary"
			>
				{/*<ScissorsIcon className="w-6" />*/}

				<svg
					viewBox="0 0 15 15"
					fill="none"
					className="w-6"
					xmlns="http://www.w3.org/2000/svg"
					stroke="currentColor"
					strokeWidth="1"
				>
					<g strokeWidth="0"></g>
					<g strokeLinecap="round" strokeLinejoin="round"></g>
					<g>
						<path
							d="M1.5 11V6.5C1.5 5.39543 2.39543 4.5 3.5 4.5C4.60457 4.5 5.5 5.39543 5.5 6.5V11M1.5 8.5H5.5M12 7.5H9.5M12 7.5C12.8284 7.5 13.5 6.82843 13.5 6C13.5 5.17157 12.8284 4.5 12 4.5H9.5V7.5M12 7.5C12.8284 7.5 13.5 8.17157 13.5 9C13.5 9.82843 12.8284 10.5 12 10.5H9.5V7.5M7.5 1V14"
							stroke="currentColor"
						></path>
					</g>
				</svg>
			</Button>

			<Modal variant="animation" ref={modalRef}>
				<ModalContentWrapper>
					<ModalHeader
						title="Split lyric"
						closeModal={() => modalRef.current?.close()}
					/>
					<Label>Choose where to start the next lyric</Label>
					<div className="flex flex-wrap mt-5">
						{currentWords.map((w, i) => (
							<button
								onClick={() => handleSplitLyric(i)}
								className="bg-[--a-5-cl] p-1.5 rounded-full"
								key={i}
							>
								{w}
							</button>
						))}
					</div>
				</ModalContentWrapper>
			</Modal>
		</>
	);
}
