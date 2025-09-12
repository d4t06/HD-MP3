import { NotFound, PopupWrapper, Tab } from "@/components";
import { Loading, SearchBar } from "../../_components";
import useSpotifySearch, { Artist, Track } from "./useSpotifySearch";

function ResultItem(
	props: { type: "song"; song: Track } | { type: "singer"; singer: Artist },
) {
	switch (props.type) {
		case "song":
			const song = props.song;

			return (
				<>
					<div className="w-16 h-16 flex-shrink-0 rounded-md overflow-hidden">
						{!!song.album.images.length && (
							<img
								src={song.album.images[0].url}
								alt=""
								className="w-full h-full object-conver"
							/>
						)}
					</div>

					<div className="ml-2 font-bold text-left">
						<p className="">{song.name}</p>

						<p className="text-sm item-info">
							{song.artists.map((a, i) => (
								<span key={i}>{(i ? ", " : "") + a.name}</span>
							))}
						</p>
						<p className="item-info text-sm">{song.album.release_date}</p>
					</div>
				</>
			);
		case "singer":
			const singer = props.singer;
			return (
				<>
					<div className="w-16 h-16 flex-shrink-0 rounded-md overflow-hidden">
						{!!singer.images.length && (
							<img
								src={props.singer.images[0].url}
								alt=""
								className="w-full h-full object-conver"
							/>
						)}
					</div>

					<p className="ml-2 font-bold text-left">{props.singer.name}</p>
				</>
			);
	}
}

export default function SpotifySearch() {
	const {
		isFetching,
		isFocus,
		setIsFocus,
		setShowResult,
		formRef,
		tabs,
		showResult,
		tab,
		setTab,
		resutMap,
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
					<div className={`w-fit mb-2 self-start`}>
						<Tab
							buttonClasses="[&_button]:py-1/2 [&_button]:px-2"
							tabs={tabs}
							render={(t) => t}
							tab={tab}
							setTab={setTab}
						/>
					</div>

					{!isFetching && !showResult && <span>Search on spotify...</span>}

					{isFetching && <Loading />}

					{!isFetching && showResult && (
						<>
							{resutMap[tab].length ? (
								<div className="overflow-auto">
									{resutMap[tab].map((item, i) => (
										<div key={i} className="p-1 flex result-item">
											{tab === "Track" ? (
												<ResultItem type="song" song={item as Track} />
											) : (
												<ResultItem type="singer" singer={item as Artist} />
											)}
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
