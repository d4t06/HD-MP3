import { NotFound, PopupWrapper } from "@/components";
import { Loading, SearchBar } from "../../_components";
import useSpotifySearch from "./useSpotifySearch";

export default function SpotifySearch() {
	const {
		isFetching,
		isFocus,
		setIsFocus,
		setShowResult,
		items,
		formRef,
		showResult,
		...rest
	} = useSpotifySearch();

	return (
		<>
			<div className="relative">
				<SearchBar
					frame={false}
					formRef={formRef}
					whenClear={() => setShowResult(false)}
					className="mb-3"
					onFocus={() => setIsFocus(true)}
					place="Search on spotify..."
					{...rest}
				/>

				<PopupWrapper
					className={`${isFocus ? "" : "hidden"} search-result absolute px-2 top-[calc(100%+8px)] right-0 w-[120%] popup-shadow`}
				>
					{!isFetching && !showResult && <span>Search on spotify...</span>}

					{isFetching && <Loading />}

					{!isFetching && showResult && (
						<>
							{items.length ? (
								<div className="overflow-auto">
									{items.map((item, i) => (
										<div key={i} className="p-1 flex result-item">
											<div className="w-16 h-16 flex-shrink-0 rounded-md overflow-hidden">
												<img
													src={item.album.images[0].url}
													alt=""
													className="w-full h-full object-conver"
												/>
											</div>

											<div className="ml-2 font-bold text-left">
												<p className="">{item.name}</p>

												<p className="text-sm item-info">
													{item.artists.map((a, i) => (
														<span key={i}>{(i ? ", " : "") + a.name}</span>
													))}
												</p>
												<p className="item-info text-sm">
													{item.album.release_date}
												</p>
											</div>
										</div>
									))}
								</div>
							) : (
								<NotFound />
							)}
						</>
					)}
				</PopupWrapper>
			</div>
		</>
	);
}
