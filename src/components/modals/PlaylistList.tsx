import ModalHeader from "./ModalHeader";
;
import { MusicalNoteIcon } from "@heroicons/react/24/outline";

type Props = {
  close: () => void;
  handleAddSongToPlaylist: (playlist: Playlist) => void;
  userPlaylists: Playlist[];
  song: Song;
  loading: boolean;
}

function PlaylistList({
  close,
  handleAddSongToPlaylist,
  userPlaylists,
  song,
  loading,
}: Props ) {
  return (
    <div
      className={`w-[400px] max-w-[calc(90vw-40px)] ${
        loading ? "opacity-60 pointer-events-none" : ""
      }`}
    >
      <ModalHeader close={close} title={"Playlist"} />
      <div className="max-h-[60vh]">
        <ul className="">
          {!!userPlaylists?.length && (
            <>
              {userPlaylists.map((playlist, index) => {
                const isAdded = playlist.song_ids.includes(song.id);

                return (
                  <li
                    key={index}
                    onClick={() => !isAdded && handleAddSongToPlaylist(playlist)}
                    className={`list-none flex rounded-[4px] p-[5px] ${
                      isAdded && "opacity-60"
                    }`}
                  >
                    <MusicalNoteIcon className={`w-[20px] mr-[5px]`} />
                    <p>
                      {playlist.name} {isAdded && "(added)"}
                    </p>
                  </li>
                );
              })}
            </>
          )}
        </ul>
      </div>
    </div>
  );
}

export default PlaylistList;
