import { useCommentContext } from "./CommentContext";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { ReactNode } from "react";

type Props = {
	children?: ReactNode;
};

export default function FullScreenComment({ children }: Props) {
	const { isOpenComment, setIsOpenComment } = useCommentContext();

	const classes = {
		mainContainer: `hidden fixed w-[400px] md:flex flex-col bottom-0 right-[0] top-0 z-[99] p-3 pb-5 text-white border-l-[1px] border-[--a-5-cl] transition-[transform] duration-[.5s] linear delay-100`,
	};

	return (
		<div
			className={`text-white ${classes.mainContainer} ${
				isOpenComment ? "translate-x-0" : "translate-x-full"
			}     `}
		>
			<div
				className={`bg-opacity-[0.8] backdrop-blur-[15px] z-[-1] bg-[#333] absolute inset-0`}
			></div>

			<p>
				<button className="p-1.5" onClick={() => setIsOpenComment(false)}>
					<XMarkIcon className="w-7" />
				</button>
			</p>

			{children}
		</div>
	);
}
