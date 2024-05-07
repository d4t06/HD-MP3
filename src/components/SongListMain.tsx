import { ReactNode, useState } from "react";
import { SongListProvider } from "../store/SongListContext";

type Props = {
   children: ReactNode;
};

export default function SongListMain({ children }: Props) {
   const [isChecked, setIsChecked] = useState(false);
   const [selectedSongs, setSelectedSongs] = useState<Song[]>([]);

   return (
      <>
         <SongListProvider
            isChecked={isChecked}
            setIsChecked={setIsChecked}
            selectedSongs={selectedSongs}
            setSelectedSongs={setSelectedSongs}
         >
            {children}
         </SongListProvider>
      </>
   );
}
