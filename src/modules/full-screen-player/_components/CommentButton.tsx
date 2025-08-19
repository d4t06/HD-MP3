import { MyTooltip } from "@/components";
import { useCommentContext } from "@/modules/comment/components/CommentContext";
import FullScreenComment from "@/modules/comment/components/FullScreenComment";
import SongComment from "@/modules/comment/components/SongComment";
import UserInput from "@/modules/comment/components/UserInput";
import { useAuthContext, usePlayerContext } from "@/stores";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import { useEffect } from "react";
import { createPortal } from "react-dom";

type Props = {
	song: Song;
};

export default function CommentButton({ song }: Props) {
	const { setIsOpenComment, isOpenComment } = useCommentContext();
	const { isOpenFullScreen } = usePlayerContext();
	const { user } = useAuthContext();

	useEffect(() => {
		if (!isOpenFullScreen && isOpenComment) setIsOpenComment(false);
	}, [isOpenFullScreen]);

	return (
		<>
			<MyTooltip
				colorClasses="bg-[#333] text-white"
				position="top-[calc(100%+8px)]"
				content="Comment"
			>
				<button onClick={() => setIsOpenComment(true)} className={`btn`}>
					<ChatBubbleLeftRightIcon />
				</button>
			</MyTooltip>

			{createPortal(
				<FullScreenComment>
					<SongComment />

					{user && <UserInput variant="comment" targetId={song.id} />}
				</FullScreenComment>,
				document.getElementById("portals")!,
			)}
		</>
	);
}
