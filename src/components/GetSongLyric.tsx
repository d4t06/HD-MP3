import { useGetSongLyric } from "@/hooks";
import { ReactNode } from "react";

type Props = {
	isOpenLyricTabs: boolean;
	children: ReactNode;
};

export default function GetSongLyric({ isOpenLyricTabs, children }: Props) {
	useGetSongLyric({
		active: isOpenLyricTabs,
	});

	return children;
}
