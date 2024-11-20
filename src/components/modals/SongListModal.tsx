import { useMemo } from "react";
import { useSongContext } from "@/store/SongsContext";
import Button from "../ui/Button";
import MobileSongItem from "../mobile/MobileSongItem";
import usePlaylistActions from "@/hooks/usePlaylistActions";
import ModalHeader from "./ModalHeader";
import { useTheme } from "@/store";
import SongSelectProvider, { useSongSelectContext } from "@/store/SongSelectContext";

type Props = {
  closeModal: () => void;
  playlistSongs: Song[];
  variant: "my-song" | "dashboard";
};

function SongList({ closeModal, playlistSongs, variant }: Props) {
  const { theme } = useTheme();
  const { selectedSongs } = useSongSelectContext();

  // hook
  const { songs, sysSongPlaylist } = useSongContext();
  const { addSongs, isFetching } = usePlaylistActions();

  // prettier-ignore
  const targetSongs = useMemo(() => 
    variant === 'dashboard' ? sysSongPlaylist.songs :
       variant === 'my-song' ? songs : []
   ,[sysSongPlaylist, songs])

  const classes = {
    addSongContainer: "pb-[40px] relative",
    addSongContent: "max-h-[calc(60vh)] w-[700px] max-w-[80vw] overflow-auto",
  };

  const isAbleToSubmit = useMemo(() => !!selectedSongs.length, [selectedSongs]);

  const handleAddSongsToPlaylist = async () => {
    await addSongs(selectedSongs);
    closeModal();
  };

  return (
    <div className={classes.addSongContainer}>
      <ModalHeader close={closeModal} title="Add song to playlist" />

      <div className={classes.addSongContent}>
        <Button
          onClick={handleAddSongsToPlaylist}
          variant={"primary"}
          isLoading={isFetching}
          className={`rounded-full ${
            theme.content_bg
          } absolute bottom-0 right-[15px] min-w-[34px] h-[32px] ${
            !isAbleToSubmit && "disable"
          }`}
        >
          Add
          {`${selectedSongs.length ? ` (${selectedSongs.length})` : ""}`}
        </Button>
        {targetSongs.length ? (
          targetSongs.map((song, index) => {
            const isDifferenceSong =
              playlistSongs.findIndex((s) => s.id === song.id) === -1;

            if (isDifferenceSong) {
              return (
                <MobileSongItem key={index} song={song} variant="select" theme={theme} />
              );
            }
          })
        ) : (
          <p>No song jet...</p>
        )}
      </div>
    </div>
  );
}

export default function SongListModal(props: Props) {
  return (
    <SongSelectProvider>
      <SongList {...props} />
    </SongSelectProvider>
  );
}
