import { ComponentProps, useEffect, useState } from "react";
import Slider from ".";

export default function useSlider({
	autoPlay,
	images,
}: ComponentProps<typeof Slider>) {
	const [currentIndex, setCurrentIndex] = useState(0);

	// Auto-play functionality
	useEffect(() => {
		if (!autoPlay || images.length <= 1) return;

		const interval = setInterval(() => {
			setCurrentIndex((prevIndex) =>
				prevIndex === images.length - 1 ? 0 : prevIndex + 1,
			);
		}, 5000);

		return () => clearInterval(interval);
	}, [autoPlay, 5000, images.length]);

	// Keyboard navigation
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "ArrowLeft") {
				previous();
			} else if (event.key === "ArrowRight") {
				next();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);

	const previous = () => {
		setCurrentIndex((prevIndex) =>
			prevIndex === 0 ? images.length - 1 : prevIndex - 1,
		);
	};

	const next = () => {
		setCurrentIndex((prevIndex) =>
			prevIndex === images.length - 1 ? 0 : prevIndex + 1,
		);
	};

	const goToSlide = (index: number) => {
		setCurrentIndex(index);
	};

	return {
		next,
		previous,
		goToSlide,
		currentIndex,
		setCurrentIndex,
	};
}
