import { useTheme } from "@/store";
import { ReactNode } from "react";

type Props = {
	className?: string;
	children: ReactNode;
};

export function MenuWrapper({ children, className = "py-2" }: Props) {
	const { theme } = useTheme();

	return (
		<div className={`rounded-md ${theme.modal_bg} text-white ${className}`}>
			{children}
		</div>
	);
}

export function MenuList({ children, className = "" }: Props) {
	const classes = {
		container:
			"[&>*]:px-3 [&>*]:w-full [&>*]:py-2 [&>*]:w-full [&>*]:space-x-1 [&>*]:text-sm [&>*]:flex [&>*]:items-center hover:[&>*:not(div.absolute)]:bg-white/5",
	};

	return <div className={`${classes.container} ${className}`}>{children}</div>;
}
