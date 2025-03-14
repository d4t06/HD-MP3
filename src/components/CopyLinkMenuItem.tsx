import { useToastContext } from "@/stores";
import { LinkIcon } from "@heroicons/react/24/outline";
import { usePopoverContext } from "./MyPopup";

export default function CopyLinkMenuItem() {
  const { setSuccessToast } = useToastContext();
  const { close } = usePopoverContext();

  const handleCopyLink = () => {
    navigator.clipboard.writeText(location.href);
    setSuccessToast("Link copied");

    close();
  };

  return (
    <button onClick={handleCopyLink}>
      <LinkIcon className="w-5" />
      <span>Copy link</span>
    </button>
  );
}
