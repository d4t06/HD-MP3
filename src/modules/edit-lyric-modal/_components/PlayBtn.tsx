import { Button } from "@/components";
import { PauseIcon, PlayIcon } from "@heroicons/react/20/solid";
import { useLyricEditorContext } from "./LyricEditorContext";

export default function PlayBtn() {
	const { status, playerRef } = useLyricEditorContext();

	return (
		<Button
			size={"clear"}
			className="p-1.5"
			onClick={() => playerRef.current?.handlePlayPause()}
			color="primary"
		>
			{status === "playing" ? (
				<PauseIcon className="w-6" />
			) : (
				<PlayIcon className="w-6" />
			)}
		</Button>
	);
}
