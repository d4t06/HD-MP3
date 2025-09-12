import { Image } from "@/components";
import { usePlayerContext } from "@/stores";

interface Props {
  imageUrl?: string;
  classNames?: string;
}

export default function SongThumbnail({ imageUrl }: Props) {
  const { mobileActiveTab, setMobileActiveTab } = usePlayerContext();

  const isPlayingTab = mobileActiveTab === "Playing";

  return (
    <div
      onClick={() => setMobileActiveTab(isPlayingTab ? "Lyric" : "Playing")}
      className={` transition-all duration-[.2s] flex-shrink-0 ${
        isPlayingTab
          ? "w-full h-auto sm:w-20 sm:h-20 sm:px-0"
          : "w-20 h-20 p-0"
      }`}
    >
      <Image src={imageUrl} className="w-full rounded-md" />
    </div>
  );
}
