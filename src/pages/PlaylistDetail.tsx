import {
  PencilSquareIcon,
  PlayIcon,
  PlusCircleIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  MouseEventHandler,
  useCallback,
  useMemo,
  useState,
  useRef,
} from "react";
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
import { useParams } from "react-router-dom";

import { useTheme } from "../store/ThemeContext";
import { selectAllSongStore, setSong } from "../store/SongSlice";
import { useSongsStore } from "../store/SongsContext";
import { useToast } from "../store/ToastContext";

import { Song } from "../types";

import useSong from "../hooks/useSongs";
import useSongItemActions from "../hooks/useSongItemActions";
import usePlaylistDetail from "../hooks/usePlaylistDetail";

import {
  generatePlaylistAfterChangeSongs,
  myDeleteDoc,
} from "../utils/firebaseHelpers";
import { handleTimeText } from "../utils/appHelpers";

import PlaylistItem from "../components/ui/PlaylistItem";
import SongListItem from "../components/ui/SongItem";
import Button from "../components/ui/Button";
import PopupWrapper from "../components/ui/PopupWrapper";
import Modal from "../components/Modal";
import MobileSongItem from "../components/ui/MobileSongItem";
import Skeleton from "../components/skeleton";

export default function PlaylistDetail() {
  // for store
  const params = useParams();
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const { setSuccessToast } = useToast();
  const {
    loading: initialLoading,
    errorMsg: useSongErrorMsg,
    initial,
  } = useSong();
  const { userData, userSongs, userPlaylists, setUserPlaylists, setUserSongs } =
    useSongsStore();
  const { song: songInStore, playlist: playlistInStore } =
    useSelector(selectAllSongStore);

  // component state
  const [loading, setLoading] = useState(false);
  const firstTimeRender = useRef(true);

  //   use hooks
  const { updatePlaylistAfterChange } = useSongItemActions();
  const {
    PlaylistSongs,
    errorMsg: usePlaylistErrorMsg,
    loading: usePlaylistLoading,
  } = usePlaylistDetail({ firstTimeRender, initial, playlistInStore });

  // for modal
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [modalComponent, setModalComponent] = useState<
    "edit" | "confirm" | "addSongs"
  >();

  // for add songs to playlist
  const [isOpenPopup, setIsOpenPopup] = useState(false);

  // for multiselect songListItem
  const [selectedSongList, setSelectedSongList] = useState<Song[]>([]);
  const [isCheckedSong, setIsCheckedSong] = useState(false);

  // for edit playlist
  const [playlistName, setPlaylistName] = useState<string>(
    playlistInStore.name
  );

  // for floating-ui
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
    dispatch(
      setSong({
        ...song,
        currentIndex: index,
        song_in:
          playlistInStore.by != "admin"
            ? `user-playlist-${playlistInStore.name}`
            : `admin-playlist-${playlistInStore.name}`,
      })
    );
  };

  const handlePlayPlaylist = () => {
    const firstSong = PlaylistSongs[0];

    if (songInStore.song_in.includes(params.name as string)) return;
    handleSetSong(firstSong, 0);
  };

  const handleAddSongsToPlaylist = useCallback(async () => {
    // eliminate duplicate song
    const trueNewSongsList = selectedSongList.filter((song) => {
      const isAdded = playlistInStore.song_ids.find((id) => id === song.id);
      return !isAdded;
    });

    // get new songs list
    const newPlaylistSongs = [...PlaylistSongs, ...trueNewSongsList];
    const newPlaylist = generatePlaylistAfterChangeSongs({
      newPlaylistSongs,
      existingPlaylist: playlistInStore,
    });

    await updatePlaylistAfterChange({
      newPlaylist,
    });

    setSuccessToast({ message: `${trueNewSongsList.length} songs added` });

    closeModal();
  }, [selectedSongList, isOpenModal]);

  const deleteFromPlaylist = async (song: Song) => {
    setIsOpenPopup(false);

    if (!playlistInStore.song_ids) {
      return;
    }
    const newPlaylistSongs = [...PlaylistSongs];
    newPlaylistSongs.splice(newPlaylistSongs.indexOf(song), 1);

    const newPlaylist = generatePlaylistAfterChangeSongs({
      newPlaylistSongs,
      existingPlaylist: playlistInStore,
    });

    await updatePlaylistAfterChange({
      newPlaylist,
    });

    setSuccessToast({ message: `'${song.name}' removed` });
  };

  const deleteManyFromPlaylist = async () => {
    setIsOpenPopup(false);

    if (!playlistInStore.song_ids) return;

    // if need to remove 1 song
    if (selectedSongList.length === 1) {
      return deleteFromPlaylist(selectedSongList[0]);
    }

    const newPlaylistSongs = [...PlaylistSongs];
    for (let song of selectedSongList) {
      newPlaylistSongs.splice(newPlaylistSongs.indexOf(song), 1);
    }

    const newPlaylist = generatePlaylistAfterChangeSongs({
      newPlaylistSongs,
      existingPlaylist: playlistInStore,
    });

    await updatePlaylistAfterChange({
      newPlaylist,
    });

    setSuccessToast({ message: `${selectedSongList.length} songs removed` });
  };

  const handleDeletePlaylist: MouseEventHandler = async () => {
    try {
      setLoading(true);

      await myDeleteDoc({ collection: "lyrics", id: playlistInStore.id });

      setLoading(false);
      setIsOpenModal(false);
    } catch (error) {
      console.log({ message: error });
    }
  };

  const openModal = (name: "edit" | "confirm" | "addSongs") => {
    setModalComponent(name);
    setIsOpenModal(true);
  };

  const closeModal = () => {
    setIsOpenModal(false);
  };

  const songCount = useMemo(() => PlaylistSongs.length, [PlaylistSongs]);
  const isOnMobile = useMemo(() => window.innerWidth < 550, []);

  const classes = {
    addSongContainer: "pb-[50px] relative",
    addSongContent:
      "max-h-[calc(90vh-50px)] w-[700px] max-w-[80vw] overflow-auto",
    songItem: "w-full max-[549px]:w-full",
    editContainer: "w-[700px] max-w-[90vw] max-h-[90vh]",
    input:
      "text-[20px] rounded-[4px] px-[10px] h-[40px] mb-[15px] outline-none w-full",
    button: `${theme.content_bg} rounded-full`,
    playListTop:
      "w-full flex mb-[15px] max-[549px]:flex-col max-[549px]:gap-[12px]",
    playlistInfoContainer:
      "ml-[15px] flex flex-col justify-between max-[549px]:ml-0 max-[549px]:gap-[12px]",
    songListContainer:
      "h-[50px] mb-[10px] flex gap-[20px] max-[549px]:gap-[12px] items-center border-b",
    countSongText: "text-[14px]] font-semibold text-gray-500 w-[100px]",

    buttonAddSongContainer: "w-full text-center mt-[15px]",
  };

  // for defines jsx
  const renderPlaylistSongs = useMemo(() => {
    return PlaylistSongs.map((song, index) => {
      const active =
        song.id === songInStore.id &&
        songInStore.song_in.includes(playlistInStore.name);

      if (isOnMobile) {
        return (
          <div key={index} className="w-full max-[549px]:w-full">
            <MobileSongItem
              theme={theme}
              onClick={() => handleSetSong(song, index)}
              active={active}
              key={index}
              data={song}
              isCheckedSong={isCheckedSong}
              selectedSongList={selectedSongList}
              setIsCheckedSong={setIsCheckedSong}
              setSelectedSongList={setSelectedSongList}
            />
          </div>
        );
      }
      return (
        <div key={index} className="w-full max-[549px]:w-full">
          <SongListItem
            isCheckedSong={isCheckedSong && !isOpenModal}
            setIsCheckedSong={setIsCheckedSong}
            selectedSongList={selectedSongList}
            setSelectedSongList={setSelectedSongList}
            deleteFromPlaylist={deleteFromPlaylist}
            userSongs={userSongs}
            setUserSongs={setUserSongs}
            onClick={() => handleSetSong(song, index)}
            theme={theme}
            active={active}
            data={song}
            inPlaylist
          />
        </div>
      );
    });
  }, [PlaylistSongs]);

  const addSongsComponent = (
    <>
      <div className={classes.addSongContainer}>
        <div className={classes.addSongContent}>
          <Button
            onClick={() => handleAddSongsToPlaylist()}
            variant={"primary"}
            className={`rounded-full ${theme.content_bg} absolute bottom-0 right-15px`}
          >
            Save
          </Button>
          {userSongs.map((song, index) => {
            const isDifference = PlaylistSongs.indexOf(song) == -1;

            if (isDifference) {
              return (
                <div key={index} className={classes.songItem}>
                  <MobileSongItem
                    isCheckedSong={true}
                    selectedSongList={selectedSongList}
                    setIsCheckedSong={setIsCheckedSong}
                    setSelectedSongList={setSelectedSongList}
                    theme={theme}
                    data={song}
                    active={false}
                    onClick={() => {}}
                  />
                </div>
              );
            }
          })}
        </div>
      </div>
    </>
  );

  const editComponent = (
    <div className={classes.editContainer}>
      <label htmlFor="" className="text-[18px] font-semibold">
        Name:
      </label>
      <input
        value={playlistName}
        onChange={(e) => setPlaylistName(e.target.value)}
        type="text"
        className={`${classes.input} bg-${theme.alpha} ${
          theme.type === "light" ? "text-[#333]" : "text-white"
        }`}
      />

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

  // for define skeleton
  const playlistSkeleton = (
    <div className="flex">
      <div className="w-1/4 max-[459px]:w-1/2">
        <Skeleton className="pt-[100%] rounded-[8px]" />
      </div>
      <div className="ml-[15px]">
        <Skeleton className="h-[30px]  w-[100px]" />
        <Skeleton className="h-[20px] mt-[9px] w-[100px]" />
        <Skeleton className="h-[20px] mt-[9px] w-[100px]" />
        <Skeleton className="h-[15px] mt-[9px] w-[200px]" />
      </div>
    </div>
  );

  const SongItemSkeleton = [...Array(4).keys()].map((index) => {
    return (
      <div className="flex p-[10px]" key={index}>
        <Skeleton className="h-[54px] w-[54px] ml-[27px] rounded-[4px]" />
        <div className="ml-[10px]">
          <Skeleton className="h-[20px] mb-[5px] w-[150px]" />
          <Skeleton className="h-[12px] mt-[5px] w-[100px]" />
        </div>
      </div>
    );
  });

  if (usePlaylistErrorMsg) return <h1>{usePlaylistErrorMsg}</h1>;
  if (useSongErrorMsg) return <h1>{useSongErrorMsg}</h1>;

  return (
    <>
      {/* head */}
      {(usePlaylistLoading || initialLoading) && playlistSkeleton}
      {!usePlaylistLoading && !!playlistInStore.name && (
        <div className={classes.playListTop}>
          {/* image */}
          <div className="w-1/4 max-[549px]:w-full">
            <PlaylistItem
              // onClick={() => {}}
              data={playlistInStore}
              inDetail
              theme={theme}
              setUserPlaylists={setUserPlaylists}
              userData={userData}
              userPlaylists={userPlaylists}
            />
          </div>

          {/* playlist info */}
          <div className={classes.playlistInfoContainer}>
            <div className="max-[549px]:flex items-center gap-[12px]">
              <h3 className="text-[20px] font-semibold max-[549px]:text-[30px]">
                {playlistInStore.name}
                <button onClick={() => openModal("edit")} className="p-[5px]">
                  <PencilSquareIcon className="w-[20px]" />
                </button>
              </h3>
              <p className="text-[16px]">{playlistInStore?.count} songs</p>
              <p className="text-[16px]">
                {handleTimeText(playlistInStore?.time)}
              </p>
              <p className="text-[14px] opacity-60 max-[549px]:hidden">
                create by {playlistInStore.by}
              </p>
            </div>

            {/* cta */}
            <div className="flex items-center gap-[12px]">
              <Button
                onClick={() => handlePlayPlaylist()}
                variant={"primary"}
                className={`rounded-full ${theme.content_bg} ${
                  !playlistInStore.song_ids.length &&
                  "opacity-60 pointer-events-none"
                }`}
              >
                Play
                <PlayIcon className="ml-[5px] w-[20px]" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* songs list */}
      <div className="pb-[30px]">
        <div className={`${classes.songListContainer} border-${theme.alpha}`}>
          {(usePlaylistLoading || initialLoading) && (
            <Skeleton className="h-[20px] w-[150px]" />
          )}

          {!isCheckedSong ? (
            <p className={classes.countSongText}>{songCount + " songs"}</p>
          ) : (
            <p className={classes.countSongText}>
              {selectedSongList.length + " selected"}
            </p>
          )}
          {isCheckedSong && userSongs.length && (
            <>
              <Button
                onClick={() => setSelectedSongList(PlaylistSongs)}
                variant={"primary"}
                className={classes.button}
              >
                All
              </Button>
              <Button
                onClick={() => deleteManyFromPlaylist()}
                variant={"primary"}
                className={classes.button}
              >
                Remove
              </Button>
              <Button
                onClick={() => {
                  setIsCheckedSong(false);
                  setSelectedSongList([]);
                }}
                className={`p-[5px]`}
              >
                <XMarkIcon className="w-[20px]" />
              </Button>
            </>
          )}
        </div>

        {(usePlaylistLoading || initialLoading) && SongItemSkeleton}
        {!usePlaylistLoading && !!PlaylistSongs.length && renderPlaylistSongs}

        <div className={classes.buttonAddSongContainer}>
          <Button
            onClick={() => openModal("addSongs")}
            className={`${theme.content_bg} rounded-full`}
            variant={"primary"}
          >
            <PlusCircleIcon className="w-[30px] mr-[5px]" />
            Thêm bài hát
          </Button>
        </div>
      </div>

      {/* popup */}
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
                  onClick={() => openModal("edit")}
                  className={`${theme.content_hover_text}`}
                  variant={"list"}
                >
                  <PencilSquareIcon className="w-[18px] mr-[5px]" />
                  Edit playlist
                </Button>
                <Button
                  onClick={() => openModal("confirm")}
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

      {/* modal */}
      {isOpenModal && (
        <Modal setOpenModal={closeModal}>
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
