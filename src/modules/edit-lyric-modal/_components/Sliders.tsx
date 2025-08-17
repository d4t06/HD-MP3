import { useEditLyricContext } from "@/modules/lyric-editor/_components/EditLyricContext";
import { useLyricEditorContext } from "./LyricEditorContext";
import useSlider from "../_hooks/useSlider";
import { Label } from "@/components";

export default function Sliders() {
	const { setStartPoint, setEndPoint, endTimeRangeProps, handleGrowWord } =
		useSlider();

	const { currentLyric } = useEditLyricContext();
	const { wordIndex, growList, eleRefs } = useLyricEditorContext();

	if (!currentLyric) return <></>;

	return (
		<div className="[&>div]:flex [&>div]:space-x-2 space-y-3 [&_label]:w-[160px] [&_label]:flex-shrink-0">
			<div>
				<Label htmlFor="start">
					Start:&nbsp;
					<span ref={eleRefs.startRefText}></span>
				</Label>

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

			<div>
				<Label htmlFor="end">
					End:&nbsp;
					<span ref={eleRefs.endRefText}></span>
				</Label>

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

			<div>
				<Label htmlFor="grow">Grow: {growList[wordIndex]}</Label>
				<input
					ref={eleRefs.growInputRef}
					type="range"
					id="grow"
					min={0}
					max={10}
					step={0.1}
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
