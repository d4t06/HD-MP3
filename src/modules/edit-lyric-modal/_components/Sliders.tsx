import { useEditLyricContext } from "@/modules/lyric-editor/_components/EditLyricContext";
import { useLyricEditorContext } from "./LyricEditorContext";
import useSlider from "../_hooks/useSlider";

export default function Sliders() {
	const { setStartPoint, setEndPoint, endTimeRangeProps, handleGrowWord } = useSlider();

	const { currentLyric } = useEditLyricContext();
	const { wordIndex, growList, eleRefs } = useLyricEditorContext();

	if (!currentLyric) return <></>;

	return (
		<div>
			<div className="flex items-center mt-5 space-x-2">
				<label htmlFor="start" className="flex-shrink-0 w-[150px]">
					Start:&nbsp;
					<span ref={eleRefs.startRefText}></span>
				</label>

				<input
					ref={eleRefs.startTimeRangeRef}
					type="range"
					id="start"
					min={currentLyric.start}
					max={currentLyric.end}
					step={0.2}
					className="w-full"
					onChange={(e) => setStartPoint(+e.target.value)}
				/>
			</div>

			<div className="flex items-center mt-3 space-x-2">
				<label htmlFor="end" className="flex-shrink-0 w-[150px]">
					End:&nbsp;
					<span ref={eleRefs.endRefText}></span>
				</label>

				<input
					id="end"
					ref={eleRefs.endTimeRangeRef}
					type="range"
					min={currentLyric.start}
					step={0.2}
					className="w-full"
					onChange={(e) => setEndPoint(+e.target.value)}
					{...endTimeRangeProps}
				/>
			</div>

			<div className="flex items-center mt-3">
				<label htmlFor="grow" className="flex-shrink-0 w-[150px] mr-2 leading-[1]">
					Grow: {growList[wordIndex]}
				</label>
				<input
					ref={eleRefs.growInputRef}
					type="range"
					id="grow"
					min={1}
					max={30}
					step={0.2}
					className="w-full"
					value={growList[wordIndex] + ""}
					onChange={(e) =>
						handleGrowWord({
							variant: "range",
							value: +e.target.value,
							index: wordIndex,
						})
					}
				/>
			</div>
		</div>
	);
}
