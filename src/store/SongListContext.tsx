import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useMemo } from "react";
import { Song } from "../types";

const initSongListContext = (
   isChecked: boolean,
   selectedSongs: Song[],
   setIsChecked: Dispatch<SetStateAction<boolean>>,
   setSelectedSongs: Dispatch<SetStateAction<Song[]>>
) => {
   return useMemo(
      () => ({
         isChecked,
         setIsChecked,
         selectedSongs,
         setSelectedSongs,
      }),
      [isChecked, selectedSongs]
   );
};
type ContextType = ReturnType<typeof initSongListContext>;

const SongListContext = createContext<ContextType | undefined>(undefined);

export const useSongListContext = () => {
   const context = useContext(SongListContext);

   if (context === undefined) {
      return {
         isChecked: false,
         setIsChecked: () => {},
         selectedSongs: [],
         setSelectedSongs: () => {},
      };
   }
   return context;
};

type ProviderProps = {
   selectedSongs: Song[];
   isChecked: boolean;
   setSelectedSongs: Dispatch<SetStateAction<Song[]>>;
   setIsChecked: Dispatch<SetStateAction<boolean>>;
   children: ReactNode;
};

export const SongListProvider = ({
   children,
   isChecked,
   selectedSongs,
   setIsChecked,
   setSelectedSongs,
}: ProviderProps) => {
   const providerValues = initSongListContext(isChecked, selectedSongs, setIsChecked, setSelectedSongs);
   return <SongListContext.Provider value={providerValues}>{children}</SongListContext.Provider>;
};
