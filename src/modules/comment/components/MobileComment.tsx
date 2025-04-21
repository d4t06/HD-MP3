import { ReactNode } from "react";

type Props = {
	children?: ReactNode;
};

export default function MobileComment({ children }: Props) {
	return (
		<div className="h-[70vh] overflow-hidden text-white rounded-[16px_16px_0_0] relative p-3 flex flex-col">
			<div
				className={`bg-opacity-[0.8] bg-[#1f1f1f] backdrop-blur-[15px] z-[-1] absolute inset-0`}
			></div>

			{children}
		</div>
	);
}
