import { ConfirmModal, Modal, PopupWrapper } from "@/components";
import { ModalRef } from "@/components/Modal";
import MyPopup, {
  MyPopupContent,
  MyPopupTrigger,
  usePopoverContext,
} from "@/components/MyPopup";
import { MenuList } from "@/components/ui/MenuWrapper";
import useDashboardPlaylistActions, {
  PlaylistActionProps,
} from "@/hooks/dashboard/useDashboardPlaylistActions";
import useDashboardSongItemAction, {
  SongItemActionProps,
} from "@/hooks/dashboard/useDashboardSongItemAction";
import { useThemeContext } from "@/stores";
import {
  AdjustmentsHorizontalIcon,
  Bars3Icon,
  DocumentTextIcon,
  PhotoIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import Button from "./ui/Button";

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
          <p className="opacity-70 line-clamp-1">{song.singer}</p>
        </div>
      </div>
    </div>
  );
}

type SongsMenuModal = "edit" | "delete";

type SongsMenuProps = {
  song: Song;
};

function SongsMenu({ song }: SongsMenuProps) {
  const { theme } = useThemeContext();
  const modalRef = useRef<ModalRef>(null);

  const { actions, isFetching } = useDashboardSongItemAction();
  const { close } = usePopoverContext();

  const [modal, setModal] = useState<SongsMenuModal | "">("");
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
            theme={theme}
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
      <MyPopupContent className="w-[200px]" appendTo="portal">
        <PopupWrapper
          p={"clear"}
          theme={theme}
          className="py-2 rounded-md overflow-hidden relative"
        >
          <SongInfo song={song} />
          <MenuList>
            <button onClick={() => openModal("edit")}>
              <AdjustmentsHorizontalIcon className={`w-5`} />
              <span>Edit</span>
            </button>
            <Link to={`/dashboard/lyric/${song.id}`}>
              <DocumentTextIcon className={`w-5`} />

              <span>Lyric</span>
            </Link>
            <button onClick={() => openModal("delete")}>
              <TrashIcon className={`w-5`} />

              <span>Delete</span>
            </button>
          </MenuList>
        </PopupWrapper>
      </MyPopupContent>

      <Modal ref={modalRef} variant="animation">
        {renderModal()}
      </Modal>
    </>
  );
}

type PlaylistMenuProps = {
  song: Song;
};

function PlaylistMenu({ song }: PlaylistMenuProps) {
  const { theme } = useThemeContext();

  const { actions, isFetching, currentPlaylist } = useDashboardPlaylistActions();
  const { close } = usePopoverContext();

  const classes = {
    overlay: "absolute flex items-center justify-center inset-0 bg-black/40",
  };

  const handlePlaylistAction = async (props: PlaylistActionProps) => {
    switch (props.variant) {
      case "remove-song":
        await actions({
          variant: "remove-song",
          song: props.song,
        });

        break;
      case "update-image":
        await actions({
          variant: "update-image",
          song: props.song,
        });

        break;
    }

    close();
  };

  return (
    <>
      <MyPopupContent className="w-[200px]" appendTo="portal">
        <PopupWrapper
          p={"clear"}
          theme={theme}
          className="py-2 rounded-md overflow-hidden relative"
        >
          <SongInfo song={song} />

          <MenuList>
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
                className={`${
                  currentPlaylist?.image_url === song.image_url ? "disable" : ""
                }`}
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
          </MenuList>

          {isFetching && (
            <div className={classes.overlay}>
              <div
                className={`h-[25px] w-[25px] border-[2px] border-r-black rounded-[50%] animate-spin`}
              ></div>
            </div>
          )}
        </PopupWrapper>
      </MyPopupContent>
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
        return <SongsMenu song={song} />;
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
