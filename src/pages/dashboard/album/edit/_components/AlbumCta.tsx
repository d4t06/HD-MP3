import { ButtonCtaFrame } from "@/pages/dashboard/_components";
import EditAlbumBtn from "./EditAlbumBtn";
import DeleteAlbumBtn from "./DeleteAlbumBtn";

export default function AlbumCta() {
  return (
    <ButtonCtaFrame>
      <EditAlbumBtn />

      <DeleteAlbumBtn />
    </ButtonCtaFrame>
  );
}
