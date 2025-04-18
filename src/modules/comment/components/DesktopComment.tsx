import { Dispatch, SetStateAction } from "react";
import CommentList from "..";
import { useThemeContext } from "@/stores";

type Props = {
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export default function DesktopComment({ isOpen }: Props) {
	const { theme } = useThemeContext();

	const classes = {
		mainContainer: `hidden fixed w-[300px] md:flex flex-col bottom-[80px] right-[0] top-[0] z-20 px-3 pt-4 ${theme.container} border-l-[1px] border-${theme.alpha} transition-[transform] duration-[.5s] linear delay-100`,
	};

	return (
		<div
			className={`${theme.text_color} ${classes.mainContainer} ${
				isOpen ? "translate-x-0---" : "translate-x-full"
			}     `}
		>
			<CommentList comments={[]} />
		</div>
	);
}
