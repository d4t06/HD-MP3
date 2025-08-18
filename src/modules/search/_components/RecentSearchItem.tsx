import SongItem from "@/modules/song-item";
import { useAuthContext } from "@/stores";
import { RecentSearch } from "../_hooks/useSearch";
import { useSetSong } from "@/hooks";
import { Link } from "react-router-dom";
import { Image } from "@/components";
import SongSelectProvider from "@/stores/SongSelectContext";
import { useSelector } from "react-redux";
import { selectSongQueue } from "@/stores/redux/songQueueSlice";
import useGetRelativeSongs from "@/modules/song-queue/_hooks/useGetRelativeSongs";

type Props = {
	item: RecentSearch;
};

const classes = {
	itemContainer: `w-full hover:bg-[--a-5-cl] items-start sm:group/container flex flex-row rounded-md py-2 px-3 last:border-none`,
};

function ContentItem({ item }: Props) {
	return (
		<Link
			to={`/${item.variant}/${item.item.id}`}
			className={`${classes.itemContainer}`}
		>
			<div className="w-[54px] h-[54px]">
				<Image
					src={item.item.image_url}
					blurHashEncode={item.item.blurhash_encode}
					className={`${item.variant === 'singer' ? 'rounded-full' : 'rounded'}`}
				/>
			</div>

			<div className="ml-[10px]">
				<h5 className={`line-clamp-1 font-medium overflow-hidden text-sm`}>
					{item.item.name}
				</h5>

				<p className="item-info line-clamp-1 text-sm">{item.variant.charAt(0).toLocaleUpperCase()+item.variant.slice(1)}</p>
			</div>
		</Link>
	);
}

export default function RecentSearchItem({ item }: Props) {
	const { user } = useAuthContext();

	const { currentSongData } = useSelector(selectSongQueue);

	const { handleSetSong } = useSetSong({ variant: "search-bar" });
	const { getRelatigeSongs } = useGetRelativeSongs();

	const _handleSetSong = (song: Song) => {
		handleSetSong(song.queue_id, [song]);

		getRelatigeSongs(song);
	};

	const renderContent = () => {
		switch (item.variant) {
			case "song":
				return (
					<SongItem
						isHasCheckBox={false}
						isLiked={user?.liked_song_ids.includes(item.item.id) || null}
						variant="system-song"
						index={0}
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
