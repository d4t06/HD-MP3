type Props = {
	rank: number;
	className?: string;
};

export default function RankNumber({ rank, className = "" }: Props) {
	return (
		<div
			className={`song-index font-bold w-[50px] leading-[54px] flex-shrink-0 text-center text-[32px] ${rank <= 3 ? "is-top-" + rank : ""} ${className}`}
		>
			{rank}
		</div>
	);
}
