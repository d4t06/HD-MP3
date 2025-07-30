import { Button, Tab, Title } from "@/components";
import { SongItemSkeleton } from "@/components/skeleton";
import SongList from "@/modules/song-item/_components/SongList";
import { useSetSong } from "@/hooks";
import SongSelectProvider from "@/stores/SongSelectContext";
import { useThemeContext } from "@/stores";
import { Link } from "react-router-dom";
import useGetNewSongs from "./useGetNewSong";
import useGetRecommend from "@/hooks/useGetRecomemded";

type Props = {
	amount: number;
};

export default function NewSong(props: Props) {
	const { theme } = useThemeContext();

	const { isFetching, currentSongs, ...rest } = useGetNewSongs(props);
	const { getRecommend } = useGetRecommend();

	const { handleSetSong } = useSetSong({ variant: "songs" });

	const _handleSetSong = (song: Song) => {
		handleSetSong(song.queue_id, [song]);
		getRecommend(song);
	};

	return (
		<div className={`${theme.bottom_player_bg} rounded-xl p-5`}>
			<Title title="New song" className="mb-3" />

			<div className="mb-5 space-y-3">
				<Tab className="w-fit" render={(t) => t} {...rest} />
			</div>

			<SongSelectProvider>
				{isFetching && SongItemSkeleton}
				{!isFetching && (
					<SongList
						isHasCheckBox={false}
						songs={currentSongs}
						setSong={(s) => _handleSetSong(s)}
					/>
				)}
			</SongSelectProvider>

			<div className="text-center mt-5 border-none">
				<Link to={"/trending"}>
					<Button color={"primary"}>See more</Button>
				</Link>
			</div>
		</div>
	);
}
