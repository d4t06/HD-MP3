import { useEffect } from "react";
import { useLyricEditorContext } from "../_components/LyricEditorContext";

export default function useControlEvent() {
	const {
		eventRefs,
		tabProps: { tab },
	} = useLyricEditorContext();

	useEffect(() => {
		switch (tab) {
			case "Edit":
				eventRefs.playWhenSpaceRef.current = true;
				eventRefs.moveArrowToGrowRef.current = true;
				break;
			case "Record":
				eventRefs.playWhenSpaceRef.current = false;
				eventRefs.moveArrowToGrowRef.current = false;

				break;
		}
	}, [tab]);
}
