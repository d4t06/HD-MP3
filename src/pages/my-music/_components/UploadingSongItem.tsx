import { Image } from "@/components";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

type Props = {
  song: SongSchema;
};

export default function UploadingSongItem({ song }: Props) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex-grow flex">
        <div className={`h-[54px] w-[54px] rounded overflow-hidden`}>
          <Image src={song.image_url} />
        </div>

        <div className={`ml-[10px]`}>
          <h5 className={`line-clamp-1 font-medium overflow-hidden`}>{song.name}</h5>
          <p className={`opacity-[.7] leading-[1.2] line-clamp-1 text-sm`}>
            {song.singer}
          </p>
        </div>
      </div>

      <div className="flex space-x-1">
        <ArrowPathIcon className="animate-spin w-6" />

        <p>Uploading...</p>
      </div>
    </div>
  );
}
