import { Input, Label, ModalContentWrapper, ModalHeader } from "@/components";
import { Button } from "@/pages/dashboard/_components";
import { useAddSongContext } from "@/stores/dashboard/AddSongContext";
import { useEffect, useState } from "react";

type Props = {
  closeModal: () => void;
};

export default function EditSongModal({ closeModal }: Props) {
  const { songData, updateSongData } = useAddSongContext();

  const [localSongData, setLocalSongData] = useState({
    name: "",
    like: "",
  });

  const updateLocalSongData = (data: Partial<typeof localSongData>) => {
    setLocalSongData((prev) => ({ ...prev, ...data }));
  };

  const _updateSongData = () => {
    if (
      !localSongData.name ||
      !localSongData.like ||
      isNaN(+localSongData.like)
    )
      return;

    updateSongData({ name: localSongData.name, like: +localSongData.like });
    closeModal();
  };

  useEffect(() => {
    if (songData) {
      setLocalSongData({ name: songData.name, like: songData.like + "" });
    }
  }, [songData]);

  return (
    <ModalContentWrapper>
      <ModalHeader title="Edit song" closeModal={closeModal} />

      <div className="space-y-3">
        <div className="space-y-1">
          <Label>Name</Label>
          <Input
            value={localSongData?.name}
            onChange={(e) => updateLocalSongData({ name: e.target.value })}
          />
        </div>

        <div className="space-y-1">
          <Label>Like</Label>
          <Input
            type="number"
            value={+localSongData.like ? +localSongData.like : ""}
            onChange={(e) => updateLocalSongData({ like: e.target.value })}
          />
        </div>
      </div>

      <p className="mt-6 text-right">
        <Button onClick={_updateSongData}>Ok</Button>
      </p>
    </ModalContentWrapper>
  );
}
