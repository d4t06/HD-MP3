import { Image, Title } from "@/components";
import { Button } from "@/components/dashboard";
import ModalWrapper from "@/components/dashboard/ui/ModalWrapper";
import { ArrowLeftIcon, PlusIcon } from "@heroicons/react/24/outline";

type Props = {
  handleCloseModal: () => void;
};

export default function FinishedModal({ handleCloseModal }: Props) {
  return (
    <ModalWrapper>
      <Title title="Finished" />
      <Image
        className="mx-auto w-[120px]"
        src="https://zalo-api.zadn.vn/api/emoticon/sticker/webpc?eid=46985&size=130"
      />

      <div className="flex justify-center mt-5 space-x-2">
        <Button href="/dashboard/song">
          <ArrowLeftIcon className="w-6" />
          <span>Return</span>
        </Button>

        <Button onClick={handleCloseModal}>
          <PlusIcon className="w-6" />
          <span>Add more</span>
        </Button>
      </div>
    </ModalWrapper>
  );
}
