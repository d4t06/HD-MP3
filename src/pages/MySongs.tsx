import {
  PlusCircleIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import { Playlist, Song } from "../types";

import { auth, db, store } from "../config/firebase";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useAuthState } from "react-firebase-hooks/auth";

// import { routes } from "../routes";
// import { useNavigate } from "react-router-dom";

import { useTheme } from "../store/ThemeContext";

import { generateSongId } from "../utils/generateSongId";
import { parserImageFile } from "../utils/parserImage";

import Modal from "../components/Modal";
import PopupWrapper from "../components/ui/PopupWrapper";
import PlaylistItem from "../components/ui/PlaylistItem";
import Button from "../components/ui/Button";
import useUserSong from "../hooks/useUserSong";
import MySongsTabs from "../components/MySongsTabs";
import SongListItem from "../components/ui/SongListItem";
import { useDispatch, useSelector } from "react-redux";
import { selectAllSongStore, setSong } from "../store/SongSlice";
import useUploadSongs from "../hooks/useUploadSongs";

interface Props {}

const SongsPage: FC<Props> = () => {
  const dispatch = useDispatch();

  const { theme } = useTheme();

  const { song: songInStore } = useSelector(selectAllSongStore);
  const {
    userData,
    songs: userSongs,
    playlists: userPlaylists,
    setPlaylistIds,
    initial,
    loading,
  } = useUserSong();

  const [openModal, setOpenModal] = useState(false);
  const [playlistName, setPlayListName] = useState<string>("");

  const audioRef = useRef<HTMLAudioElement>(null);
  const { tempSongs, addedSongs, isUpload, handleInputChange } =
    useUploadSongs(audioRef);

  const handleSetSong = (song: Song, index: number) => {
    dispatch(setSong({ ...song, currentIndex: index }));
  };

  const renderTempSongs = () => {
    return tempSongs.map((song, index) => {
      const isAdded = addedSongs.some((id) => id === song.id);
      return (
        <div key={index} className="w-full max-[549px]:w-full">
          <SongListItem
            theme={theme}
            onClick={() => handleSetSong(song, index)}
            active={song.song_path === songInStore.song_path && isAdded}
            inProcess={!isAdded}
            key={index}
            data={song}
          />
        </div>
      );
    });
  };

  const handleAddPlaylist = async () => {
    const playlistId = `${playlistName}_${userData?.email as string}`;

    // add to playlist collection
    await setDoc(doc(db, "playlist", playlistId), {
      by: userData?.email || "users",
      name: playlistName,
      song_ids: [],
      count: 0,
      time: 0,
      image_path: "",
      id: playlistId,
    } as Playlist);

    const newPlaylitsIds = [...userData.playlist_ids, playlistId];

    // update user playlist
    await setDoc(
      doc(db, "users", userData?.email as string),
      {
        playlist_ids: newPlaylitsIds,
      },
      {
        merge: true,
      }
    );
    setOpenModal(false);
    setPlaylistIds(newPlaylitsIds);
  };

  useEffect(() => {
    // no wait here
    (async () => {
      if (!userSongs.length) {
        await initial();
      }
    })();
  }, []);

  console.log("check render mysongs", { userSongs, userPlaylists, userData });

  if (loading) return <h1>Loading...</h1>;

  return (
    <>
      {/* playlist */}
      <div className="pb-[30px] ">
        <div className="flex items-center">
          <h3 className="text-2xl font-bold">Playlist</h3>
          <Button onClick={() => setOpenModal(true)} className="ml-[12px]">
            <PlusIcon className="w-[20px]" />
          </Button>
        </div>

        <div className="flex flex-row -mx-[8px]">
          {!!userPlaylists.length &&
            userPlaylists.map((playList, index) => (
              <div key={index} className="w-1/4 p-[8px]">
                <PlaylistItem theme={theme} data={playList} />
              </div>
            ))}
        </div>
      </div>

      {/* my songs */}
      <div className="pb-[30px] ">
        <div className="flex justify-between">
          <h3 className="text-2xl font-bold">Songs</h3>
          <input
            onChange={handleInputChange}
            type="file"
            multiple
            accept=".mp3"
            id="file"
            className="hidden"
          />
          <audio ref={audioRef}></audio>
          <label
            className={`${theme.content_bg} ${
              isUpload ? "opacity-60 pointer-events-none" : ""
            } rounded-full flex px-[20px] py-[4px] text-white cursor-pointer`}
            htmlFor="file"
          >
            <PlusCircleIcon className="w-[20px] mr-[5px]" />
            Upload
          </label>
        </div>

        <div className="-mx-[8px] mt-[20px]">
          {renderTempSongs()}
          {/* <MySongsTabs /> */}
          {!!userSongs.length ? (
            <>
              {userSongs.map((song, index) => {
                const active = song.id === songInStore.id;
                return (
                  <div key={index} className="w-full max-[549px]:w-full">
                    <SongListItem
                      theme={theme}
                      onClick={() => handleSetSong(song, index)}
                      active={active}
                      key={index}
                      data={song}
                    />
                  </div>
                );
              })}
            </>
          ) : (
            <h1 className="pl-[8px]">No song jet...</h1>
          )}
        </div>
      </div>

      {/* add playlist modal */}
      {openModal && (
        <Modal setOpenModal={setOpenModal}>
          <PopupWrapper theme={theme}>
            <div className="w-[300px]">
              <Button
                className="absolute top-2 right-2 text-white"
                onClick={() => setOpenModal(false)}
              >
                <XMarkIcon className="w-6 h-6" />
              </Button>
              <h2 className="text-[18px] font-semibold text-white">
                Add Playlist
              </h2>
              <input
                className={`bg-${theme.alpha} px-[20px] rounded-full outline-none mt-[10px] text-[16px]  h-[35px] w-full`}
                type="text"
                placeholder="name..."
                value={playlistName}
                onChange={(e) => setPlayListName(e.target.value)}
              />

              <Button
                onClick={() => handleAddPlaylist()}
                variant={"primary"}
                className={`mt-[15px] ${
                  theme.content_bg
                } w-full rounded-full justify-center ${
                  !playlistName && "opacity-60 pointer-events-none"
                }`}
              >
                Save
              </Button>
            </div>
          </PopupWrapper>
        </Modal>
      )}
    </>
  );
};

export default SongsPage;
