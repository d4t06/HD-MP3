import { Button, Title } from "@/components";
import { useEditLyricContext } from "@/modules/lyric-editor/_components/EditLyricContext";
import { useThemeContext } from "@/stores";
import { splitStringByCutPositions } from "@/utils/lyricEditorHelper";
import { ScissorsIcon } from "@heroicons/react/24/outline";
import { useMemo, useState } from "react";

type Props = {
	wordData: { text: string; cutPositions: number[] };
	wordIndex: number;
	closeModal: () => void;
};

export default function SplitWordModal({ wordData, wordIndex, closeModal }: Props) {
	const { theme } = useThemeContext();
	const { updateLyric, currentLyric, selectLyricIndex } = useEditLyricContext();

	const [localCutPositions, setLocalCutPosition] = useState(wordData.cutPositions);

	const localSplitWords = useMemo(
		() => splitStringByCutPositions(wordData.text, localCutPositions).filter((w) => w),
		[localCutPositions],
	);

	const characters = useMemo(() => wordData.text.split(""), []);

	const splitWord = (index: number) => {
		const newCutPositons = [...localCutPositions];

		const foundedIndex = localCutPositions.findIndex((i) => i === index);

		if (foundedIndex === -1) {
			newCutPositons.push(index);
		} else newCutPositons.splice(foundedIndex, 1);

		setLocalCutPosition(newCutPositons);
	};

	const apply = () => {
		if (!currentLyric || selectLyricIndex === undefined) return;

		const sortedNewCutPositions = localCutPositions.sort((a, b) => a - b);

		const newTextCutPositons = [...currentLyric.cutData];
		newTextCutPositons[wordIndex] = sortedNewCutPositions;

		const newLyricData: Partial<RealTimeLyric> = {
			cutData: newTextCutPositons,
		};

		updateLyric(selectLyricIndex, newLyricData);
		closeModal();
	};

	return (
		<div className="w-[500px] max-w-[90vw]">
			<Title title="Split word " />
			<div className="flex justify-center space-x-5">
				{localSplitWords.map((w, i) => (
					<span key={i} className="text-xl md:text-2xl font-[700]">
						{w}
					</span>
				))}
			</div>

			<div className="mt-3 flex justify-center">
				{characters.map((c, i) => {
					const isSplited = localCutPositions.includes(i);

					return (
						<div key={i}>
							{characters.length > 1 && !!i ? (
								<button
									onClick={() => splitWord(i)}
									className={` p-1 rounded-full ${isSplited ? theme.content_bg : "hover:bg-black/10"}`}
								>
									<ScissorsIcon className="w-5" />
								</button>
							) : (
								""
							)}
							<span className="text-[50px] font-[500]">{c}</span>
						</div>
					);
				})}
			</div>

			<p className="mt-5 text-right">
				<Button onClick={apply} color="primary" className="font-playwireCU">
					OK
				</Button>
			</p>
		</div>
	);
}
