import WordGroup from "./WordGroup";
import { useEditLyricContext } from "@/modules/lyric-editor/_components/EditLyricContext";

export default function WordList() {
	const { currentLyricWordsData } = useEditLyricContext();

	return (
		<div className="flex h-[44px] mt-5">
			{currentLyricWordsData.map((data, i) => (
				<WordGroup key={i} wordData={data} index={i} />
			))}
		</div>
	);
}
