import { formatTime } from "@/utils/appHelpers";
import DashboardSongMenu from "./DashboardSongMenu";

type BaseProps = {
	song: Song;
	className?: string;
};

type Props = {
	variant: "songs";
};
type PlaylistProps = {
	variant: "playlist";
};

export default function DashboardSongItem({
	song,
	className = "",
	...props
}: BaseProps & (Props | PlaylistProps)) {
	return (
		<tr className={className}>
			<td>{song.name}</td>
			<td>{song.singer}</td>

			<td>-</td>
			<td>{formatTime(song.duration)}</td>
			<td>
				<DashboardSongMenu variant={props.variant} song={song} />
			</td>
		</tr>
	);
}
