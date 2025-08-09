import { Title } from "@/components";
import SongSelectProvider from "@/stores/SongSelectContext";
import useGetRecommendSongs from "../_hooks/useGetRecommendSongs";
import { useSetSong } from "@/hooks";
import SongList from "@/modules/song-item/_components/SongList";
import { songItemSkeleton } from "@/components/skeleton";

export default function RecommendSong() {
	const { songs, isFetching } = useGetRecommendSongs();

	const { handleSetSong } = useSetSong({
		variant: "songs",
	});

	return (
		<>
			<SongSelectProvider>
				<div>
					<Title title="Recommend" />

					<div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 mt-3">
						{isFetching ? (
							songItemSkeleton
						) : (
							<SongList
								songs={songs}
								setSong={(s) => handleSetSong(s.queue_id, songs)}
							/>
						)}
					</div>
				</div>
			</SongSelectProvider>
		</>
	);
}
