import { ReactNode } from "react";

export default function ButtonCtaFrame({
	children,
	className = "",
}: {
	children: ReactNode;
	className?: string;
}) {
	return (
		<div
			className={`-ml-2 -mt-2 flex flex-wrap [&_button]:mt-2 [&_button]:ml-2 [&_button:not(.except)]:p-1.5 [&_svg]:w-5 [&_svg]:flex-shrink-0 md:[&_button:not(.except)]:px-3 ${className} `}
		>
			{children}
		</div>
	);
}
