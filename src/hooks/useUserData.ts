import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../config/firebase";
import { useEffect, useState } from "react";
import { User } from "../types";
import { collection, doc, getDoc } from "firebase/firestore";


type userData = {
   song_ids: string[];
   playlist_ids: string[];
   email: string;
}

export default function useUserData() {
   const [loggedInUser] = useAuthState(auth);

   const [userData, setUserData] = useState<userData>({ song_ids: [], playlist_ids: [], email: "" });



   return { userData }
}