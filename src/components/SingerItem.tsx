import { Image, Skeleton, Square } from "@/components";
import { Link } from "react-router-dom";

type SkeletonProps = {
	variant: "skeleton";
};

type Props = {
	variant: "singer-item";
	singer: Singer;
};

export default function SingerItem(props: SkeletonProps | Props) {
	return (
		<div className="w-1/3 md:w-1/5 px-2">
			{props.variant === "skeleton" && (
				<>
					<Skeleton className="pt-[100%] rounded-full" />
					<Skeleton className="mt-1 w-full h-[24px]" />
				</>
			)}

			{props.variant === "singer-item" && (
				<>
					<Link to={`/singer/${props.singer.id}`}>
						<Square className="!rounded-full">
							<Image
								blurHashEncode={props.singer.blurhash_encode}
								src={props.singer.image_url}
								className="hover:scale-[1.05] transition-transform"
							/>
						</Square>
					</Link>
					<p className="mt-1 text-center text-lg">{props.singer.name}</p>
				</>
			)}
		</div>
	);
}
