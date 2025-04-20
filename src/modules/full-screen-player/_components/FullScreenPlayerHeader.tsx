import { useAuthContext, usePlayerContext, useThemeContext } from "@/stores";
import { selectSongQueue } from "@/stores/redux/songQueueSlice";
import { useSelector } from "react-redux";
import {
	ChatBubbleLeftRightIcon,
	ChevronDownIcon,
	Cog6ToothIcon,
	DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import {
	Button,
	FullScreenPlayerSetting,
	MyPopup,
	MyPopupContent,
	MyPopupTrigger,
	MyTooltip,
} from "@/components";
import FullScreenPlayerTab from "./Tabs";
import { useState } from "react";
import SongComment from "@/modules/comment/components/SongComment";

export default function FullScreenPlayerHeader() {
	const { user } = useAuthContext();
	const { theme } = useThemeContext();
	const { activeTab, idle, setIsOpenFullScreen } = usePlayerContext();

	const { currentSongData } = useSelector(selectSongQueue);

	const [isOpenComment, setIsOpenComment] = useState(false);

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
		button: `w-[38px] h-[38px] bg-white/10 rounded-[99px] transition-transform ${theme.content_hover_bg}`,
		headerWrapper: `relative flex py-[25px] px-[40px] w-full items-center`,
		fadeTransition: "opacity-0 transition-opacity duration-[.3s]",
	};

	return (
		<>
			<SongComment isOpen={isOpenComment} setIsOpen={setIsOpenComment} />

			<div className={`${classes.headerWrapper} ${idle ? "pointer-events-none" : ""}`}>
				{/* left */}
				{idle && currentSongData && (
					<div className={`absolute left-4`}>
						{activeTab !== "Songs" && (
							<>
								<p className={`font-playwriteCU text-sm`}>{currentSongData.song.name}</p>
								<p className="opacity-70 text-sm">
									{currentSongData.song.singers.map((s, i) => (i ? ", " : "") + s.name)}
								</p>
							</>
						)}
					</div>
				)}
				{/* tabs */}
				<FullScreenPlayerTab />

				{/* right */}
				<div
					className={`absolute flex right-4 space-x-3 ${idle && classes.fadeTransition}`}
				>
					<MyTooltip position="top-[calc(100%+8px)]" content="Comment">
						<button onClick={() => setIsOpenComment(true)} className={`p-2 ${classes.button}`}>
							<ChatBubbleLeftRightIcon />
						</button>
					</MyTooltip>

					{isOwnSong && activeTab === "Lyric" && (
						<MyTooltip position="top-[calc(100%+8px)]" content="Edit lyric">
							<button onClick={() => handleEdit()} className={`p-2 ${classes.button}`}>
								<DocumentTextIcon />
							</button>
						</MyTooltip>
					)}

					<MyPopup>
						<MyPopupTrigger>
							<MyTooltip position="top-[calc(100%+8px)]" content="Setting">
								<button className={`${classes.button} p-2`}>
									<Cog6ToothIcon />
								</button>
							</MyTooltip>
						</MyPopupTrigger>
						<MyPopupContent
							appendTo="parent"
							className="top-[calc(100%+8px)] right-0 z-[99]"
							animationClassName="origin-top-right"
						>
							<FullScreenPlayerSetting />
						</MyPopupContent>
					</MyPopup>

					<MyTooltip position="top-[calc(100%+8px)]" content="Close">
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
