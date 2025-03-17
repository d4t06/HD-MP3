import { ComponentProps, ReactNode } from "react";
import { useSongSelectContext } from "@/stores/SongSelectContext";
import { useAuthContext, useThemeContext } from "@/stores";
import { CheckIcon, StopIcon, XMarkIcon } from "@heroicons/react/24/outline";
import AddToQueueCheckBarItem from "./_components/AddToQueueCheckBarItem";
import CheckBarMenuBtn from "./_components/CheckBarMenuBtn";

type Props = {
  children?: ReactNode;
  selectAll?: () => void;
  variant: ComponentProps<typeof CheckBarMenuBtn>["variant"];
};

export default function CheckedBar({ children, variant, selectAll }: Props) {
  const { theme } = useThemeContext();
  const { user } = useAuthContext();
  const { isSelectAll, isChecked, resetSelect, selectedSongs } = useSongSelectContext();

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

      <p className="font-playwriteCU mr-1">{selectedSongs.length}</p>

      <div
        className={`flex space-x-2 items-center ${theme.type === "light" ? "[&>button]:bg-black/5" : "[&>button]:bg-white/5"}  [&>button]:inline-flex [&>button]:space-x-1 [&>button]:py-1 [&>button]:px-2 [&>button]:rounded-full hover:[&>button]:brightness-95`}
      >
        <AddToQueueCheckBarItem />
        {user && <CheckBarMenuBtn variant={variant} />}
      </div>

      <button onClick={resetSelect} className={`p-1 flex-shrink-0`}>
        <XMarkIcon className="w-[20px]" />
      </button>
    </>
  );

  return (
    <div className="flex items-center space-x-2 h-[44px] mb-3">
      {isChecked ? content : children}
    </div>
  );
}
