import { Dispatch, SetStateAction } from "react";
import ModalHeader from "./ModalHeader";
import { Playlist, Song } from "../../types";
import { MusicalNoteIcon } from "@heroicons/react/24/outline";

function PlaylistList({
  setIsOpenModal,
  handleAddSongToPlaylist,
  userPlaylists,
  song,
  loading,
}: {
  setIsOpenModal: Dispatch<SetStateAction<boolean>>;
  handleAddSongToPlaylist: (song: Song, playlist: Playlist) => void;
  userPlaylists: Playlist[];
  song: Song;
  loading: boolean;
}) {
  return (
    <div
      className={`w-[400px] max-w-[calc(90vw-40px)] ${
        loading ? "opacity-60 pointer-events-none" : ""
      }`}
    >
      <ModalHeader setIsOpenModal={setIsOpenModal} title={"Playlist"} />
      <div className="max-h-[60vh]">
        <ul className="">
          {!!userPlaylists?.length && (
            <>
              {userPlaylists.map((playlist, index) => {
                const isAdded = playlist.song_ids.includes(song.id);

                return (
                  <li
                    key={index}
                    onClick={() => !isAdded && handleAddSongToPlaylist(song, playlist)}
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
