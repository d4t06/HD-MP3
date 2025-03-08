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
      <td>
        {song.singers.map((s, i) => (
          <span key={i}>
            {!!i && ", "}
            {s.name}
          </span>
        ))}
      </td>

      <td>
        <DashboardSongMenu variant={variant} song={song} />
      </td>
    </tr>
  );
}
