import { Image, Title } from "@/components";
import { Button, ModalWrapper } from "@/pages/dashboard/_components";
import { ArrowLeftIcon, PlusIcon } from "@heroicons/react/24/outline";

type Props = {
  handleCloseModal: () => void;
  variant: "add" | "edit";
};

export default function FinishedModal({ handleCloseModal, variant }: Props) {
  return (
    <ModalWrapper>
      <Title title="Finished" />
      <Image
        width="w-[120px]"
        className="mx-auto w-[120px]"
        src="https://zalo-api.zadn.vn/api/emoticon/sticker/webpc?eid=46985&size=130"
      />

      <div className="flex justify-center mt-5 space-x-2">
        <Button href="/dashboard/song">
          <ArrowLeftIcon className="w-6" />
          <span>Songs</span>
        </Button>

        <Button onClick={handleCloseModal}>
          <PlusIcon className="w-6" />
          <span>{variant === "add" ? "Add more" : "Ok"}</span>
        </Button>
      </div>
    </ModalWrapper>
  );
}
