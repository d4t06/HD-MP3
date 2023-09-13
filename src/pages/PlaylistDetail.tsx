import { deleteDoc, doc, setDoc } from "firebase/firestore";
import {
  Bars3Icon,
  PencilSquareIcon,
  PlayPauseIcon,
  PlusCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { MouseEventHandler, useCallback, useMemo, useState, useEffect } from "react";
import {
  FloatingFocusManager,
  autoPlacement,
  autoUpdate,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
} from "@floating-ui/react";
import { useDispatch, useSelector } from "react-redux";

import { useTheme } from "../store/ThemeContext";
import { setSong } from "../store/SongSlice";

import { Song } from "../types";

import PlaylistItem from "../components/ui/PlaylistItem";
import SongListItem from "../components/ui/SongListItem";
import Button from "../components/ui/Button";
import PopupWrapper from "../components/ui/PopupWrapper";
import Modal from "../components/Modal";
import MySongsTabs from "../components/MySongsTabs";
import handleTimeText from "../utils/handleTimeText";
import usePlaylistDetail from "../hooks/usePlaylistDetail";
import { db } from "../config/firebase";
import useUserSong from "../hooks/useUserSong";

export default function PlaylistDetail() {
  const dispatch = useDispatch();
  const { theme } = useTheme();

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalComponent, setModalComponent] = useState<
    "edit" | "confirm" | "addSongs"
  >();

  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [selectedSongs, setSelectedSongs] = useState<Song[]>([]);

  const {
    playlistInStore,
    playlistSongIndexes,
    playlistId,
    userSongs,
    loading: usePlaylistLoading,
  } = usePlaylistDetail();

  const [playlistName, setPlaylistName] = useState<string>(
    playlistInStore.name
  );

  const { refs, floatingStyles, context } = useFloating({
    open: isOpenPopup,
    onOpenChange: setIsOpenPopup,
    middleware: [autoPlacement()],
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
  ]);

  const handleSetSong = (song: Song, index: number) => {
    dispatch(setSong({ ...song, currentIndex: index }));
  };

  const handleAddSongsToPlaylist = useCallback(async () => {
    let ids: string[] = [];
    let time = 0;
    selectedSongs.forEach((song) => {
      ids.push(song.id);
      time += song.duration;
    });
    try {
      await setDoc(
        doc(db, "playlist", playlistId as string),
        { songs: ids, count: ids.length, time },
        { merge: true }
      );

      setIsOpenModal(false);
    } catch (error) {
      console.log(error);
    }
  }, [selectedSongs, isOpenModal]);

  const handleDeletePlaylist: MouseEventHandler = async () => {
    try {
      setLoading(true);

      // Delete the song doc
      await deleteDoc(doc(db, "playlist", playlistId as string));

      setLoading(false);
      setIsOpenModal(false);
    } catch (error) {
      console.log({ message: error });
    }
  };

  const handleOpenModal = (name: "edit" | "confirm" | "addSongs") => {
    setModalComponent(name);
    setIsOpenModal(true);
  };

  const addSongsComponent = (
    <>
      <div className="overflow-y-auto overflow-x-hidden no-scrollbar">
        <MySongsTabs
          inList
          selectedSongs={selectedSongs}
          setSelectedSongs={setSelectedSongs}
        />
      </div>
    </>
  );

  const editComponent = (
    <div className="w-[700px] max-w-[90vw] max-h-[90vh]">
      <label htmlFor="" className="text-[18px] font-semibold">
        Name:
      </label>
      <input
        value={playlistName}
        onChange={(e) => setPlaylistName(e.target.value)}
        type="text"
        className={` text-[20px] rounded-[4px] px-[10px] h-[40px] mb-[15px] outline-none w-full bg-${
          theme.alpha
        } ${theme.type === "light" ? "text-[#333]" : "text-white"}`}
      />
      <div className="max-h-[60vh] overflow-auto">
        <div className="overflow-y-auto overflow-x-hidden no-scrollbar">
          <MySongsTabs
            inList
            selectedSongs={selectedSongs}
            setSelectedSongs={setSelectedSongs}
          />
        </div>
      </div>
      <Button
        onClick={() => handleAddSongsToPlaylist()}
        variant={"primary"}
        className={`${theme.content_bg} rounded-full self-end mt-[15px]`}
      >
        Save
      </Button>
    </div>
  );

  const confirmComponent = useMemo(
    () => (
      <>
        <div className="w-[30vw]">
          <h1 className="text-[20px] font-semibold">Chắc chưa ?</h1>
          <p className="text-[red]">This action cannot be undone</p>

          <div className="flex gap-[10px] mt-[20px]">
            <Button
              isLoading={loading}
              className={`${theme.content_bg} rounded-full text-[14px]`}
              variant={"primary"}
              onClick={handleDeletePlaylist}
            >
              Xóa mẹ nó đi !
            </Button>
            <Button
              onClick={() => setIsOpenModal(false)}
              className={`bg-${theme.alpha} rounded-full text-[14px]`}
              variant={"primary"}
            >
              Khoan từ từ
            </Button>
          </div>
        </div>
      </>
    ),
    [loading, theme]
  );

  if (usePlaylistLoading) return <h1>Loading...</h1>;

  if (playlistInStore.name) return <h1>No playlist jet...</h1>;

//   useEffect(() => {
//   }, [playlistInStore])


  return (
    <>
      {/* head */}
      {!!userSongs.length && (
        <div className="w-full flex mb-[20px] pb-[20px] border-b">
          {/* image */}
          <div className="w-1/4">
            <PlaylistItem
              onClick={() => setIsOpenModal(true)}
              data={playlistInStore}
              inDetail
              theme={theme}
              song={userSongs[playlistSongIndexes[0]] || {}}
            />
          </div>

          {/* playlist info */}
          <div className="ml-[15px] flex flex-col justify-between">
            <div className="">
              <h3 className="text-[20px] font-semibold">
                {playlistInStore.name}
                <button
                  onClick={() => handleOpenModal("edit")}
                  className="p-[5px]"
                >
                  <PencilSquareIcon className="w-[20px]" />
                </button>
              </h3>
              <p className="text-[14px]">{playlistInStore?.count} songs</p>
              <p className="text-[14px]">
                {handleTimeText(playlistInStore?.time)}
              </p>
              <p className="text-[14px] opacity-60">create by Nguyễn Hữu Đạt</p>
            </div>
            <div className="flex items-center">
              <Button
                variant={"primary"}
                className={`rounded-full ${theme.content_bg}`}
              >
                Play
                <PlayPauseIcon className="ml-[5px] w-[20px]" />
              </Button>

              <button
                {...getReferenceProps}
                ref={refs.setReference}
                className={`ml-[10px] p-[6px] rounded-full  bg-${theme.alpha}`}
              >
                <Bars3Icon className="w-[20px]" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* songs list */}
      <div className="pb-[30px]">
        {!!userSongs.length && (
          <>
            {playlistSongIndexes.forEach((songIndex) => {
              const song = userSongs[songIndex];
              return (
                <div
                  key={songIndex}
                  className="w-full -mx-[8px] max-[549px]:w-full"
                >
                  <SongListItem
                    theme={theme}
                    onClick={() => handleSetSong(song, songIndex)}
                    active={false}
                    key={songIndex}
                    data={song}
                  />
                </div>
              );
            })}

            <div className="w-full text-center mt-[15px]">
              <Button
                onClick={() => setIsOpenModal(true)}
                className={`${theme.content_bg} rounded-full`}
                variant={"primary"}
              >
                <PlusCircleIcon className="w-[30px] mr-[5px]" />
                Thêm bài hát vào playlist
              </Button>
            </div>
          </>
        )}
      </div>

      {isOpenPopup && (
        <FloatingFocusManager modal={false} context={context}>
          <div
            className="z-[99]"
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
          >
            <PopupWrapper {...getFloatingProps} theme={theme}>
              <div className="w-[150px]">
                <Button
                  onClick={() => handleOpenModal("edit")}
                  className={`${theme.content_hover_text}`}
                  variant={"list"}
                >
                  <PencilSquareIcon className="w-[18px] mr-[5px]" />
                  Edit playlist
                </Button>
                <Button
                  onClick={() => handleOpenModal("confirm")}
                  className={`${theme.content_hover_text}`}
                  variant={"list"}
                >
                  <TrashIcon className="w-[18px] mr-[5px]" />
                  Trash
                </Button>
              </div>
            </PopupWrapper>
          </div>
        </FloatingFocusManager>
      )}

      {isOpenModal && (
        <Modal setOpenModal={setIsOpenModal}>
          <PopupWrapper theme={theme}>
            {modalComponent === "edit" && editComponent}
            {modalComponent === "confirm" && confirmComponent}
            {modalComponent === "addSongs" && addSongsComponent}
          </PopupWrapper>
        </Modal>
      )}
    </>
  );
}
