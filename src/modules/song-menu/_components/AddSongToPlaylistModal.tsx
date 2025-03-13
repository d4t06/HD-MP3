import { MusicalNoteIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useRef } from "react";
import { useAuthContext, useSongContext, useThemeContext } from "@/stores";
import { Button, Modal, ModalHeader, ModalRef, NotFound } from "@/components";
import useAddSongToPlaylist from "../_hooks/useAddSongToPlaylist";
import AddPlaylistModal from "@/modules/add-playlist-form";
import useMyMusicAddPlaylist from "@/pages/my-music/_hooks/useAddPlaylist";

type Props = {
  song: Song;
  closeModal: () => void;
};

export default function AddSongToPlaylistModal({ song, closeModal }: Props) {
  const { user } = useAuthContext();
  const { playlists } = useSongContext();
  const { theme } = useThemeContext();

  const { addToPlaylist, isFetching } = useAddSongToPlaylist();

  const { myMusicAddPlaylist, isFetching: addPlaylistFetching } = useMyMusicAddPlaylist();

  const modalRef = useRef<ModalRef>(null);

  const handleAddSongToPlaylist = async (playlist: Playlist) => {
    await addToPlaylist({ playlist, song });

    closeModal();
  };

  const handleAddSongToNewPlaylist = async (
    playlist: PlaylistSchema,
    imageFile?: File
  ) => {
    playlist.song_ids = [song.id];

    await myMusicAddPlaylist(playlist, imageFile);

    modalRef.current?.close();
    closeModal();
  };

  if (!user) return;

  return (
    <>
      <div className={`w-[300px] max-h-[80vh] max-w-[calc(90vw-40px)] flex flex-col `}>
        <ModalHeader close={closeModal} title={"Playlists"} />
        <div
          className={`flex-grow flex flex-col overflow-auto space-y-2 ${
            isFetching ? "disable" : ""
          }`}
        >
          {playlists.length ? (
            playlists.map((playlist, index) => {
              const isAdded = playlist.song_ids.includes(song.id);

              return (
                <button
                  disabled={isAdded}
                  key={index}
                  onClick={() => handleAddSongToPlaylist(playlist)}
                  className={`flex rounded-md p-2 ${theme.content_hover_bg} bg-white/10`}
                >
                  <MusicalNoteIcon className={`w-5 mr-2`} />
                  <span>{playlist.name}</span>
                </button>
              );
            })
          ) : (
            <NotFound less />
          )}
        </div>

        <Button
          className={`${theme.content_bg} mt-5 rounded-full justify-center`}
          onClick={() => modalRef.current?.open()}
        >
          <PlusIcon className="w-5" />
          <span>Add new playlist</span>
        </Button>
      </div>

      <Modal variant="animation" ref={modalRef}>
        <AddPlaylistModal
          close={() => modalRef.current?.close()}
          submit={handleAddSongToNewPlaylist}
          isLoading={isFetching || addPlaylistFetching}
          variant="add"
          user={user}
        />
      </Modal>
    </>
  );
}
