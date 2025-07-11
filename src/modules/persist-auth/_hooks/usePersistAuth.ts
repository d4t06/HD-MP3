import { auth, db } from "@/firebase";
import useGetMyMusicPlaylist from "@/pages/my-music/_hooks/useGetMyMusicPlaylist";
import { myGetDoc, myUpdateDoc } from "@/services/firebaseService";
import { useAuthContext } from "@/stores";
import { getLocalStorage } from "@/utils/appHelpers";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useEffect, useRef } from "react";

export default function usePersistAuth() {
  const { setUser, setLoading, loading, user } = useAuthContext();

  const { getPlaylist } = useGetMyMusicPlaylist();

  const ranEffect = useRef(false);

  const handleGetAuth = async () => {
    auth.onAuthStateChanged(async (u) => {
      if (u && u.email) {
        const docRef = await myGetDoc({
          collectionName: "Users",
          id: u.email,
          msg: "usePersistAuth, get user",
        });

        const userDoc = docRef.data() as User | undefined;

        const user: User = {
          email: u.email as string,
          display_name: u.displayName as string,
          photo_url: u.photoURL as string,
          liked_song_ids: userDoc?.liked_song_ids || [],
          recent_playlist_ids: userDoc?.recent_playlist_ids || [],
          recent_song_ids: userDoc?.recent_song_ids || [],
          liked_singer_ids: userDoc?.liked_singer_ids || [],
          role: userDoc?.role || "USER",
          liked_playlist_ids: userDoc?.liked_playlist_ids || [],
          liked_comment_ids: getLocalStorage()["liked_comment_ids"] || [],
          last_seen: "",
        };

        //  new user
        if (!docRef.exists()) await setDoc(doc(db, "Users", user.email), user);
        //  get user liked playlists
        else
          await Promise.all([
            getPlaylist(user),
            myUpdateDoc({
              collectionName: "Users",
              id: user.email,
              data: { last_seen: serverTimestamp() },
              msg: "usePersistAuth, update user doc",
            }),
          ]);

        setUser(user);
      } else setUser(null);
      loading;
      setLoading(false);
    });
  };

  useEffect(() => {
    if (!ranEffect.current) {
      ranEffect.current = true;
      handleGetAuth();
    }
  }, []);

  return { user, loading };
}
