import { MusicalNoteIcon, PlusIcon } from "@heroicons/react/24/outline";
import {  useRef } from "react";
import { useAuthContext, useSongContext } from "@/stores";
import {
  Button,
  Modal,
  ModalContentWrapper,
  ModalHeader,
  ModalRef,
  NotFound,
} from "@/components";
import useAddSongToPlaylist from "../_hooks/useAddSongToPlaylist";
import AddPlaylistModal from "@/modules/add-playlist-modal";
import useMyMusicAddPlaylist from "@/pages/my-music/_hooks/useAddPlaylist";

type Props = {
  songs: Song[];
  closeModal: () => void;
};

export default function AddSongToPlaylistModal({ songs, closeModal }: Props) {
  const { user } = useAuthContext();
  const { ownPlaylists } = useSongContext();

  const { addToPlaylist, isFetching } = useAddSongToPlaylist();

  const { myMusicAddPlaylist, isFetching: addPlaylistFetching } =
    useMyMusicAddPlaylist();

  const modalRef = useRef<ModalRef>(null);

  const handleAddSongToPlaylist = async (playlist: Playlist) => {
    await addToPlaylist({ playlist, songs });

    closeModal();
  };

  const handleAddSongToNewPlaylist = async (
    playlist: PlaylistSchema,
    imageFile?: File,
  ) => {
    playlist.song_ids = songs.map((s) => s.id);

    await myMusicAddPlaylist(playlist, imageFile);

    modalRef.current?.close();
    closeModal();
  };

  if (!user) return;

  return (
    <>
      <ModalContentWrapper>
        <ModalHeader closeModal={closeModal} title={"Playlists"} />
        <div
          className={`flex-grow flex flex-col overflow-auto space-y-2 ${
            isFetching ? "disable" : ""
          }`}
        >
          {ownPlaylists.length ? (
            ownPlaylists.map((playlist, index) => {
              return (
                <button
                  key={index}
                  onClick={() => handleAddSongToPlaylist(playlist)}
                  className={`flex rounded-md p-2 hover:bg-[--a-5-cl]`}
                >
                  <MusicalNoteIcon className={`w-5 mr-2`} />
                  <span>{playlist.name}</span>
                </button>
              );
            })
          ) : (
            <NotFound variant="less" />
          )}
        </div>

        <p className="text-center">
          <Button
            color="primary"
            className={`mt-5 rounded-full justify-center`}
            onClick={() => modalRef.current?.open()}
          >
            <PlusIcon className="w-5" />
            <span>Add new playlist</span>
          </Button>
        </p>
      </ModalContentWrapper>

      <Modal variant="animation" ref={modalRef}>
        <ModalContentWrapper className="w-[600px]">
          <AddPlaylistModal
            closeModal={() => modalRef.current?.close()}
            submit={handleAddSongToNewPlaylist}
            isLoading={isFetching || addPlaylistFetching}
            variant="add"
            user={user}
          />
        </ModalContentWrapper>
      </Modal>
    </>
  );
}
