import AddToQueueMenuItem from "./AddToQueueMenuItem";
import { PlaylistMenuPopupContent } from "./PlaylistMenuBtn";
import { CopyLinkMenuItem } from "@/components";

export default function OtherPlaylistMenuBtn() {
  return (
    <>
      <PlaylistMenuPopupContent>
        <CopyLinkMenuItem />

        <AddToQueueMenuItem />
      </PlaylistMenuPopupContent>
    </>
  );
}
