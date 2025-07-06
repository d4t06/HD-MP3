import { useMemo } from "react";

type Props = {
	select: () => void;
	index: number;
};

export default function ChooseBtn({ select, index }: Props) {
	const isInChooseList = useMemo(() => index !== -1, [index]);

	return (
		<>
			<button
				onClick={select}
				className={`${
					isInChooseList ? "bg-[#cd1818] " : "bg-[#ccc] hover:bg-[#cd1818]"
				} z-10 h-[24px] w-[24px] absolute rounded-[6px] text-[white] left-[10px] bottom-[10px]`}
			>
				{isInChooseList && (
					<span className="text-[18px] font-semibold leading-[1]">
						{index + 1}
					</span>
				)}
			</button>
		</>
	);
}
