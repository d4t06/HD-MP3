import { useCallback, useEffect, useMemo, useRef } from "react";
import SongItem from "./SongItem";
import { uesCurrentIndexContext } from "@/pages/for-you/_stores/CurrentIndex";

export default function VideoList() {
	const { setCurrentIndex } = uesCurrentIndexContext();

	const intObserver = useRef<IntersectionObserver | null>(null);

	const lastElementRef = useCallback((el: HTMLDivElement) => {
		if (intObserver.current) intObserver.current.disconnect();

		intObserver.current = new IntersectionObserver((entries) => {
			if (entries[0].isIntersecting) {
				console.log("get song ");
			}
		});

		if (el) intObserver.current.observe(el);
	}, []);

	const content = useMemo(() => {
		return SONGS.map((item, index) => {
			if (SONGS.length === index + 1) {
				return (
					<SongItem
						index={index}
						key={index}
						ref={lastElementRef}
						song={item}
					/>
				);
			}
			return <SongItem index={index} key={index} song={item} />;
		});
	}, []);

	useEffect(() => {
		setTimeout(() => {
			setCurrentIndex(0);
		}, 1000);
	}, []);

	return (
		<div className="main-container snap-y snap-mandatory fixed inset-0 overflow-auto">
			{content}
		</div>
	);
}
