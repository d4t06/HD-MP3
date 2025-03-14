import { Link } from "react-router-dom";
import DashboardSongMenu from "./DashboardSongMenu";

type Props = {
  song: Song;
  className?: string;
  variant: "songs" | "playlist";
};

export default function DashboardSongItem({ song, className = "", variant }: Props) {
  return (
    <tr className={className}>
      <td>
        <Link to={`/dashboard/song/${song.id}/edit`} className="hover:underline">
          {song.name}
        </Link>
      </td>
      <td>
        {song.singers.map((s, i) => (
          <Link className="hover:underline" to={`/dashboard/singer/${s.id}`} key={i}>
            {!!i && ", "}
            {s.name}
          </Link>
        ))}
      </td>

      <td>
        <DashboardSongMenu variant={variant} song={song} />
      </td>
    </tr>
  );
}
