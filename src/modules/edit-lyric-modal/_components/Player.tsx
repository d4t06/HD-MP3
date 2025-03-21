import usePlayer from "../_hooks/usePlayer";
import { useEffect } from "react";
import { useLyricEditorContext } from "./LyricEditorContext";

type Props = {
	audioEle: HTMLAudioElement;
};

export default function EditLyricModalPlayler({ audioEle }: Props) {
	const { playerRef } = useLyricEditorContext();
	const { _play, _pause, handlePlayPause } = usePlayer({ audioEle });

	useEffect(() => {
		playerRef.current = {
			handlePlayPause,
			pause: _pause,
			play: _play,
		};
	}, []);

	return <></>;
}

// export default forwardRef(EditLyricModalPlayler);
