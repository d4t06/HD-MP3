import { ComponentProps, ReactNode } from "react";
import { useSongSelectContext } from "@/stores/SongSelectContext";
import { useAuthContext } from "@/stores";
import { CheckIcon, StopIcon } from "@heroicons/react/24/outline";
import AddToQueueBtn from "./_components/AddToQueueBtn";
import CheckBarMenuBtn from "./_components/CheckBarMenuBtn";
import { XMarkIcon } from "@heroicons/react/20/solid";
import AddToPlaylistBtn from "./_components/AddToPlaylistBtn";

type Props = {
  children?: ReactNode;
  selectAll?: () => void;
  variant?: ComponentProps<typeof CheckBarMenuBtn>["variant"];
};

export default function CheckedBar({ children, selectAll }: Props) {
  const { user } = useAuthContext();
  const { isSelectAll, isChecked, resetSelect, selectedSongs } =
    useSongSelectContext();

  const content = (
    <>
      {selectAll && (
        <button onClick={selectAll} className="ml-[10px]">
          {isSelectAll ? (
            <CheckIcon className="w-[20px]" />
          ) : (
            <StopIcon className="w-[20px]" />
          )}
        </button>
      )}
      <span className="font-bold text-sm">{selectedSongs.length}</span>
      <div
        className={`flex space-x-2 items-center [&>button]:bg-[--a-5-cl] [&>button]:inline-flex [&>button]:items-center [&>button]:space-x-1.5 [&_span]:text-xs [&_span]:font-bold [&>button]:py-1 [&>button]:px-3 [&>button]:rounded-full`}
      >
        <AddToQueueBtn />

        {user && <AddToPlaylistBtn />}
      </div>

      <button onClick={resetSelect} className={`flex-shrink-0`}>
        <XMarkIcon className="w-5" />
      </button>
    </>
  );

  return (
    <div className="flex items-center space-x-2 h-[44px]">
      {isChecked ? content : children}
    </div>
  );
}
