import { ConfirmModal, Image, Modal, PopupWrapper } from "@/components";
import { ModalRef } from "@/components/Modal";
import MyPopup, {
  MyPopupContent,
  MyPopupTrigger,
  usePopoverContext,
} from "@/components/MyPopup";
import { MenuList } from "@/components/ui/MenuWrapper";

import {
  AdjustmentsHorizontalIcon,
  Bars3Icon,
  DocumentTextIcon,
  PhotoIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { ReactNode, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Button from "./ui/Button";
import useDashboardSongItemAction, {
  SongItemActionProps,
} from "../_hooks/useSongItemAction";
import useDashboardPlaylistActions, {
  PlaylistActionProps,
} from "../playlist/edit-playlist/_hooks/usePlaylistAction";
import { useThemeContext } from "@/stores";

function SongInfo({ song }: { song: Song }) {
  return (
    <div className="px-2 mb-3">
      <div className={`p-3 bg-white/10 rounded-md flex`}>
        <div className="w-[60px] h-[60px] flex-shrink-0 rounded overflow-hidden">
          <Image className="object-cover h-full" src={song.image_url} />
        </div>

        <div className="ml-2 text-sm">
          <h5 className="line-clamp-1 font-[500]">{song.name}</h5>
        </div>
      </div>
    </div>
  );
}

type SongsMenuModal = "edit" | "delete";

type SongsMenuProps = {
  song: Song;
  children: ReactNode;
};

function Menu({ song, children }: SongsMenuProps) {
  const { theme } = useThemeContext();

  return (
    <>
      <MyPopupContent className="w-[260px]" appendTo="portal">
        <PopupWrapper p={"clear"} className="py-2" theme={theme}>
          <SongInfo song={song} />
          <MenuList className="hover:[&>*:not(div.absolute)]:bg-black/5">
            {children}
          </MenuList>

          <p className="text-sm text-center opacity-70 mt-3">
            Provided by {song.distributor}
          </p>
        </PopupWrapper>
      </MyPopupContent>
    </>
  );
}

type PlaylistMenuProps = {
  song: Song;
};

function SongMenu({ song }: { song: Song }) {
  const { close } = usePopoverContext();
  const { actions, isFetching } = useDashboardSongItemAction();

  const [modal, setModal] = useState<SongsMenuModal | "">("");

  const modalRef = useRef<ModalRef>(null);

  const closeModal = () => modalRef.current?.close();
  const openModal = (m: SongsMenuModal) => {
    setModal(m);

    close();
    modalRef.current?.open();
  };

  const handleSongAction = async (props: SongItemActionProps) => {
    switch (props.variant) {
      case "delete":
        await actions({ variant: "delete", song });
    }

    closeModal();
  };

  const renderModal = () => {
    switch (modal) {
      case "":
        return <></>;
      case "edit":
      case "delete":
        return (
          <ConfirmModal
            loading={isFetching}
            label={`Delete '${song.name}' ?`}
            desc={"This action cannot be undone"}
            callback={() =>
              handleSongAction({
                variant: "delete",
                song,
              })
            }
            close={closeModal}
          />
        );
    }
  };

  return (
    <>
      <Menu song={song}>
        <Link to={`/dashboard/song/${song.id}/edit`}>
          <AdjustmentsHorizontalIcon className={`w-5`} />
          <span>Edit</span>
        </Link>
        <Link to={`/dashboard/lyric/${song.id}`}>
          <DocumentTextIcon className={`w-5`} />

          <span>Lyric</span>
        </Link>
        <button onClick={() => openModal("delete")}>
          <TrashIcon className={`w-5`} />

          <span>Delete</span>
        </button>
      </Menu>

      <Modal ref={modalRef} variant="animation">
        {renderModal()}
      </Modal>
    </>
  );
}

function PlaylistMenu({ song }: PlaylistMenuProps) {
  const { action, isFetching, playlist } = useDashboardPlaylistActions();
  const { close } = usePopoverContext();

  const classes = {
    overlay: "absolute flex items-center justify-center inset-0 bg-black/40",
  };

  const handlePlaylistAction = async (props: PlaylistActionProps) => {
    switch (props.variant) {
      case "remove-song":
        await action({
          variant: "remove-song",
          song: props.song,
        });

        break;
      case "update-image":
        await action({
          variant: "update-image",
          song: props.song,
        });

        break;
    }

    close();
  };

  return (
    <>
      <Menu song={song}>
        <button
          onClick={() =>
            handlePlaylistAction({
              variant: "remove-song",
              song,
            })
          }
        >
          <TrashIcon className="w-5" />
          <span>Remove</span>
        </button>

        {song.image_url && (
          <button
            className={`${playlist?.image_url === song.image_url ? "disable" : ""}`}
            onClick={() =>
              handlePlaylistAction({
                variant: "update-image",
                song,
              })
            }
          >
            <PhotoIcon className={`w-5`} />
            <span>Set playlist image</span>
          </button>
        )}

        {isFetching && (
          <div className={classes.overlay}>
            <div
              className={`h-[25px] w-[25px] border-[2px] border-r-black rounded-[50%] animate-spin`}
            ></div>
          </div>
        )}
      </Menu>
    </>
  );
}

type Props = {
  song: Song;
  variant: "songs" | "playlist";
};

export default function DashboardSongMenu({ song, variant }: Props) {
  const renderMenu = () => {
    switch (variant) {
      case "songs":
        return <SongMenu song={song} />;
      case "playlist":
        return <PlaylistMenu song={song} />;
    }
  };

  return (
    <>
      <MyPopup appendOnPortal>
        <MyPopupTrigger>
          <Button size={"clear"} color={"second"} className={`p-1`}>
            <Bars3Icon className="w-5" />
          </Button>
        </MyPopupTrigger>
        {renderMenu()}
      </MyPopup>
    </>
  );
}
