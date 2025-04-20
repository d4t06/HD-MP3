import { formatTime } from "@/utils/appHelpers";

// import { forwardRef} from "react";
import MenuButton from "./MenuBtn";
import PlayBtn from "./PlayBtn";
import usePlayerAction from "@/layout/primary-layout/_hooks/usePlayerAction";
import { usePlayerContext } from "@/stores";
import { useSelector } from "react-redux";
import { selectAllPlayStatusStore } from "@/stores/redux/PlayStatusSlice";
import { selectSongQueue } from "@/stores/redux/songQueueSlice";
import CommnetProvider from "@/modules/comment/components/CommemtContext";

// export type ControlRef = {
// 	handlePlayPause: () => void;
// 	handleNext: () => void;
// 	pause: () => void;
// 	resetForNewSong: () => void;
// };

export default function MobileFullScreenControl() {
	const { timelineEleRef, currentTimeEleRef } = usePlayerContext();

	const { playStatus } = useSelector(selectAllPlayStatusStore);
	const { currentSongData } = useSelector(selectSongQueue);

	const { handleSeek, handlePlayPause } = usePlayerAction();

	const classes = {
		buttonsContainer: `w-full flex items-center justify-between space-x-2 mt-2`,
		progressContainer: `flex w-full flex-row items-center `,
		processLineBase: `h-1 flex-grow relative rounded-[99px] shadow-[2px_2px_10px_rgba(0,0,0,.15)] `,
		before: `before:content-[''] before:w-[100%] before:h-[24px] before:absolute before:top-[50%] before:translate-y-[-50%]`,
	};

	return (
		<>
			{/* process */}
			<div
				className={`${classes.progressContainer}  ${playStatus === "error" || playStatus === "loading" ? "disable" : ""}`}
			>
				<div className="w-[44px] sm:w-9">
					<span ref={currentTimeEleRef} className={`text-lg sm:text-sm`}>
						0:00
					</span>
				</div>
				<div
					ref={timelineEleRef}
					style={{ background: "rgba(255, 255, 255, 0.3)" }}
					onClick={(e) => handleSeek(e)}
					className={`${classes.processLineBase} ${false ? "disable" : ""} ${
						classes.before
					}`}
				></div>
				<div className="w-[44px] sm:w-9 text-right">
					<span className={"text-lg sm:text-sm"}>
						{currentSongData?.song ? formatTime(currentSongData.song?.duration) : "0:00"}
					</span>
				</div>
			</div>

			{/* buttons */}
			<div className={`${classes.buttonsContainer}`}>
				<PlayBtn playStatus={playStatus} handlePlayPause={handlePlayPause} />

				<CommnetProvider target="song">
					<MenuButton />
				</CommnetProvider>
			</div>
		</>
	);
}

// export default forwardRef(MobileFullScreenControl);
