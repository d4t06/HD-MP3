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
      className={` ${
        isPlayingTab
          ? "w-full h-auto px-2 sm:w-[60px] sm:h-[60px] sm:px-0"
          : "w-[60px] h-[60px] p-0 flex-shrink-0"
      }`}
    >
      <Image src={imageUrl} className="w-full rounded-md" />
    </div>
  );
}
