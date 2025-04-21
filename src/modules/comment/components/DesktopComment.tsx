import { useThemeContext } from "@/stores";
import { useCommentContext } from "./CommemtContext";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { ReactNode } from "react";

type Props = {
	themeType: "dark" | "theme";
	children?: ReactNode;
};

export default function DesktopComment({ themeType, children }: Props) {
	const { theme } = useThemeContext();

	const { isOpenComment, setIsOpenComment } = useCommentContext();

	const bgColor = themeType === "dark" ? "bg-[#1f1f1f]" : theme.container;

	const classes = {
		mainContainer: `hidden fixed w-[400px] md:flex flex-col bottom-0 right-[0] top-0 z-[99] p-3 pb-5 text-white border-l-[1px] border-${theme.alpha} transition-[transform] duration-[.5s] linear delay-100`,
	};

	return (
		<div
			className={`${theme.text_color} ${classes.mainContainer} ${
				isOpenComment ? "translate-x-0---" : "translate-x-full"
			}     `}
		>
			<div
				className={`bg-opacity-[0.8] backdrop-blur-[15px] z-[-1] ${bgColor} absolute inset-0`}
			></div>

			<p>
				<button className="p-1.5" onClick={() => setIsOpenComment(false)}>
					<XMarkIcon className="w-7" />
				</button>
			</p>

			{children}
		</div>
	);

	// return (
	// 	<>
	// 		{createPortal(
	// 			,
	// 			document.getElementById("portals")!,
	// 		)}
	// 	</>
	// );
}
