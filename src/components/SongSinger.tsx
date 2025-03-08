import { ReactNode } from "react";

type Props = {
	singers: Singer[];
	className?: string;
	render: (s: Singer, i: number) => ReactNode;
};

export default function SongSinger({ singers, render }: Props) {
	return singers.map((s, i) => render(s, i));
}
