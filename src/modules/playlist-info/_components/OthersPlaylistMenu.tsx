import { usePopoverContext } from "@/components/MyPopup";
import { useToastContext } from "@/stores";

import { LinkIcon } from "@heroicons/react/24/outline";
import { PlaylistMenuPopupContent } from "./PlaylistMenuBtn";

export default function OtherPlaylistMenuBtn() {
  const { setSuccessToast } = useToastContext();
  const { close } = usePopoverContext();

  const handleCopyLink = () => {
    navigator.clipboard.writeText(location.href);
    setSuccessToast("Link copied");

    close();
  };

  return (
    <>
      <PlaylistMenuPopupContent>
        <button onClick={handleCopyLink}>
          <LinkIcon className="w-5" />
          <span>Copy link</span>
        </button>
      </PlaylistMenuPopupContent>
    </>
  );
}
