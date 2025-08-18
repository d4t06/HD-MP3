import { ReactNode, useEffect, useRef } from "react";
import { usePopoverContext } from "./PopupContext";

type Props = {
	className?: string;
	children: ReactNode;
	cb?: () => void;
};

export default function DismisPopupWrapper({
	children,
	className = "",
	cb,
}: Props) {
	const { close } = usePopoverContext();

	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!containerRef.current) return;

		const buttons = containerRef.current.querySelectorAll("button");

		const handleClose  = () => {
			close();
			cb && cb()
		}

		buttons.forEach((ele) => {
			ele.addEventListener("click", handleClose);
		});

		return () => {
			if (buttons)
				buttons.forEach((ele) => {
					ele.removeEventListener("click", handleClose);
				});
		};
	}, []);

	return (
		<div ref={containerRef} className={`${className}`}>
			{children}
		</div>
	);
}
