import { Image, Skeleton } from "@/components";
import { Link } from "react-router-dom";

type SkeletonProps = {
	variant: "skeleton";
};

type Props = {
	variant: "singer-item";
	singer: Singer;
  onClick?: () => void;
};

export default function SingerItem(props: SkeletonProps | Props) {
	return (
		<div className="p-3">
			{props.variant === "skeleton" && (
				<>
					<Skeleton className="pt-[100%] rounded-full" />
					<Skeleton className="mt-1 w-full h-[24px]" />
				</>
			)}

			{props.variant === "singer-item" && (
				<>
					<Link onClick={props.onClick} to={`/singer/${props.singer.id}`}>
						<div className="aspect-[1/1] rounded-full overflow-hidden">
							<Image
								blurHashEncode={props.singer.blurhash_encode}
								src={props.singer.image_url}
								className="hover:scale-[1.05] transition-transform"
							/>
						</div>
					</Link>
					<p className="mt-1 text-center font-bold">{props.singer.name}</p>
				</>
			)}
		</div>
	);
}
