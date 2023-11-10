import { Playlist, Song } from "../types";
import { PlaylistParamsType } from "../routes";

import {
  useEffect,
  useState,
  MutableRefObject,
  useCallback,
  useRef,
  useMemo,
} from "react";

import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { useSongs } from "../hooks";

import { db } from "../config/firebase";
import { Status } from "../store/SongSlice";
import {
  generatePlaylistAfterChangeSongs,
  sleep,
  updatePlaylistsValue,
} from "../utils/appHelpers";
import { mySetDoc } from "../utils/firebaseHelpers";
import { collection, getDocs, query, where } from "firebase/firestore";
import {
  useAuthStore,
  useSongsStore,
  selectAllSongStore,
  setPlaylist,
  useActuallySongs,
} from "../store";
import appConfig from "../config/app";
import { setPlayStatus } from "../store/PlayStatusSlice";

type Props = {
  playlistInStore: Playlist;
  songInStore: Song & Status;
  firstTimeRender: MutableRefObject<boolean>;
  admin?: boolean;
};

export default function usePlaylistDetail({ admin }: Props) {
  // use store
  const dispatch = useDispatch();
  const { userInfo } = useAuthStore();
  const { setActuallySongs } = useActuallySongs();
  const { song: songInStore, playlist: playlistInStore } =
    useSelector(selectAllSongStore);
  const { errorMsg, initial } = useSongs({ admin });
  const {
    adminSongs,
    userSongs,
    userPlaylists,
    setUserPlaylists,
    adminPlaylists,
    setAdminPlaylists,
  } = useSongsStore();

  // state
  const [loading, setLoading] = useState(true);
  const [playlistSongs, setPlaylistSongs] = useState<Song[]>([]);
  const [someThingToTrigger, setSomeThingToTrigger] = useState(0);
  const firstTimeRun = useRef(true);

  // use hook
  const params = useParams<PlaylistParamsType>();
  const navigate = useNavigate();

  const targetPlaylists = useMemo(
    () => [...adminPlaylists, ...userPlaylists],
    [adminPlaylists, userPlaylists]
  );

  // set playlist slice
  const getAndSetPlaylist = useCallback(async () => {
    const playlist = targetPlaylists.find((playlist) => playlist.id === params.id);

    if (playlist) {
      console.log(">>> local: set playlist");
      dispatch(setPlaylist(playlist));
      dispatch(setPlayStatus({ isRepeatPlaylist: false }));
      setSomeThingToTrigger(Math.random());
    } else {
      console.log("Playlist not found");
      navigate("/");
    }
  }, [params, userInfo]);

  const handlePlaylistWhenSongsModified = async (songs: Song[]) => {
    console.log(">>> handle playlist, song modified");
    const newPlaylist = generatePlaylistAfterChangeSongs({
      existingPlaylist: playlistInStore,
      newPlaylistSongs: songs,
    });

    await mySetDoc({
      collection: "playlist",
      data: newPlaylist,
      id: playlistInStore.id,
      msg: ">>> api: update playlist doc",
    });

    dispatch(setPlaylist(newPlaylist));
  };

  const getPlaylistSongs = useCallback(async () => {
    console.log(">>> api: get playlist songs");

    setLoading(true);
    const songsRef = collection(db, "songs");

    const queryGetSongs = query(songsRef, where("id", "in", playlistInStore.song_ids));
    const songsSnap = await getDocs(queryGetSongs);

    if (songsSnap.docs) {
      const songs = songsSnap.docs.map((doc) => doc.data() as Song);
      setPlaylistSongs(songs);

      // case actually song length do not match with data
      if (songs.length != playlistInStore.song_ids.length) {
        console.log(">>> handle playlist, song modified");
        await handlePlaylistWhenSongsModified(songs);
      }
      // finish
      await sleep(appConfig.loadingDuration);
      setLoading(false);
    }
  }, [playlistInStore.song_ids, userSongs, adminSongs, playlistSongs]);

  const handleGetPlaylistImage = async () => {
    const firstSongHasImage = playlistSongs.find((song) => song.image_url);
    if (!firstSongHasImage) return;

    // case both images  same
    if (
      playlistInStore.image_url &&
      playlistInStore.image_url === firstSongHasImage.image_url
    )
      return;

    const newPlaylist: Playlist = {
      ...playlistInStore,
      image_url: firstSongHasImage.image_url,
      blurhash_encode: firstSongHasImage.blurhash_encode || "",
    };

    await mySetDoc({
      collection: "playlist",
      id: playlistInStore.id,
      data: newPlaylist,
      msg: ">>> api: update image_url playlist doc",
    });
    // get new user playlist
    const newTargetPlaylists = [...targetPlaylists];
    updatePlaylistsValue(newPlaylist, newTargetPlaylists);

    // *** admin case
    if (admin) setAdminPlaylists(newTargetPlaylists);
    // *** user case
    else setUserPlaylists(newTargetPlaylists, []);

    dispatch(setPlaylist(newPlaylist));
  };

  const handleUpdateActuallySongs = () => {
    const isPlayingPlaylist = songInStore.song_in.includes(playlistInStore.name);
    if (!isPlayingPlaylist) {
      return;
    }
    setActuallySongs(playlistSongs);
  };

  useEffect(() => {
    if (admin && !initial) navigate("/dashboard");
  }, []);

  // get playlist after initial
  useEffect(() => {
    if (!initial || errorMsg) return;

    if (firstTimeRun.current) {
      firstTimeRun.current = false;

      if (playlistInStore.id === params.id) {
        console.log("Already have playlist");
        // getPlaylistSongs();
        setSomeThingToTrigger(Math.random());
        return;
      }

      getAndSetPlaylist();
    }
  }, [initial]);

  // get playlist songs
  useEffect(() => {
    if (!someThingToTrigger || errorMsg) return;

    // case playlist no have songs
    if (!playlistInStore.song_ids.length) {
      setTimeout(() => {
        setLoading(false);
      }, appConfig.loadingDuration);
      return;
    }

    getPlaylistSongs();
  }, [someThingToTrigger]);

  // for update playlist feature image
  useEffect(() => {
    if (!initial) return;
    if (!playlistSongs.length) return;

    handleGetPlaylistImage();
  }, [playlistSongs]);

  // for actually song after user add or remove song from playlist
  // only run when after play song in playlist then playlist songs change
  useEffect(() => {
    if (admin) return;

    if (playlistSongs.length) handleUpdateActuallySongs();
  }, [playlistSongs]);

  return { playlistSongs, loading, setPlaylistSongs };
}
