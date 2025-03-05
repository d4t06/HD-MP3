import { auth } from "@/firebase";
import { myGetDoc } from "@/services/firebaseService";
import { useAuthContext } from "@/stores";
import { useEffect } from "react";

export default function usePersistAuth() {
  const { setUser, setLoading, loading, user } = useAuthContext();

  useEffect(() => {
    const handleGetAuth = async () => {
      auth.onAuthStateChanged(async (u) => {
        if (u && u.email) {
          const docRef = await myGetDoc({ collectionName: "users", id: u.email });
          const userDoc = docRef.data() as User;

          const user: User = {
            email: u.email as string,
            display_name: u.displayName as string,
            photo_url: u.photoURL as string,
            liked_song_ids: userDoc.liked_song_ids || [],
            play_history: userDoc.play_history || [],
            role: userDoc.role,
          };

          setUser(user);
        } else setUser(null);

        setLoading(false);
      });
    };

    handleGetAuth();
  }, []);

  return { user, loading };
}
