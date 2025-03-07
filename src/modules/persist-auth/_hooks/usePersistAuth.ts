import { auth } from "@/firebase";
import { myGetDoc, myAddDoc } from "@/services/firebaseService";
import { useAuthContext } from "@/stores";
import { useEffect } from "react";

export default function usePersistAuth() {
  const { setUser, setLoading, loading, user } = useAuthContext();

  useEffect(() => {
    const handleGetAuth = async () => {
      auth.onAuthStateChanged(async (u) => {
        if (u && u.email) {
          const docRef = await myGetDoc({ collectionName: "Users", id: u.email });

          const userDoc = docRef.data() as User;

          const user: User = {
            email: u.email as string,
            display_name: u.displayName as string,
            photo_url: u.photoURL as string,
            liked_song_ids: userDoc?.liked_song_ids || [],
            recent_playlist_ids: userDoc?.recent_playlist_ids || [],
            recent_song_ids: userDoc?.recent_song_ids || [],
            role: userDoc?.role || "USER",
            playlist_ids: userDoc?.playlist_ids || [],
          };

          if (!docRef.exists()) await myAddDoc({ collectionName: "Users", data: user });

          setUser(user);
        } else setUser(null);

        setLoading(false);
      });
    };

    handleGetAuth();
  }, []);

  return { user, loading };
}
