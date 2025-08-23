import { ReactNode } from "react";

type Props = {
	className?: string;
	children: ReactNode;
};

export default function RatioFrame({ children, className = "" }: Props) {
	return (
		<div className={`relative ${className}`}>
			<div className="absolute inset-0">{children}</div>
		</div>
	);
}
