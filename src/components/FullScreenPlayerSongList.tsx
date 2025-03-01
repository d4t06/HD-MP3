import { useScrollSong } from "@/hooks";
import useFunctionDebounce from "@/hooks/useFunctionDebounce";
import { usePlayerContext, useThemeContext } from "@/stores";
import { Button, LyricsList, SongThumbnail } from ".";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import LyricContextProvider from "@/stores/LyricContext";
import Karaoke from "./Karaoke";
import { selectSongQueue, setCurrentQueueId } from "@/stores/redux/songQueueSlice";
import { useDispatch, useSelector } from "react-redux";
import { useMemo } from "react";

export default function FullScreenPlayerSongList() {
	const dispatch = useDispatch();

	const { activeTab, isOpenFullScreen, idle } = usePlayerContext();

	const { theme } = useThemeContext();
	const { currentSongData } = useSelector(selectSongQueue);

	const { queueSongs, currentQueueId } = useSelector(selectSongQueue);

	// use hooks
	const { activeSongRef, containerRef } = useScrollSong();

	// methods

	const handleSetSongWhenClick = (queueId: string) => {
		if (currentQueueId === queueId) return;
		dispatch(setCurrentQueueId(queueId));
	};

	const handleClickNext = useFunctionDebounce(() => handleScroll("next"), 200);
	const handleClickPrevious = useFunctionDebounce(() => handleScroll("previous"), 200);

	const handleScroll = (direction: string = "next") => {
		const containerEle = containerRef.current as HTMLElement;
		containerEle.style.scrollBehavior = "smooth";

		if (direction === "next") {
			containerEle.scrollLeft += 500;
		} else if (direction === "previous") {
			containerEle.scrollLeft -= 500;
		}
	};

	const classes = {
		songsListTab: ` relative h-full no-scrollbar flex items-center flex-row overflow-auto scroll-smooth px-[calc(50%-350px/2)]`,
		absoluteButton: `absolute top-[50%] -translate-y-[50%] p-[8px] bg-white/30 rounded-full ${theme.content_hover_bg}`,
		lyricTabContainer:
			"px-[40px] min-[1536px]:container  min-[1536px]:px-[200px] h-full flex items-center justify-center flex-row",
		fadeTransition: "opacity-0 transition-opacity duration-[.3s]",
	};

	const renderSongsList = useMemo(() => {
		if (!currentSongData?.song) return;
		if (!queueSongs.length) return;

		return queueSongs.map((song, index) => {
			const isActive = song.queue_id === currentQueueId;
			if (isActive) {
				return (
					<SongThumbnail
						key={index}
						ref={activeSongRef}
						hasTitle
						onClick={() => handleSetSongWhenClick(song.queue_id)}
						active={true}
						data={song}
					/>
				);
			}

			return (
				<SongThumbnail
					key={index}
					idleClass={`${idle ? classes.fadeTransition : ""}`}
					hasTitle
					active={false}
					data={song}
					onClick={() => handleSetSongWhenClick(song.queue_id)}
				/>
			);
		});
	}, [currentSongData?.song, queueSongs, idle]);

	return (
		<>
			{/* song list */}
			<div
				ref={containerRef}
				className={`song-list-container ${classes.songsListTab} ${
					activeTab !== "Songs" ? "opacity-0" : "opacity-100"
				}`}
			>
				{renderSongsList}
			</div>
			{activeTab === "Songs" && !idle && (
				<>
					<Button
						hover={"scale"}
						size={"clear"}
						onClick={() => handleClickPrevious()}
						className={`${classes.absoluteButton} left-[20px]`}
					>
						<ChevronLeftIcon className="w-[30px]" />
					</Button>

					<Button
						hover={"scale"}
						size={"clear"}
						onClick={() => handleClickNext()}
						className={`${classes.absoluteButton} right-[20px]`}
					>
						<ChevronRightIcon className="w-[30px]" />
					</Button>
				</>
			)}

			{/* lyric tab */}
			<LyricContextProvider>
				<div className={`absolute inset-0 z-20 ${activeTab === "Lyric" ? "" : "hidden"}`}>
					{/* {renderLyricTab} */}
					<div className={classes.lyricTabContainer}>
						{/* left */}
						<SongThumbnail active={true} data={currentSongData?.song} />

						{/* right */}
						<LyricsList
							className={`w-full ml-[40px] h-full`}
							active={isOpenFullScreen && activeTab === "Lyric"}
						/>
					</div>
				</div>
				<div
					className={`absolute inset-0 z-20 flex flex-col items-center justify-center ${
						activeTab === "Karaoke" ? "" : "hidden"
					}`}
				>
					<Karaoke active={isOpenFullScreen && activeTab === "Karaoke"} />
				</div>
			</LyricContextProvider>
		</>
	);
}
