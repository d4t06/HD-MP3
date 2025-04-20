import { ArrowPathRoundedSquareIcon } from "@heroicons/react/24/outline";
import MobileSongQueue from "./SongQueue";
import { useSelector } from "react-redux";
import { selectSongQueue } from "@/stores/redux/songQueueSlice";
import { useAuthContext } from "@/stores";
import TimerButton from "./TimerButton";
import { getClasses } from "@/utils/appHelpers";
import AddToPlaylistBtn from "./AddToPlaylistBtn";
import HearBtn from "./HeartBtn";
import usePlayerAction from "@/layout/primary-layout/_hooks/usePlayerAction";

export default function ControlMenu() {
	const { user } = useAuthContext();

	const { currentSongData, queueSongs } = useSelector(selectSongQueue);

	const { toggleRepeat, repeat } = usePlayerAction();

	const classes = {
		buttonList: `flex flex-shrink-0 overflow-auto space-x-2 [&_div]:flex [&_div]:w-[70px] [&_div]:flex-col [&_div]:items-center [&_div]:space-y-1.5 [&_div]:text-center [&_button]:p-3.5 [&_button]:bg-white/10 [&_button]:rounded-full [&_button.active]:text-[#198585] [&_span]:text-xs`,
	};

	if (!currentSongData) return;

	return (
		<>
			<div className="h-[70vh] overflow-hidden text-white rounded-[16px_16px_0_0] relative p-3 flex flex-col">
				<div className="bg-opacity-[0.8] backdrop-blur-[15px] z-[-1] bg-[#1f1f1f] absolute inset-0"></div>
				<div className={classes.buttonList}>
					<div>
						<button
							disabled={queueSongs.length <= 1}
							className={`${getClasses(repeat !== "no", "active")}`}
							onClick={toggleRepeat}
						>
							<ArrowPathRoundedSquareIcon className="w-6" />
						</button>
						<span className="break-word">
							{repeat === "one"
								? "Repeat one"
								: repeat === "all"
									? "Repeat all"
									: "Play once"}
						</span>
					</div>

					{user && (
						<>
							<AddToPlaylistBtn song={currentSongData.song} />
							<HearBtn
								song={currentSongData.song}
								isLiked={!!user?.liked_song_ids.includes(currentSongData.song.id)}
							/>
						</>
					)}

					<TimerButton />
				</div>

				<div className="flex-grow overflow-auto mt-3 border-t border-white/60 pt-3">
					{currentSongData && <MobileSongQueue currentIndex={currentSongData.index} />}
				</div>
			</div>
		</>
	);
}
