import { Link } from "react-router-dom";
import DashboardSongMenu from "../_modules/song-menu";
import { abbreviateNumber } from "@/utils/abbreviateNumber";
import { ReactNode } from "react";

type Props = {
  song: Song;
  className?: string;
  variant: "songs" | "playlist";
  children?: ReactNode;
};

export default function DashboardSongItem({
  song,
  className = "",
  variant,
  children,
}: Props) {
  return (
    <tr className={className}>
      <td>
        <Link
          to={`/dashboard/song/${song.id}/edit`}
          className="hover:underline"
        >
          {song.name}
        </Link>
      </td>
      <td>
        {song.singers.map((s, i) => (
          <Link
            className="hover:underline"
            to={`/dashboard/singer/${s.id}`}
            key={i}
          >
            {!!i && ", "}
            {s.name}
          </Link>
        ))}
      </td>

      <td>{song.main_genre?.name}</td>

      <td>
        {song.genres.map((genre, i) => (
          <span key={i}>
            {!!i && ", "}
            {genre.name}
          </span>
        ))}
      </td>

      <td>{abbreviateNumber(song.like)}</td>

      <td>{song.today_play}</td>
      <td>{song.week_play}</td>

      <td>
        <DashboardSongMenu variant={variant} song={song} />
      </td>

      {children}
    </tr>
  );
}
