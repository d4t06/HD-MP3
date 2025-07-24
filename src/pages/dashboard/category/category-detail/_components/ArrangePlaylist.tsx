import { ModalContentWrapper, ModalHeader } from "@/components";
import { useEffect, useMemo, useState } from "react";

type Props = {
  closeModal: () => void;
  playlists: Playlist[];
  isLoading: boolean;
  submit: (order: string[]) => void;
};

export default function ArrangePlaylistModal({ closeModal, playlists }: Props) {
  const [localOrder, setLocalOrder] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>();

  const orderedPlaylists = useMemo(() => {
    const bucket: Playlist[] = [];

    localOrder.forEach((id) => {
      const founded = playlists.find((p) => p.id === id);

      if (founded) bucket.push(founded);
    });

    return bucket;
  }, [localOrder]);

  const handleChangeOrder = (index: number) => {
    if (currentIndex === undefined) setCurrentIndex(index);
    else if (index === currentIndex) setCurrentIndex(undefined);
    else {
      const newLocal = [...localOrder];

      const temp = newLocal[currentIndex];
      newLocal[currentIndex] = newLocal[index];
      newLocal[index] = temp;

      setLocalOrder(newLocal);

      setCurrentIndex(undefined);
    }
  };

  useEffect(() => {
    setLocalOrder(playlists.map((p) => p.id));
  }, []);

  return (
    <>
      <ModalContentWrapper>
        <ModalHeader close={closeModal} title="Change order" />

        <div className="flex flex-col flex-grow overflow-auto space-y-2">
          {orderedPlaylists.map((p, index) => (
            <button
              key={index}
              onClick={() => handleChangeOrder(index)}
              data-id={p.id}
              className={`attribute-item p-1.5 ${currentIndex === index ? "bg-red-300" : "hover:bg-red-300 bg-[#f1f1f1]"}  border-[2px] border-[#ccc] rounded-md`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </ModalContentWrapper>
    </>
  );
}
