import { MyTooltip } from "@/components";
import { useCommentContext } from "@/modules/comment/components/CommentContext";
import DesktopComment from "@/modules/comment/components/DesktopComment";
import SongComment from "@/modules/comment/components/SongComment";
import UserInput from "@/modules/comment/components/UserInput";
import { useThemeContext } from "@/stores";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import { createPortal } from "react-dom";

type Props = {
	song: Song;
};

export default function CommentButton({ song }: Props) {
	const { theme } = useThemeContext();
	const { setIsOpenComment } = useCommentContext();

	const classes = {
		button: `w-[38px] h-[38px] bg-white/10 rounded-[99px] transition-transform ${theme.content_hover_bg}`,
	};

	return (
		<>
			<MyTooltip position="top-[calc(100%+8px)]" content="Comment">
				<button
					onClick={() => setIsOpenComment(true)}
					className={`p-2 ${classes.button}`}
				>
					<ChatBubbleLeftRightIcon />
				</button>
			</MyTooltip>

			{createPortal(
				<DesktopComment themeType="dark">
					<SongComment />

					<UserInput variant="comment" targetId={song.id} />
				</DesktopComment>,
				document.getElementById("portals")!,
			)}
		</>
	);
}
