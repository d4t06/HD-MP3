import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";

import { Playlist, Song, ThemeType, User } from "../types";
import Button from "./ui/Button";
import {
  ArrowPathIcon,
  Bars3Icon,
  CheckIcon,
  DocumentMagnifyingGlassIcon,
  DocumentPlusIcon,
  HeartIcon,
  MinusCircleIcon,
  MusicalNoteIcon,
  PauseCircleIcon,
  PencilSquareIcon,
  PlusCircleIcon,
  StopIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import {
  handleTimeText,
  updatePlaylistsValue,
  updateSongsListValue,
} from "../utils/appHelpers";
import {
  FloatingFocusManager,
  autoPlacement,
  autoUpdate,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
} from "@floating-ui/react";
import PopupWrapper from "./ui/PopupWrapper";
import Modal, { confirmModal } from "./Modal";
import { Link } from "react-router-dom";
import {
  deleteFile,
  deleteSong,
  mySetDoc,
  setUserSongIdsAndCountDoc,
} from "../utils/firebaseHelpers";
import { useToast } from "../store/ToastContext";
import Image from "./ui/Image";
import { useDispatch, useSelector } from "react-redux";
import { selectAllSongStore, setPlaylist } from "../store/SongSlice";

import SongItemEditForm from "./child/SongItemEditForm";

type ModalName = "ADD_PLAYLIST";

interface Props {
  data: Song;
  active?: boolean;
  onClick?: () => void;
  theme: ThemeType & { alpha: string };
  inProcess?: boolean;
  inPlaylist?: boolean;

  userData?: User;
  userSongs?: Song[];
  userPlaylists?: Playlist[];
  setUserSongs?: (userSongs: Song[]) => void;
  setUserPlaylists?: (userPlaylists: Playlist[], adminPlaylists: []) => void;
  deleteFromPlaylist?: (song: Song) => void;

  isCheckedSong?: boolean;
  selectedSongList?: Song[];

  setSelectedSongList?: Dispatch<SetStateAction<Song[]>>;
  setIsCheckedSong?: Dispatch<SetStateAction<boolean>>;

  handleOpenParentModal?: (name: ModalName) => void;
}

export default function SongListItem({
  data,
  active,
  onClick,
  theme,
  inProcess,
  inPlaylist,

  // song context
  userData,
  userSongs,
  userPlaylists,
  setUserSongs,
  setUserPlaylists,

  // call back function
  deleteFromPlaylist,

  // for selected
  selectedSongList,
  isCheckedSong,
  setSelectedSongList,
  setIsCheckedSong,

  handleOpenParentModal,
}: Props) {
  // user store
  const dispatch = useDispatch();
  const { setErrorToast, setSuccessToast } = useToast();
  const { playlist: playlistInStore, song: songInStore } =
    useSelector(selectAllSongStore);

  // state
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpenPopup, setIsOpenPopup] = useState<boolean>(false);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [modalComponent, setModalComponent] = useState<string>();

  // floating ui
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

  // define call back functions
  const isSelected = useMemo(() => {
    if (!selectedSongList) return false;
    return selectedSongList?.indexOf(data) != -1;
  }, [selectedSongList]);

  const isOnMobile = useMemo(() => {
    return window.innerWidth < 550;
  }, []);

  // define callback functions
  const handleOpenModal = (name: string) => {
    setModalComponent(name);
    setIsOpenModal(true);
  };

  const closeModal = () => {
    setLoading(false);
    setIsOpenModal(false);
  };

  // songInStore, data, userSongs
  const handleDeleteSong = useCallback(async () => {
    if (!userData || !userSongs || !setUserSongs || !setUserPlaylists) return;

    try {
      setLoading(true);

      if (songInStore.id === data.id) {
        setErrorToast({});
        return;
      }

      // if song added in some playlist
      if (data.in_playlist.length && userPlaylists?.length) {
        const newUserPlaylist = [...userPlaylists];

        for (let playlistId of data.in_playlist) {
          const index = userPlaylists.findIndex(
            (playlist) => playlist.id === playlistId
          );
          const playlist = userPlaylists[index];

          const newPlaylistSongIds = [...playlist.song_ids];
          newPlaylistSongIds.splice(newPlaylistSongIds.indexOf(data.id), 1);

          // update playlist
          const newPlaylist: Playlist = {
            ...playlist,
            song_ids: newPlaylistSongIds,
            time: playlist.time - data.duration,
            count: playlist.count - 1,
          };

          updatePlaylistsValue(newPlaylist, newUserPlaylist);

          //  if user is playing this playlist
          if (playlistInStore.id === newPlaylist.id) {
            dispatch(setPlaylist(newPlaylist));
          }

          await mySetDoc({
            collection: "playlist",
            data: newPlaylist,
            id: newPlaylist.id,
          });
        }
        setUserPlaylists(newUserPlaylist, []);
      }

      // if song has image upload by user
      if (data.image_file_path) {
        await deleteFile({ filePath: data.image_file_path });
      }

      // delete file, song doc and lyric doc
      await deleteSong(data);

      let newUserSongs = [...userSongs];
      const index = newUserSongs.indexOf(data);
      newUserSongs.splice(index, 1);

      const newUserSongIds = newUserSongs.map((songItem) => songItem.id);
      await setUserSongIdsAndCountDoc({ songIds: newUserSongIds, userData });

      // set user songs
      setUserSongs(newUserSongs);
      // set toast
      setSuccessToast({ message: `'${data.name}' deleted` });
    } catch (error) {
      console.log({ message: error });
      setErrorToast({});
    } finally {
      closeModal();
    }
  }, [userSongs, songInStore, data]);

  // userSongs
  const handleAddSongToPlaylist = useCallback(
    async (song: Song, playlist: Playlist) => {
      if (!song || !playlist || !userSongs || !setUserSongs) return;

      const newSongIds = [...playlist.song_ids, song.id];
      const time = playlist.time + song.duration;

      const newPlaylist: Playlist = {
        ...playlist,
        time,
        song_ids: newSongIds,
        count: newSongIds.length,
      };

      const newSong: Song = {
        ...song,
        in_playlist: [...song.in_playlist, playlist.id],
      };
      await mySetDoc({ collection: "songs", data: newSong, id: newSong.id });
      const newUserSongs = [...userSongs];
      updateSongsListValue(newSong, newUserSongs);

      setUserSongs(newUserSongs);

      // await setPlaylistDocAndSetUserPlaylists({ newPlaylist });

      setIsOpenPopup(false);
      setSuccessToast({ message: `'${data.name}' added to ${playlist.name}` });
    },
    [userSongs]
  );

  //selectedSongList
  const handleSelect = useCallback(
    (song: Song) => {
      if (!setSelectedSongList || !selectedSongList || !setIsCheckedSong) {
        setErrorToast({});
        return;
      }
      setIsCheckedSong(true);

      let list = [...selectedSongList];
      const index = list.indexOf(song);

      // if no present
      if (index === -1) {
        list.push(song);

        // if present
      } else {
        list.splice(index, 1);
      }
      setSelectedSongList(list);
      if (!list.length) setIsCheckedSong(false);
    },
    [selectedSongList]
  );

  // define style
  const classes = {
    textColor: theme.type === "light" ? "text-[#333]" : "text-[#fff]",
    button: `${theme.content_hover_bg} p-[8px] rounded-full`,
    songListButton: `mr-[10px] text-${theme.alpha} group-hover/main:text-[inherit]`,
    itemContainer: `border-b border-${theme.alpha} ${
      window.innerWidth > 549 && "p-[0px] hover:bg-" + theme.alpha
    }  ${isSelected && "bg-" + theme.alpha}`,
    imageFrame: `h-[54px] w-[54px] relative rounded-[4px] overflow-hidden group/image flex-shrink-0`,
    before: `after:content-[''] after:absolute after:h-[100%] after:w-[10px] after:right-[100%]`,
    input: `px-[10px] py-[5px] rounded-[4px] bg-transparent border border-${theme.alpha} text-[14px] font-[500]`,
  };

  // data, isCheckedSong, isSelected, inProcess, active
  const songComponent = useMemo(
    () => (
      <>
        <div className={`flex flex-row ${inProcess ? "opacity-60" : ""}`}>
          <>
            {/* check box */}
            {!inProcess ? (
              <>
                {!isCheckedSong ? (
                  <>
                    <button
                      onClick={() => handleSelect(data)}
                      className={`${classes.songListButton} hidden group-hover/main:block`}
                    >
                      <StopIcon className="w-[18px] " />
                    </button>
                    <button
                      className={`${classes.songListButton} group-hover/main:hidden group-hover/main:mr-[0px]`}
                    >
                      <MusicalNoteIcon className="w-[18px]" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleSelect(data)}
                    className={`${classes.songListButton} text-[inherit]`}
                  >
                    {!isSelected ? (
                      <StopIcon className="w-[18px]" />
                    ) : (
                      <CheckIcon className="w-[18px]" />
                    )}
                  </button>
                )}
              </>
            ) : (
              <button className={`${classes.songListButton}`}>
                <MusicalNoteIcon className="w-[18px]" />
              </button>
            )}
          </>

          {/* song image */}
          <div className={`${classes.imageFrame}`}>
            <Image src={data.image_url} />

            {/* hidden when in process and in list */}

            {!inProcess && (
              <>
                {active ? (
                  <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                    <div className="relative h-[18px] w-[18px]">
                      <img
                        src="https://zmp3-static.zmdcdn.me/skins/zmp3-v6.1/images/icons/icon-playing.gif"
                        alt=""
                      />
                    </div>
                  </div>
                ) : (
                  <div
                    className="absolute  inset-0 bg-black bg-opacity-60 
    songContainers-center justify-center items-center hidden group-hover/image:flex"
                  >
                    <Button
                      onClick={onClick}
                      variant={"default"}
                      className="h-[25px] w-[25px] text-white"
                    >
                      <PauseCircleIcon />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* song info */}
          <div className="ml-[10px]">
            <h5 className="text-mg line-clamp-1">{data.name}</h5>
            <p className="text-xs text-gray-500 line-clamp-1">{data.singer}</p>
          </div>
        </div>
      </>
    ),
    [isCheckedSong, isSelected, inProcess, active, data]
  );

//   theme, userPlaylists, data, handleAddSongToPlaylist, deleteFromPlaylist
  const menuComoponent = useMemo(
    () => (
      <div className="w-[200px]">
        {!isOnMobile && (
          <>
            <h5 className="text-mg line-clamp-1">{data.name}</h5>
            <p className="text-xs text-gray-500 line-clamp-1">{data.singer}</p>
          </>
        )}

        {!inPlaylist ? (
          <Button
            className={`mt-[15px] group relative ${theme.content_hover_text} ${classes.before}`}
            variant={"list"}
          >
            <PlusCircleIcon className="w-[18px] mr-[5px]" />
            Thêm vào playlist
            {/* level 2 */}
            <PopupWrapper
              classNames="w-[100%] absolute right-[calc(100%+5px)] hidden group-hover:block hover:block"
              theme={theme}
            >
              {/* playlist */}
              <ul className="w-[150px]">
                {!!userPlaylists?.length && (
                  <>
                    {userPlaylists.map((playlist, index) => {
                      const isAdded = playlist.song_ids.includes(data.id);
                      return (
                        <li
                          key={index}
                          onClick={() =>
                            !isAdded && handleAddSongToPlaylist(data, playlist)
                          }
                          className={`list-none flex rounded-[4px] p-[5px] ${
                            isAdded && "opacity-60"
                          } ${!isAdded && theme.content_hover_text}`}
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
                <li
                  onClick={() =>
                    handleOpenParentModal &&
                    handleOpenParentModal("ADD_PLAYLIST")
                  }
                  className={`list-none flex rounded-[4px] p-[5px] ${theme.content_hover_text}`}
                >
                  <PlusCircleIcon className={`w-[18px] mr-[5px]`} />
                  Add new playlist
                </li>
              </ul>
            </PopupWrapper>
          </Button>
        ) : (
          <Button
            className={`mt-[15px] ${theme.content_hover_text}`}
            variant={"list"}
            onClick={() => deleteFromPlaylist && deleteFromPlaylist(data)}
          >
            <MinusCircleIcon className="w-[18px] mr-[5px]" />
            Xóa khõi playlist
          </Button>
        )}

        {data.by != "admin" && (
          <>
            <Button
              onClick={() => handleOpenModal("edit")}
              className={`${theme.content_hover_text}`}
              variant={"list"}
            >
              <PencilSquareIcon className="w-[18px] mr-[5px]" />
              Chỉnh Sửa
            </Button>

            {data.lyric_id ? (
              <Button
                className={`${theme.content_hover_text}`}
                variant={"list"}
                onClick={() => handleOpenModal("edit")}
              >
                <DocumentMagnifyingGlassIcon className="w-[18px] mr-[5px]" />
                Chỉnh sủa lời bài hát
              </Button>
            ) : (
              <Link to={`/React-Zingmp3/edit/${data.id}`}>
                <Button
                  className={`${theme.content_hover_text}`}
                  variant={"list"}
                >
                  <DocumentPlusIcon className="w-[18px] mr-[5px]" />
                  Thêm lời bài hát
                </Button>
              </Link>
            )}

            {!active && (
              <Button
                onClick={() => handleOpenModal("confirm")}
                className={`${theme.content_hover_text}`}
                variant={"list"}
              >
                <TrashIcon className="w-[18px] mr-[5px]" />
                Xóa
              </Button>
            )}
          </>
        )}

        <p className="opacity-60 text-center text-[13px] mt-[10px">
          Thêm bởi {data.by}
        </p>
      </div>
    ),
    [theme, userPlaylists, data, handleAddSongToPlaylist, deleteFromPlaylist]
  );

  // loading, theme, userSongs, data, songInStore
  const dialogComponent = useMemo(
    () =>
      confirmModal({
        loading: loading,
        label: "Wait a minute",
        theme: theme,
        callback: handleDeleteSong,
        setOpenModal: setIsOpenModal,
      }),
    [loading, theme, userSongs, data, songInStore]
  );

  return (
    <div
      className={`${
        !inProcess && "group/main"
      } flex flex-row rounded justify-between songContainers-center px-[10px] py-[10px] max-[549px]:px-[0px] ${
        classes.itemContainer
      }`}
    >
      {/* left */}
      {songComponent}

      {/* right (cta) */}
      {inProcess ? (
        <div className="flex items-center">
          <span>
            <ArrowPathIcon className="w-[20px] mr-[10px] animate-spin" />
          </span>
          <p className="text-[14px]">In process...</p>
        </div>
      ) : (
        <>
          <div className="flex flex-row items-center gap-x-[5px]">
            <Button
              className={`${classes.button} ${
                theme.type === "light"
                  ? "hover:text-[#333]"
                  : "hover:text-white"
              }`}
            >
              <HeartIcon className="w-[20px]" />
            </Button>

            <div className="w-[80px] flex justify-center songContainers-center">
              <button
                ref={refs.setReference}
                {...getReferenceProps()}
                className={`group-hover/main:block ${classes.button}
            ${isOpenPopup ? "block cursor-default" : "hidden "}
            ${theme.type === "light" ? "hover:text-[#333]" : "hover:text-white"}
            max-[549px]:block
            `}
              >
                <Bars3Icon className="w-[20px]" />
              </button>
              <span
                className={`text-[12px] group-hover/main:hidden ${
                  isOpenPopup && "hidden"
                } max-[549px]:hidden`}
              >
                {handleTimeText(data.duration)}
              </span>
            </div>
          </div>
        </>
      )}

      {/* song item menu */}
      {/* {useMemo(
            () =>
               ,
            [isOpenPopup, inProcess, userPlaylists]
         )} */}

      {isOpenPopup && !inProcess && (
        <FloatingFocusManager context={context} modal={false}>
          <div
            className="z-[99]"
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
          >
            <PopupWrapper theme={theme}>{menuComoponent}</PopupWrapper>
          </div>
        </FloatingFocusManager>
      )}

      {isOpenModal && !inProcess && (
        <Modal setOpenModal={setIsOpenModal}>
          <PopupWrapper theme={theme}>
            {modalComponent === "edit" && (
              <SongItemEditForm
                setIsOpenModal={setIsOpenModal}
                setUserSongs={setUserSongs}
                theme={theme}
                userSongs={userSongs}
                data={data}
              />
            )}
            {modalComponent === "confirm" && dialogComponent}
          </PopupWrapper>
        </Modal>
      )}
    </div>
  );
}
