import { useEffect, useState } from "react";
// import useGetMyMusicPlaylist from "./useGetMyMusicPlaylist";
import useGetMyMusicSinger from "./useGetMyMusicSinger";
import useGetMyMusicSong from "./useGetMyMusicSong";
import { useSongContext } from "@/stores";

export default function useMySongPage() {
  const { checkEntireUser } = useSongContext();

  const [isFetching, setIsFetching] = useState(
    checkEntireUser.current ? false : true,
  );

  // const { getPlaylist } = useGetMyMusicPlaylist();
  const { getSinger } = useGetMyMusicSinger();
  const { getSongs } = useGetMyMusicSong({
    tab: "favorite",
  });

  const getContent = async () => {
    try {
      if (import.meta.env.DEV) console.log("useMySongPage, get content ");

      await Promise.all([getSinger(), getSongs()]);

      // const newUserData: Partial<User> = {};

      // if (playlists && playlists.length !== user.liked_playlist_ids.length)
      // 	newUserData["liked_playlist_ids"] = playlists.map((p) => p.id);

      // if (singers && singers.length !== user.liked_singer_ids.length)
      // 	newUserData["liked_singer_ids"] = singers.map((s) => s.id);

      // if (songs && songs.length !== user.liked_song_ids.length)
      // 	newUserData["liked_song_ids"] = songs.map((s) => s.id);

      // if (Object.entries(newUserData).length) {
      // 	myUpdateDoc({
      // 		collectionName: "Users",
      // 		data: newUserData,
      // 		id: user.email,
      // 		msg: "update user data"
      // 	});

      // 	updateUserData(newUserData);
      // }

      // await sleep(1000);
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (!checkEntireUser.current) {
      checkEntireUser.current = true;

      getContent();
    }
  }, []);

  return { isFetching };
}
