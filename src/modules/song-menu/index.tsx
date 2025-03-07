import {
  AdjustmentsHorizontalIcon,
  ArrowDownTrayIcon,
  Bars3Icon,
  DocumentTextIcon,
  MinusCircleIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { ReactNode, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { formatTime } from "@/utils/appHelpers";

import useSongQueueAction from "@/hooks/useSongQueueAction";
import { useThemeContext } from "@/stores";
import MyPopup, {
  MyPopupContent,
  MyPopupTrigger,
  usePopoverContext,
} from "@/components/MyPopup";
import { ConfirmModal, Modal, ModalRef, PopupWrapper } from "@/components";
import { MenuList } from "@/components/ui/MenuWrapper";
import AddToPlaylistMenuItem from "./_components/AddToPlaylistMenuItem";
import MyTooltip from "@/components/MyTooltip";
import AddSongToPlaylistModal from "./_components/AddSongToPlaylistModal";
import AddSongToNewPlaylistModal from "./_components/AddSongToNewPlaylist";
import RemoveSongFromPlaylistMenuItem from "./_components/RemoveSongFromPlaylistMenuItem";
import { useSongItemAction } from "@/hooks";
import EditSongModal from "../edit-song-modal";

function SongInfo({ song }: { song: Song }) {
  return (
    <div className="px-2 mb-3">
      <div className={`p-1.5 bg-[#fff]/5 rounded-md flex`}>
        {song.image_url && (
          <div className="w-[50px] h-[50px] flex-shrink-0">
            <img
              src={song.image_url}
              className="object-cover object-center w-full rounded"
              alt=""
            />
          </div>
        )}
        <div className="ml-1 text-sm">
          <h5 className="line-clamp-1 font-[500]">{song.name}</h5>
          {/* <p className="opacity-70 line-clamp-1">{song.singer}</p> */}
        </div>
      </div>
    </div>
  );
}

type QueueSongMenuProps = {
  index: number;
  song: Song;
};

function QueueSongMenu({ index, song }: QueueSongMenuProps) {
  const { theme } = useThemeContext();
  const { close } = usePopoverContext();

  const { action } = useSongQueueAction();

  const addSongToNewPlaylistModalRef = useRef<ModalRef>(null);

  const handleRemoveSongFromQueue = () => {
    action({
      variant: "remove",
      index,
    });
    close();
  };

  return (
    <>
      <MyPopupContent appendTo="portal" className="w-[200px]">
        <PopupWrapper className={`py-2`} p={"clear"} theme={theme}>
          <SongInfo song={song} />
          <MenuList>
            <AddToPlaylistMenuItem
              song={song}
              addSongToNewPlaylistModalRef={addSongToNewPlaylistModalRef}
            />

            <button onClick={handleRemoveSongFromQueue}>
              <MinusCircleIcon className="w-5" />
              <span>Remove</span>
            </button>

            <a target="_blank" href={song.song_url}>
              <ArrowDownTrayIcon className="w-5" />
              <span>Download</span>
            </a>
          </MenuList>
        </PopupWrapper>
      </MyPopupContent>

      <AddSongToNewPlaylistModal modalRef={addSongToNewPlaylistModalRef} song={song} />
    </>
  );
}

type SysSongMenuProps = {
  song: Song;
};

function SysSongMenu({ song }: SysSongMenuProps) {
  const { theme } = useThemeContext();
  const { close } = usePopoverContext();

  const addSongToNewPlaylistModalRef = useRef<ModalRef>(null);
  const addSongToPlaylistModalRef = useRef<ModalRef>(null);

  const { action } = useSongQueueAction();

  const handleAddSongToQueue = () => {
    action({ variant: "add", songs: [song] });
    close();
  };

  return (
    <>
      <MyPopupContent appendTo="portal" className="w-[200px]">
        <PopupWrapper className={`py-2`} p={"clear"} theme={theme}>
          <SongInfo song={song} />
          <MenuList>
            <button onClick={handleAddSongToQueue}>
              <PlusIcon className="w-5" />
              <span>Add to queue</span>
            </button>

            <AddToPlaylistMenuItem
              song={song}
              addSongToPlaylistModalRef={addSongToPlaylistModalRef}
              addSongToNewPlaylistModalRef={addSongToNewPlaylistModalRef}
            />

            <a target="_blank" href={song.song_url}>
              <ArrowDownTrayIcon className="w-5" />
              <span>Download</span>
            </a>
          </MenuList>
        </PopupWrapper>
      </MyPopupContent>

      <AddSongToNewPlaylistModal modalRef={addSongToNewPlaylistModalRef} song={song} />

      {/*For mobile screen*/}
      <AddSongToPlaylistModal
        modalRef={addSongToPlaylistModalRef}
        song={song}
        openAddToNewPlaylistModal={() => addSongToNewPlaylistModalRef.current?.open()}
      />
    </>
  );
}

type UserSongMenuProps = {
  song: Song;
  children?: ReactNode;
};

type Modal = "edit" | "delete";

function UserSongMenu({ song }: UserSongMenuProps) {
  const { theme } = useThemeContext();
  const { close } = usePopoverContext();

  const [modal, setModal] = useState<Modal | "">("");

  const modalRef = useRef<ModalRef>(null);
  const addSongToNewPlaylistModalRef = useRef<ModalRef>(null);
  const addSongToPlaylistModalRef = useRef<ModalRef>(null);

  const { action } = useSongQueueAction();
  const { action: songAction, loading } = useSongItemAction();

  const handleAddSongToQueue = () => {
    action({ variant: "add", songs: [song] });
    close();
  };

  const handleOpenModal = (m: Modal) => {
    setModal(m);
    modalRef.current?.open();
    close();
  };

  const closeModal = () => {
    modalRef.current?.close();
  };

  const handleDeleteSong = async () => {
    await songAction({
      variant: "delete",
      song,
    });

    closeModal();
  };

  const renderModal = () => {
    switch (modal) {
      case "":
        return <></>;
      case "delete":
        return (
          <ConfirmModal
            callback={handleDeleteSong}
            loading={loading}
            close={closeModal}
            label={`Delete ' ${song.name} ' ?`}
          />
        );
      case "edit":
        return <EditSongModal modalRef={modalRef} song={song} />;
    }
  };

  return (
    <>
      <MyPopupContent appendTo="portal" className="w-[200px]">
        <PopupWrapper className={`py-2`} p={"clear"} theme={theme}>
          <SongInfo song={song} />
          <MenuList>
            <button onClick={handleAddSongToQueue}>
              <PlusIcon className="w-5" />
              <span>Add to queue</span>
            </button>
            <AddToPlaylistMenuItem
              song={song}
              addSongToPlaylistModalRef={addSongToPlaylistModalRef}
              addSongToNewPlaylistModalRef={addSongToNewPlaylistModalRef}
            />

            <button onClick={() => handleOpenModal("edit")}>
              <AdjustmentsHorizontalIcon className="w-5" />
              <span>Edit</span>
            </button>
            <Link to={`lyric/${song.id}`}>
              <DocumentTextIcon className="w-5" />
              <span>{song.is_has_lyric ? "Edit lyric" : "Add lyric"}</span>
            </Link>
            <button onClick={() => handleOpenModal("delete")}>
              <TrashIcon className="w-5" />
              <span>Delete</span>
            </button>

            <a target="_blank" href={song.song_url}>
              <ArrowDownTrayIcon className="w-5" />
              <span>Download</span>
            </a>
          </MenuList>
        </PopupWrapper>
      </MyPopupContent>

      {/* <AddSongToNewPlaylistModal modalRef={addSongToNewPlaylistModalRef} song={song} /> */}

      {/*For mobile screen*/}
      <AddSongToPlaylistModal
        modalRef={addSongToPlaylistModalRef}
        song={song}
        openAddToNewPlaylistModal={() => addSongToNewPlaylistModalRef.current?.open()}
      />

      <Modal variant="animation" ref={modalRef}>
        {renderModal()}
      </Modal>
    </>
  );
}

type Props = {
  song: Song;
  index: number;
  variant: "queue-song" | "user-song" | "sys-song" | "user-playlist";
};

function SongMenu({ song, index, variant }: Props) {
  // stores
  const { theme } = useThemeContext();

  const [isOpenPopup, setIsOpenPopup] = useState(false);

  const renderMenu = () => {
    switch (variant) {
      case "queue-song":
        return <QueueSongMenu song={song} index={index} />;
      case "user-song":
        return <UserSongMenu song={song} />;
      case "user-playlist":
        return (
          <UserSongMenu song={song}>
            <RemoveSongFromPlaylistMenuItem song={song} />
          </UserSongMenu>
        );
      case "sys-song":
        return <SysSongMenu song={song} />;
    }
  };

  const getTriggerClass = () => {
    if (isOpenPopup) return `${theme.content_bg}`;
    else return "block md:hidden";
  };

  return (
    <>
      <MyPopup appendOnPortal>
        <MyPopupTrigger setIsOpenParent={setIsOpenPopup}>
          <MyTooltip isWrapped content="Menu">
            <button
              className={`block group-hover/main:block ${
                theme.content_hover_bg
              } p-2 rounded-full ${getTriggerClass()}`}
            >
              <Bars3Icon className="w-5" />
            </button>
          </MyTooltip>
        </MyPopupTrigger>

        <span
          className={`text-sm font-[500] hidden  group-hover/main:hidden ${
            isOpenPopup || variant === "queue-song" ? "hidden" : "md:block"
          }`}
        >
          {formatTime(song.duration)}
        </span>

        {renderMenu()}
      </MyPopup>
    </>
  );
}

export default SongMenu;
