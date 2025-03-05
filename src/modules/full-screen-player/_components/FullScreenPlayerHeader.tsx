import { usePlayerContext, useThemeContext } from "@/stores";
import { selectSongQueue } from "@/stores/redux/songQueueSlice";
import { useSelector } from "react-redux";
import {
	ChevronDownIcon,
	Cog6ToothIcon,
	DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { FullScreenPlayerSetting, MyPopup, MyPopupContent, MyPopupTrigger, MyTooltip, Tabs } from "@/components";

export default function FullScreenPlayerHeader() {
	const { theme } = useThemeContext();
	const { activeTab, setActiveTab, idle, setIsOpenFullScreen } = usePlayerContext();

	const { currentSongData } = useSelector(selectSongQueue);

	const navigate = useNavigate();

	/** navigate to edit lyric page */
	const handleEdit = () => {
		if (!currentSongData?.song) return;
		setIsOpenFullScreen(false);

		setTimeout(() => {
			navigate(`/mysongs/edit/${currentSongData?.song.id}`);
		}, 300);
	};

	const classes = {
		button: `w-[38px] h-[38px] bg-white/10 rounded-[99px] transition-transform ${theme.content_hover_bg}`,
		headerWrapper: `relative flex py-[25px] px-[40px] w-full items-center`,
		fadeTransition: "opacity-0 transition-opacity duration-[.3s]",
	};

	return (
		<div className={classes.headerWrapper}>
			{/* left */}
			{idle && (
				<div className={`absolute flex left-4`}>
					{activeTab !== "Songs" && (
						<>
							<p className={`font-playwriteCU text-sm`}>
								{currentSongData?.song?.name || "..."}{" "}
							</p>
							<p className="opacity-70">
								&nbsp;- {currentSongData?.song?.singer || "..."}
							</p>
						</>
					)}
				</div>
			)}
			{/* tabs */}
			<Tabs
				inFullScreen
				activeTab={activeTab}
				setActiveTab={setActiveTab}
				className={`${idle && classes.fadeTransition}`}
				tabs={["Songs", "Karaoke", "Lyric"]}
				render={(tab) => tab}
			/>
			{/* right */}
			<div
				className={`absolute flex right-4 space-x-3 ${idle && classes.fadeTransition}`}
			>
				{activeTab === "Lyric" && (
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
	);
}
