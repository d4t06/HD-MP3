import SongItem from "@/modules/song-item";
import { useAuthContext } from "@/stores";
import { RecentSearch } from "../_hooks/useSearch";
import { useSetSong } from "@/hooks";
import useGetRecommend from "@/hooks/useGetRecomemded";
import { Link } from "react-router-dom";
import { Image } from "@/components";
import SongSelectProvider from "@/stores/SongSelectContext";
import { useSelector } from "react-redux";
import { selectSongQueue } from "@/stores/redux/songQueueSlice";

type Props = {
	item: RecentSearch;
};

const classes = {
	itemContainer: `w-full sm:group/container flex flex-row rounded-md justify-between py-2 px-3 last:border-none hover:bg-white/10`,
};

function ContentItem({ item }: Props) {
	return (
		<Link
			to={`/${item.variant}/${item.item.id}`}
			className={`${classes.itemContainer}`}
		>
			<div className="w-10 h-10">
				<Image
					src={item.item.image_url}
					blurHashEncode={item.item.blurhash_encode}
				/>
			</div>

			<div className="ml-10">
				<h5 className={`line-clamp-1 font-medium overflow-hidden text-sm`}>
					{item.item.name}
				</h5>

				<p className="opacity-[.7] line-clamp-1 text-xs">{item.variant}</p>
			</div>
		</Link>
	);
}

export default function RecentSearchItem({ item }: Props) {
	const { user } = useAuthContext();

	const { currentSongData } = useSelector(selectSongQueue);

	const { handleSetSong } = useSetSong({ variant: "search-bar" });
	const { getRecommend } = useGetRecommend();

	const _handleSetSong = (song: Song) => {
		handleSetSong(song.queue_id, [song]);

		getRecommend(song);
	};

	const renderContent = () => {
		switch (item.variant) {
			case "song":
				return (
					<SongItem
						isHasCheckBox={false}
						isLiked={user?.liked_song_ids.includes(item.item.id) || false}
						variant="queue-song"
						index={99}
						active={item.item.id === currentSongData?.song.id}
						onClick={() => _handleSetSong(item.item)}
						song={item.item}
					/>
				);
			default:
				return <ContentItem item={item} />;
		}
	};

	return <SongSelectProvider>{renderContent()}</SongSelectProvider>;
}
