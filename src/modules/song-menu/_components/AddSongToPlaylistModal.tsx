import { MusicalNoteIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useRef } from "react";
import { useAuthContext, useSongContext, useThemeContext } from "@/stores";
import {
  Button,
  Modal,
  ModalContentWrapper,
  ModalHeader,
  ModalRef,
  NotFound,
} from "@/components";
import useAddSongToPlaylist from "../_hooks/useAddSongToPlaylist";
import AddPlaylistModal from "@/modules/add-playlist-form";
import useMyMusicAddPlaylist from "@/pages/my-music/_hooks/useAddPlaylist";

type Props = {
  songs: Song[];
  closeModal: () => void;
};

export default function AddSongToPlaylistModal({ songs, closeModal }: Props) {
  const { user } = useAuthContext();
  const { playlists } = useSongContext();
  const { theme } = useThemeContext();

  const { addToPlaylist, isFetching } = useAddSongToPlaylist();

  const { myMusicAddPlaylist, isFetching: addPlaylistFetching } =
    useMyMusicAddPlaylist();

  const modalRef = useRef<ModalRef>(null);

  const ownPlaylist = !user
    ? []
    : playlists.filter((p) => p.owner_email === user.email && !p.is_official);

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
          {ownPlaylist.length ? (
            ownPlaylist.map((playlist, index) => {
              return (
                <button
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
            <NotFound variant="less" />
          )}
        </div>

        <p className="text-center">
          <Button
            className={`${theme.content_bg} mt-5 rounded-full justify-center`}
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
