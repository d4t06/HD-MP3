import { AudioSetting } from "@/components";
import Tab from "@/components/Tab";
// import { FireIcon, PauseIcon, PlayIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useLyricEditorContext } from "./LyricEditorContext";
import EditLyricModalPlayler from "./Player";
// import usePlayer from "../_hooks/usePlayer";
// import { useEffect } from "react";
// import { useLyricEditorContext } from "./LyricEditorContext";

type Props = {
	audioEle: HTMLAudioElement;
};

export default function Header({ audioEle }: Props) {
	const { tabProps } = useLyricEditorContext();

	return (
		<>
			<EditLyricModalPlayler audioEle={audioEle} />

			<div className="flex items-center justify-between">
				<div className="bg-black/10 p-1 rounded-full [&>button]:border-none">
					<Tab {...tabProps} render={(t) => t} />
				</div>

				<AudioSetting
					className="bg-transparent hover:bg-black/10 p-1"
					audioEle={audioEle}
					postLocalStorageKey="edit_lyric_tune"
				/>
			</div>
		</>
	);
}
