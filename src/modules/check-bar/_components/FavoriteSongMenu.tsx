import { MinusIcon } from "@heroicons/react/24/outline";
import { CheckBarMenuContent } from "./CheckBarMenuBtn";

export default function FavoriteSongMenu() {
  return (
    <>
      <CheckBarMenuContent>
        <button>
          <MinusIcon className="w-5" />
          <span>Remove from favorite</span>
        </button>
      </CheckBarMenuContent>
    </>
  );
}
