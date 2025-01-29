import { formatTime } from "@/utils/appHelpers";
import DashboardSongMenu from "./DashboardSongMenu";

type Props = {
	song: Song;
	className?: string;
	variant: "songs" | "playlist";
};

export default function DashboardSongItem({ song, className = "", variant }: Props) {
	return (
		<tr className={className}>
			<td>{song.name}</td>
			<td>{song.singer}</td>

			<td>-</td>
			<td>{formatTime(song.duration)}</td>
			<td>
				<DashboardSongMenu variant={variant} song={song} />
			</td>
		</tr>
	);
}
