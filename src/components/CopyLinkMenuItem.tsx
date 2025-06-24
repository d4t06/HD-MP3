import { useToastContext } from "@/stores";
import { LinkIcon } from "@heroicons/react/24/outline";

export default function CopyLinkMenuItem() {
  const { setSuccessToast } = useToastContext();

  const handleCopyLink = () => {
    navigator.clipboard.writeText(location.href);
    setSuccessToast("Link copied");
  };

  return (
    <button onClick={handleCopyLink}>
      <LinkIcon />
      <span>Copy link</span>
    </button>
  );
}
