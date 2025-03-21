import { ElementRef, useEffect, useRef, useState } from "react";
import { inputClasses } from "@/components/ui/Input";
import { useEditLyricContext } from "@/modules/lyric-editor/_components/EditLyricContext";
import { useLyricEditorContext } from "./LyricEditorContext";
import { CheckIcon, PencilIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function Preview() {
	const { currentLyric, selectLyricIndex, updateLyric } = useEditLyricContext();
	const { eleRefs, eventRefs } = useLyricEditorContext();

	const [isEditText, setIsEditText] = useState(false);

	const inputRef = useRef<ElementRef<"textarea">>(null);

	const handleUpdateLyricText = () => {
		if (typeof selectLyricIndex !== "number" || !inputRef.current) return;

		updateLyric(selectLyricIndex, { text: inputRef.current.value.trim() });
		setIsEditText(false);
	};

	useEffect(() => {
		if (isEditText) {
			eventRefs.playWhenSpaceRef.current = false;
			eventRefs.moveArrowToGrowRef.current = false;
			if (inputRef.current && currentLyric) inputRef.current.value = currentLyric.text;
		} else {
			eventRefs.playWhenSpaceRef.current = true;
			eventRefs.moveArrowToGrowRef.current = true;
		}
	}, [isEditText]);

	if (!currentLyric) return <></>;

	return (
		<div className="mt-3 relative pt-5">
			<div className="absolute top-0 right-0 flex justify-end w space-x-2 hover:[&>button]:bg-black/10 [&>button]:rounded-full [&>button]:p-1">
				{!isEditText ? (
					<button onClick={() => setIsEditText(true)}>
						<PencilIcon className="w-5" />
					</button>
				) : (
					<>
						<button onClick={() => setIsEditText(false)}>
							<XMarkIcon className="w-5" />
						</button>
						<button onClick={handleUpdateLyricText}>
							<CheckIcon className="w-5" />
						</button>
					</>
				)}
			</div>

			<div className="flex justify-center">
				{isEditText ? (
					<textarea
						ref={inputRef}
						className={`${inputClasses} w-full mt-3 bg-white/10`}
					/>
				) : (
					<>
						<div className="relative whitespace-nowrap  sm:text-2xl font-[700]">
							{currentLyric.text}
							<div
								ref={eleRefs.overlayRef}
								className="absolute  top-0 left-0 overflow-hidden text-[#ffed00] whitespace-nowrap w-0"
							>
								{currentLyric.text}
							</div>
						</div>
					</>
				)}
			</div>
		</div>
	);
}
