import ModalHeader from "./ModalHeader";
import { MusicalNoteIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Button, Modal } from "..";
import { RefObject } from "react";
import { ModalRef } from "../Modal";
import useAddSongToPlaylist from "./_hooks/useAddSongToPlaylist";
import { useSongContext, useTheme } from "@/store";

type Props = {
  modalRef: RefObject<ModalRef>;
  openAddToNewPlaylistModal: () => void;
  song: Song;
};

export default function AddSongToPlaylistModal({
  modalRef,
  openAddToNewPlaylistModal,
  song,
}: Props) {
  const { playlists } = useSongContext();
  const { theme } = useTheme();

  const { addToPlaylist, isFetching } = useAddSongToPlaylist();

  const _openAddToNewPlaylistModal = () => {
    modalRef.current?.close();
    openAddToNewPlaylistModal();
  };

  const handleAddSongToPlaylist = async (playlist: Playlist) => {
    await addToPlaylist({ variant: "exist", playlist, song });
  };

  return (
    <Modal variant="animation" ref={modalRef}>
      <div className={`w-[400px] max-h-[80vh] max-w-[calc(90vw-40px)] flex flex-col `}>
        <ModalHeader close={() => modalRef.current?.close()} title={"Playlists"} />
        <div
          className={`flex-grow flex flex-col overflow-auto space-y-2 ${isFetching ? "disable" : ""}`}
        >
          <Button
            className={`${theme.content_bg} rounded-full justify-center`}
            onClick={_openAddToNewPlaylistModal}
          >
            <PlusIcon className="w-5" />
            <span>Add new playlist</span>
          </Button>

          {!!playlists?.length && (
            <>
              {playlists.map((playlist, index) => {
                return (
                  <button
                    key={index}
                    onClick={() => handleAddSongToPlaylist(playlist)}
                    className={`flex rounded-md p-2 hover:${theme.content_bg} ${theme.side_bar_bg}`}
                  >
                    <MusicalNoteIcon className={`w-5 mr-2`} />
                    <span>{playlist.name}</span>
                  </button>
                );
              })}
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}
