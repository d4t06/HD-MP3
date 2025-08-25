import { useAuthContext, usePlayerContext } from "@/stores";
import { selectSongQueue } from "@/stores/redux/songQueueSlice";
import { useSelector } from "react-redux";
import {
	ChevronDownIcon,
	Cog6ToothIcon,
	DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import {
	FullScreenPlayerSetting,
	MyPopup,
	MyPopupContent,
	MyPopupTrigger,
	MyTooltip,
} from "@/components";
import FullScreenPlayerTab from "./Tabs";
import CommnentButton from "./CommentButton";
import CommentProvider from "@/modules/comment/components/CommentContext";

export default function FullScreenPlayerHeader() {
	const { user } = useAuthContext();
	const { activeTab, idle, setIsOpenFullScreen } = usePlayerContext();

	const { currentSongData } = useSelector(selectSongQueue);

	const navigate = useNavigate();

	const isOwnSong = currentSongData
		? user
			? currentSongData.song.owner_email === user.email &&
				currentSongData.song.is_official === false
			: false
		: false;

	/** navigate to edit lyric page */
	const handleEdit = () => {
		if (!currentSongData?.song) return;
		setIsOpenFullScreen(false);

		setTimeout(() => {
			navigate(`/my-music/lyric/${currentSongData?.song.id}`);
		}, 300);
	};

	const classes = {
		button: `btn`,
		rightCta:
			"absolute flex right-4 space-x-3 [&_button.btn]:h-[38px] [&_button.btn]:w-[38px] hover:[&_button.btn]:bg-white/5 [&_button.btn]:p-2 [&_button.btn]:rounded-full",
		headerWrapper: `relative z-[90] flex py-[25px] px-[40px] w-full items-center`,
		fadeTransition: "opacity-0 transition-opacity duration-[.3s]",
	};

	return (
		<>
			<div
				className={`${classes.headerWrapper} ${idle ? "pointer-events-none" : ""}`}
			>
				{/* left */}
				{idle && currentSongData && (
					<div className={`absolute left-4 text-sm`}>
						{activeTab !== "Songs" && (
							<>
								<p>{currentSongData.song.name}</p>
								<p className="opacity-70">
									{currentSongData.song.singers.map(
										(s, i) => (i ? ", " : "") + s.name,
									)}
								</p>
							</>
						)}
					</div>
				)}
				{/* tabs */}
				<FullScreenPlayerTab />

				{/* right */}
				<div
					className={`absolute flex right-4 space-x-3 ${idle && classes.fadeTransition} ${classes.rightCta}`}
				>
					<CommentProvider target="song">
						{currentSongData?.song && (
							<CommnentButton song={currentSongData.song} />
						)}
					</CommentProvider>

					{isOwnSong && activeTab === "Lyric" && (
						<MyTooltip
							colorClasses="bg-[#333] text-white"
							position="top-[calc(100%+8px)]"
							content="Edit lyric"
						>
							<button
								onClick={() => handleEdit()}
								className={` ${classes.button}`}
							>
								<DocumentTextIcon />
							</button>
						</MyTooltip>
					)}

					<MyPopup>
						<MyPopupTrigger>
							<MyTooltip
								colorClasses="bg-[#333] text-white"
								isWrapped={true}
								position="top-[calc(100%+8px)]"
								content="Setting"
							>
								<button className={`${classes.button} `}>
									<Cog6ToothIcon />
								</button>
							</MyTooltip>
						</MyPopupTrigger>
						<MyPopupContent
							className="top-[calc(100%+8px)] right-0"
							animationClassName="origin-top-right"
						>
							<FullScreenPlayerSetting />
						</MyPopupContent>
					</MyPopup>

					<MyTooltip
						colorClasses="bg-[#333] text-white"
						position="top-[calc(100%+8px)]"
						content="Close"
					>
						<button
							onClick={() => setIsOpenFullScreen(false)}
							className={`p-2 ${classes.button}`}
						>
							<ChevronDownIcon />
						</button>
					</MyTooltip>
				</div>
			</div>
		</>
	);
}
