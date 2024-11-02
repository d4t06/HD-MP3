import { useSongsStore, useTheme } from "@/store";
import ModalHeader from "./ModalHeader";
import { MusicalNoteIcon } from "@heroicons/react/24/outline";

type Props = {
  closeModal: () => void;
  handleAddSongToPlaylist: (playlist: Playlist) => void;
  loading: boolean;
};

function PlaylistList({ closeModal, handleAddSongToPlaylist, loading }: Props) {
  const { userPlaylists } = useSongsStore();
  const { theme } = useTheme();

  return (
    <div
      className={`w-[400px] max-h-[80vh] max-w-[calc(90vw-40px)] flex flex-col ${
        loading ? "disable" : ""
      }`}
    >
      <ModalHeader close={closeModal} title={"Playlists"} />
      <div className="flex-grow flex flex-col overflow-auto space-y-2">
        {!!userPlaylists?.length ? (
          <>
            {userPlaylists.map((playlist, index) => {
              return (
                <button
                  key={index}
                  onClick={() => handleAddSongToPlaylist(playlist)}
                  className={`flex text-lg rounded-md p-2 hover:${theme.content_bg} ${theme.side_bar_bg}`}
                >
                  <MusicalNoteIcon className={`w-6 mr-2`} />
                  <span>{playlist.name}</span>
                </button>
              );
            })}
          </>
        ) : (
          "No playlist jet..."
        )}
      </div>
    </div>
  );
}

export default PlaylistList;
