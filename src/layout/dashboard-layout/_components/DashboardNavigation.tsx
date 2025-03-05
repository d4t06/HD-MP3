import { useEffect, useRef, useState } from "react";
import { routeList } from "../DashboardSidebar";
import { Link } from "react-router-dom";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { useThemeContext } from "@/stores";

export default function DashboardNavigation() {
	const { theme } = useThemeContext();

	const [isOpen, setIsOpen] = useState(false);

	const buttonRef = useRef<HTMLButtonElement>(null);

	const handleWindowClick: EventListener = (e) => {
		if (buttonRef.current?.contains(e.target as Node)) return;
		setIsOpen(false);
	};

	useEffect(() => {
		if (isOpen) window.addEventListener("click", handleWindowClick);

		return () => {
			window.removeEventListener("click", handleWindowClick);
		};
	}, [isOpen]);

	return (
		<>
			<div
				className={`${theme.side_bar_bg} absolute flex duration-[.25] flex-col
				transition-[left,opacity] bottom-[80px] px-2 py-1 rounded-lg 
				${
					isOpen
						? "left-[10px] opacity-[1] pointer-events-auto"
						: "left-0 opacity-[0] pointer-events-none"
				}`}
			>
				{routeList.map((r, i) => (
					<Link key={i} className={`inline-flex py-1.5 space-x-1`} to={r.path}>
						{r.icon}
						<span>{r.title}</span>
					</Link>
				))}
			</div>

			<button
				ref={buttonRef}
				onClick={() => setIsOpen(!isOpen)}
				className={`${theme.content_bg} rounded-full absolute bottom-5 left-[10px] p-2`}
			>
				<Bars3Icon className="w-6" />
			</button>
		</>
	);
}
