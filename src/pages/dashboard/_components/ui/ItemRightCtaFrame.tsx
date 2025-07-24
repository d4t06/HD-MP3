import { ReactNode } from "react";

type Props = {
	children: ReactNode;
	className?: string;
};

export default function ItemRightCtaFrame({ children, className = "" }: Props) {
	const classes = `mt-2 ml-2 flex px-3 py-1.5 text-sm rounded-lg bg-[#fff] border-[2px] border-[#e1e1e1] [&>div]:ml-1.5 [&>div]:pl-1.5 [&>div]:border [&>div]:border-transparent [&>div]:flex [&>div]:space-x-1 [&>div]:border-l-black/10 hover:[&_button]:scale-[1.05] ${className}`;

	return <div className={classes}>{children}</div>;
}
