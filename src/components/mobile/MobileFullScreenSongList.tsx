import { useThemeContext } from "@/stores";
import { MobileSongItem } from "..";
import { MouseEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectSongQueue, setCurrentQueueId } from "@/stores/redux/songQueueSlice";
import SongSelectProvider from "@/stores/SongSelectContext";

type Props = {
  currentIndex: number;
};

const findParent = (ele: HTMLDivElement) => {
  let i = 0;
  let parent = ele;
  while (!parent.classList.contains("target-class") && i < 5) {
    parent = parent.parentElement as HTMLDivElement;
    i++;
  }
  return parent;
};

const hideSongItemStyle = {
  opacity: "0",
  transform: "translate(-100%, 0)",
};

const hideSibling = (ele: HTMLDivElement) => {
  let i = 0;
  let node = ele.previousElementSibling as HTMLElement | null;
  while (node && i < 100) {
    Object.assign(node.style, hideSongItemStyle);
    i++;
    node = node.previousElementSibling as HTMLElement;
  }
};

export default function MobileFullScreenSongList({ currentIndex }: Props) {
  const dispatch = useDispatch();
  const { theme } = useThemeContext();
  const { queueSongs } = useSelector(selectSongQueue);

  const activeSong = (e: MouseEvent, queueId: string) => {
    const ele = e.target as HTMLDivElement;

    const parent = findParent(ele);
    hideSibling(parent);
    Object.assign(parent.style, hideSongItemStyle);

    setTimeout(() => {
      dispatch(setCurrentQueueId(queueId));
    }, 500);
  };

  const renderSongItems = () => (
    <>
      {currentIndex === queueSongs.length - 1 || queueSongs.length <= 1 ? (
        <p>...</p>
      ) : (
        queueSongs.map((song, index) => {
          if (index > currentIndex)
            return (
              <MobileSongItem
                variant="playing-next"
                key={index}
                theme={theme}
                song={song}
                onClick={(e) => activeSong(e, song.queue_id)}
              />
            );
        })
      )}
    </>
  );

  return (
    <>
      <SongSelectProvider>{renderSongItems()}</SongSelectProvider>
    </>
  );
}
