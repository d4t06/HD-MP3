import SongComment from "./SongComment";
import { useThemeContext } from "@/stores";
import { useCommentContext } from "./CommemtContext";

export default function MobileSongComment() {
	const { theme } = useThemeContext();

	const { isOpenComment } = useCommentContext();

	const classes = {
		mainContainer: `hidden fixed w-[300px] md:flex flex-col bottom-0 right-[0] top-0 z-20 px-3 pt-4 ${theme.container} border-l-[1px] border-${theme.alpha} transition-[transform] duration-[.5s] linear delay-100`,
	};

	return (
		<div
			className={`${theme.text_color} ${classes.mainContainer} ${
				isOpenComment ? "translate-x-0---" : "translate-x-full"
			}     `}
		>
			<SongComment />
		</div>
	);
}
