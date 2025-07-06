import { Image } from "@/components";
import type { ReactNode } from "react";

type Props = {
	image: ImageType;
	setActive?: () => void;
	active: boolean;
	children: ReactNode;
};

export default function GalleryItem({
	active,
	setActive,
	children,
	image,
}: Props) {
	const classes = {
		imageContainer: "relative pt-[100%]",
		imageFrame:
			"absolute flex w-full items-center justify-center bg-[#f1f1f1] inset-0 rounded-[8px] border-[2px] border-[#ccc] hover:border-[#cd1818] overflow-hidden",
	};

	return (
		<div className="px-[4px] relative w-1/3 sm:w-1/4 md:w-1/6 mt-[8px]">
			<div className={classes.imageContainer}>
				<div
					onClick={setActive}
					className={`${classes.imageFrame}
                      ${active ? "border-[#cd1818]" : ""}`}
				>
					<Image
						className="`w-full h-auto ${props.setActive ? '' : 'opacity-[.4]'}`"
						src={image.image_url}
					/>
					{children}
				</div>
			</div>
		</div>
	);
}
