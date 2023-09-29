import { PlusCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { ReactNode, useRef, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { nanoid } from "nanoid";
import { useDispatch, useSelector } from "react-redux";

import { Playlist, Song } from "../types";

// store
import { useTheme } from "../store/ThemeContext";
import { selectAllSongStore, setPlaylist, setSong } from "../store/SongSlice";
import { useSongsStore } from "../store/SongsContext";
import { useToast } from "../store/ToastContext";

// utils
import { routes } from "../routes";
import { db } from "../config/firebase";
import { doc, setDoc } from "firebase/firestore";
import { generateId } from "../utils/appHelpers";
import {
  deleteSong,
  setUserPlaylistIdsDoc,
  setUserSongIdsAndCountDoc,
} from "../utils/firebaseHelpers";

// hooks
import useUploadSongs from "../hooks/useUploadSongs";
import useSongItemActions from "../hooks/useSongItemActions";

// components
import Empty from "../components/ui/Empty";
import Skeleton from "../components/skeleton";
import MobileSongItem from "../components/ui/MobileSongItem";
import Modal, { confirmModal } from "../components/Modal";
import PopupWrapper from "../components/ui/PopupWrapper";
import PlaylistItem from "../components/ui/PlaylistItem";
import Button from "../components/ui/Button";
import useSongs from "../hooks/useSongs";
import SongItem from "../components/ui/SongItem";

type ModalName = "ADD_PLAYLIST" | "CONFIRM";

export default function MySongsPage() {
  // use store
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const { setToasts, setErrorToast, setSuccessToast } = useToast();
  const { loading: useSongsloading, errorMsg, initial } = useSongs();
  const { song: songInStore, playlist: playlistInStore } =
    useSelector(selectAllSongStore);

  const { userData, userSongs, userPlaylists, setUserSongs, setUserPlaylists } =
    useSongsStore();

  // define state
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [modalName, setModalName] = useState<ModalName>("ADD_PLAYLIST");
  const [playlistName, setPlayListName] = useState<string>("");

  const navigate = useNavigate();

  //  for delete song
  const [selectedSongList, setSelectedSongList] = useState<Song[]>([]);
  const [isCheckedSong, setIsCheckedSong] = useState(false);

  // useUploadSong
  const audioRef = useRef<HTMLAudioElement>(null);
  const message = useRef<string>("");
  const { tempSongs, addedSongIds, status, handleInputChange } = useUploadSongs(
    {
      audioRef,
      message,
    }
  );

  // define callback functions
  const handleOpenModal = (name: ModalName) => {
    setModalName(name);
    setOpenModal(true);
  };

  const handleSetSong = (song: Song, index: number) => {
    if (songInStore.name != song.name) {
      dispatch(setSong({ ...song, currentIndex: index, song_in: "user" }));
    }
  };

  const songCount = useMemo(() => {
    if (useSongsloading || !initial) return;
    // console.log("count song");
    return tempSongs.length + userSongs.length;
  }, [tempSongs, userSongs]);

  const isOnMobile = useMemo(() => {
    return window.innerWidth < 550;
  }, []);

  const resetCheckedList = () => {
    setSelectedSongList([]);
    setIsCheckedSong(false);
  };

  const closeModal = () => {
    setLoading(false);
    setOpenModal(false);
  };

  const handleDeleteSongs = async () => {
    const newUserSongs = [...userSongs];

    try {
      setLoading(true);
      // loop each selected song
      for (let song of selectedSongList) {
        await deleteSong(song);
        newUserSongs.splice(newUserSongs.indexOf(song), 1);
      }

      // update song_ids, song_count to user doc
      const userSongIds: string[] = newUserSongs.map((song) => song.id);
      setUserSongIdsAndCountDoc({ songIds: userSongIds, userData });

      setUserSongs(newUserSongs);

      resetCheckedList();
      closeModal();
      setSuccessToast({ message: `${selectedSongList.length} songs deleted` });
    } catch (error) {
      setErrorToast({});
    }
  };

  const handleAddPlaylist = async () => {
    const playlistId = generateId(playlistName, userData.email);

    if (!playlistId || !playlistName || !userData) {
      setErrorToast({});
      return;
    }

    const addedPlaylist: Playlist = {
      id: playlistId,
      image_by: "",
      image_file_path: "",
      image_url: "",
      by: userData?.email || "users",
      name: playlistName,
      song_ids: [],
      count: 0,
      time: 0,
    };

    // insert new playlist to users playlist
    const newPlaylists = [...userPlaylists, addedPlaylist];

    try {
      setLoading(true);
      // add to playlist collection
      await setDoc(doc(db, "playlist", playlistId), addedPlaylist);

      // update user doc
      await setUserPlaylistIdsDoc(newPlaylists, userData);

      // update context store user playlists
      setUserPlaylists(newPlaylists, []);
      closeModal();
      setPlayListName("");

      setSuccessToast({ message: `'${playlistName}' created` });
    } catch (error) {
      setErrorToast({});
    }
  };

  const handleOpenPlaylist = (playlist: Playlist) => {
    // if this playlist current in store
    if (playlistInStore.name != playlist.name) dispatch(setPlaylist(playlist));

    navigate(`${routes.Playlist}/${playlist.name}`);
  };

  // define jsx
  const renderTempSongs = useMemo(() => {
    return tempSongs.map((song, index) => {
      const isAdded = addedSongIds.some((id) => {
        let condition = id === song.id;
        return condition;
      });

      return (
        <div key={index} className="w-full max-[549px]:w-full">
          <SongItem
            theme={theme}
            inProcess={!isAdded}
            key={index}
            data={song}
          />
        </div>
      );
    });
  }, [tempSongs]);

  const renderUserSongs = useMemo(() => {
    return userSongs.map((song, index) => {
      const active =
        song.id === songInStore.id && songInStore.song_in === "user";

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
          <SongItem
            theme={theme}
            onClick={() => handleSetSong(song, index)}
            active={active}
            key={index}
            data={song}
            userData={userData}
            userSongs={userSongs}
            userPlaylists={userPlaylists}
            setUserSongs={setUserSongs}
            isCheckedSong={isCheckedSong}
            setIsCheckedSong={setIsCheckedSong}
            selectedSongList={selectedSongList}
            setSelectedSongList={setSelectedSongList}
            handleOpenParentModal={handleOpenModal}
          />
        </div>
      );
    });
  }, [userSongs, songInStore]);

  // define classes
  const classes = {
    button: `${theme.content_bg} rounded-full`,
  };

  // define modals
  const useConfirmModal = useMemo(
    () =>
      confirmModal({
        loading: loading,
        label: "Wait a minute",
        theme: theme,
        callback: handleDeleteSongs,
        setOpenModal: setOpenModal,
      }),
    [loading, theme, selectedSongList]
  );

  const addPlaylistModal = (
    <div className="w-[300px]">
      <Button
        className="absolute top-2 right-2 text-white"
        onClick={() => setOpenModal(false)}
      >
        <XMarkIcon className="w-6 h-6" />
      </Button>
      <h2 className="text-[18px] font-semibold text-white">Add Playlist</h2>
      <input
        className={`bg-${theme.alpha} px-[20px] rounded-full outline-none mt-[10px] text-[16px]  h-[35px] w-full`}
        type="text"
        placeholder="name..."
        value={playlistName}
        onChange={(e) => setPlayListName(e.target.value)}
      />

      <Button
        isLoading={loading}
        onClick={() => handleAddPlaylist()}
        variant={"primary"}
        className={`${classes.button} mt-[15px]`}
      >
        Save
      </Button>
    </div>
  );

  const ModalPopup: Record<ModalName, ReactNode> = {
    ADD_PLAYLIST: addPlaylistModal,
    CONFIRM: useConfirmModal,
  };

  // define skeleton
  const playlistSkeleton = [...Array(2).keys()].map((index) => {
    return (
      <div key={index} className="w-1/4 p-[8px] max-[459px]:w-1/2">
        <Skeleton className="pt-[100%] rounded-[8px]" />
        <Skeleton className="h-[20px] mt-[9px] w-[50%]" />
      </div>
    );
  });

  const SongItemSkeleton = [...Array(5).keys()].map((index) => {
    return (
      <div key={index} className="flex items-center p-[10px]">
        <Skeleton className="h-[18px] w-[18px]" />

        <Skeleton className="h-[54px] w-[54px] ml-[10px] rounded-[4px]" />
        <div className="ml-[10px]">
          <Skeleton className="h-[20px] mb-[5px] w-[150px]" />
          <Skeleton className="h-[12px] mt-[5px] w-[100px]" />
        </div>
      </div>
    );
  });

  if (errorMsg) return <h1>{errorMsg}</h1>;

  return (
    <>
      {/* playlist */}
      <div className="pb-[30px] ">
        <h3 className="text-2xl font-bold mb-[10px]">Playlist</h3>
        <div className="flex flex-row -mx-[8px] flex-wrap">
          {!!userPlaylists.length &&
            !useSongsloading &&
            userPlaylists.map((playList, index) => (
              <div key={index} className="w-1/4 p-[8px] max-[459px]:w-1/2">
                <PlaylistItem
                  onClick={() => handleOpenPlaylist(playList)}
                  theme={theme}
                  data={playList}
                  userPlaylists={userPlaylists}
                  userData={userData}
                  setUserPlaylists={setUserPlaylists}
                />
              </div>
            ))}
          {!useSongsloading && (
            <div className="w-1/4 p-[8px] max-[459px]:w-1/2 mb-[25px]">
              <Empty
                theme={theme}
                className="pt-[100%]"
                onClick={() => handleOpenModal("ADD_PLAYLIST")}
              />
            </div>
          )}
          {useSongsloading && playlistSkeleton}
        </div>
      </div>

      {/* song list */}
      <div className="pb-[30px] max-[549px]:pb-[80px]">
        {/* title */}
        <div className="flex justify-between mb-[10px]">
          <h3 className="text-2xl font-bold">Songs</h3>
          <input
            onChange={handleInputChange}
            type="file"
            multiple
            accept=".mp3"
            id="file"
            className="hidden"
          />
          <audio ref={audioRef} className="hidden" />
          <div className="flex items-center">
            <label
              className={`${theme.content_bg} ${
                status === "uploading" || useSongsloading
                  ? "opacity-60 pointer-events-none"
                  : ""
              } rounded-full flex px-[20px] py-[4px] text-white cursor-pointer`}
              htmlFor="file"
            >
              <PlusCircleIcon className="w-[20px] mr-[5px]" />
              Upload
            </label>
          </div>
        </div>

        {/* song list */}
        <div
          className={`flex gap-[12px] items-center border-b border-${theme.alpha} h-[50px] mb-[10px]`}
        >
          {useSongsloading && <Skeleton className="h-[20px] w-[150px]" />}

          {!useSongsloading && (
            <>
              {!isCheckedSong ? (
                <p
                  className={`text-[14px]] font-semibold text-gray-500 w-[100px]`}
                >
                  {songCount + " songs"}
                </p>
              ) : (
                <p
                  className={`text-[14px]] font-semibold text-gray-500 w-[100px]`}
                >
                  {selectedSongList.length + " selected"}
                </p>
              )}
            </>
          )}
          {isCheckedSong && userSongs.length && (
            <>
              <Button
                onClick={() => setSelectedSongList(userSongs)}
                variant={"primary"}
                className={classes.button}
              >
                All
              </Button>
              <Button
                onClick={() => handleOpenModal("CONFIRM")}
                variant={"primary"}
                className={classes.button}
              >
                Delete
              </Button>
              <Button
                onClick={() => {
                  setIsCheckedSong(false);
                  setSelectedSongList([]);
                }}
                className={`px-[5px]`}
              >
                <XMarkIcon className="w-[25px]" />
              </Button>
            </>
          )}
        </div>
        <div className="-mx-[8px] min-h-[50vh]">
          {songCount && !useSongsloading ? (
            <>
              {!!tempSongs.length && renderTempSongs}
              {!!userSongs.length && renderUserSongs}
            </>
          ) : (
            <></>
          )}

          {useSongsloading && SongItemSkeleton}
        </div>
      </div>

      {/* add playlist modal */}
      {openModal && (
        <Modal setOpenModal={setOpenModal}>
          <PopupWrapper theme={theme}>{ModalPopup[modalName]}</PopupWrapper>
        </Modal>
      )}
    </>
  );
}
