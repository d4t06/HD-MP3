import { useMemo } from "react";
import { triangleIcon } from "@/assets/icon";

type Props = {
	song: Song;
};

export default function SongRankDiff({ song }: Props) {
	const factor = useMemo(() => song.last_week_rank - song.rank, []);

	const content = () => {
		if (!song.last_week_rank || !factor) return "-";

		return (
			<>
				<span
					className={`w-3 ${factor > 0 ? "text-[#1dc186]" : "text-[#e35050] rotate-180"}`}
				>
					{triangleIcon}
				</span>

				<span className="font-bold text-sm">{Math.abs(factor)}</span>
			</>
		);
	};

	return (
		<div className="flex flex-col w-4 justify-center items-center mr-4 flex-shrink-0">
			{content()}
		</div>
	);
}
