import { useImperativeHandle, useRef } from "react";
import useAudioControl from "../_hooks/useAudioControl";
import {
	ExclamationCircleIcon,
	PauseIcon,
	PlayIcon,
} from "@heroicons/react/20/solid";
import { usePlayerContext } from "./PlayerContext";
import { ArrowPathIcon, MusicalNoteIcon } from "@heroicons/react/24/outline";
import uesAudioEffect from "../_hooks/useAudioEffect";
import SongItemCta from "./SongItemCta";

type Props = {
	audioEle: HTMLAudioElement;
};

export default function SongControl({ audioEle }: Props) {
	const { status, controlRef } = usePlayerContext();

	const progressLineRef = useRef<HTMLDivElement>(null);

	uesAudioEffect({ audioEle });
	const { pause, play, handlePlayPause } = useAudioControl({
		audioEle,
		progressLineRef,
	});

	useImperativeHandle(controlRef, () => ({
		pause,
		play,
		handlePlayPause,
	}));

	const renderIcon = () => {
		switch (status) {
			case "playing":
				return <PauseIcon />;
			case "paused":
				return <PlayIcon />;
			case "error":
				return <ExclamationCircleIcon />;
			case "loading":
				return <ArrowPathIcon className="animate-spin" />;

			default:
				return <MusicalNoteIcon />;
		}
	};

	const classes = {
		before: `before:content-[''] before:w-[100%] before:h-3 before:absolute before:bottom-full`,
	};

	return (
		<>
			<div className="flex">
				<button onClick={handlePlayPause} className="[&_svg]:w-7">
					{renderIcon()}
				</button>

				<div className="flex space-x-2 ml-auto">
					<SongItemCta />
				</div>
			</div>
			<div className="h-2 flex items-center mt-3">
				<div
					ref={progressLineRef}
					style={{ backgroundColor: "rgba(255,255,255,.3)" }}
					className={`relative h-1 rounded-full w-full ${classes.before} ${status === "idle" ? "hidden" : ""}`}
				></div>
			</div>
		</>
	);
}
