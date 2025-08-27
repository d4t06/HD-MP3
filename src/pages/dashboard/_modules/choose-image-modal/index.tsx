import { ChooseImageModal, NotFound, RatioFrame } from "@/components";
import { Loading, SearchBar } from "../../_components";
import { ComponentProps } from "react";
import useSearchImage from "./useSearch";

export default function DashboardChooseImageModal({
	setUrl,
	...props
}: ComponentProps<typeof ChooseImageModal> & {
	setUrl?: (url: string) => void;
}) {
	const { isFetching, showResult, items, ...rest } = useSearchImage();

	return (
		<ChooseImageModal {...props}>
			<SearchBar className="mt-5 mb-3" {...rest} />

			{isFetching && <Loading />}

			{!isFetching && showResult && (
				<>
					{items.length ? (
						<div className="grid grid-cols-2 sm:grid-cols-3 overflow-auto">
							{items.map((item, i) => (
								<button
									onClick={() => {
										setUrl && setUrl(item.link);
										props.modalRef.current?.close();
									}}
									key={i}
									className="p-1"
								>
									<RatioFrame className="pt-[100%] rounded-md overflow-hidden">
										<img
											src={item.link}
											alt=""
											className="w-full h-full object-conver"
										/>

										<div className="absolute bottom-0 left-0 right-0 h-[20%] bg-gradient-to-t from-black/80 to-transparent"></div>

										<span className="text-sm font-bold absolute bottom-0 left-1 text-white">
											{item.image.width} x {item.image.height}
										</span>
									</RatioFrame>
								</button>
							))}
						</div>
					) : (
						<NotFound />
					)}
				</>
			)}
		</ChooseImageModal>
	);
}
