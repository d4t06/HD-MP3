
import { ReactNode, useEffect, useRef } from "react";
import { usePopoverContext } from "./PopupContext";

type Props = {
	className?: string;
	children: ReactNode;
};

export default function DismisPopupWrapper({
	children,
	className = "",
}: Props) {
	const { close } = usePopoverContext();

	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!containerRef.current) return;

		const buttons = containerRef.current.querySelectorAll("button");

		buttons.forEach((ele) => {
			ele.addEventListener("click", close);
		});

		return () => {
			if (buttons)
				buttons.forEach((ele) => {
					ele.removeEventListener("click", close);
				});
		};
	}, []);

	return <div ref={containerRef} className={`${className}`}>{children}</div>;
}
