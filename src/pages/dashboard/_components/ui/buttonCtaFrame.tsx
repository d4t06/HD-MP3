import { ReactNode } from "react";

export default function ButtonCtaFrame({ children }: { children: ReactNode }) {
	return (
		<div className="-ml-2 -mt-2 [&_button]:mt-2 [&_button]:ml-2 [&_button]:p-1.5 md:[&_button]:px-3  [&_span]:hidden md:[&_span]:block">
			{children}
		</div>
	);
}
