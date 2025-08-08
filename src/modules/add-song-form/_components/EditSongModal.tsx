import { Input, Label, ModalContentWrapper, ModalHeader } from "@/components";
import { Button } from "@/pages/dashboard/_components";
import { useAddSongContext } from "@/stores/dashboard/AddSongContext";
import { useEffect, useState } from "react";

type Props = {
  closeModal: () => void;
};

export default function EditSongModal({ closeModal }: Props) {
  const { songData, updateSongData } = useAddSongContext();

  const [localSongData, setLocalSongData] = useState<Partial<Song>>({
    name: "",
    release_year: 0,
  });

  const updateLocalSongData = (data: Partial<typeof localSongData>) => {
    setLocalSongData((prev) => ({ ...prev, ...data }));
  };

  const _updateSongData = () => {
    if (!localSongData.name || !localSongData.release_year) return;

    updateSongData({
      name: localSongData.name,
      release_year: localSongData.release_year,
    });
    closeModal();
  };

  useEffect(() => {
    if (songData) {
      setLocalSongData({
        name: songData.name,
        release_year: songData.release_year,
      });
    }
  }, [songData]);

  console.log(localSongData);

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
          <Label>Release year</Label>
          <Input
            type="number"
            value={localSongData.release_year + "" || "0"}
            onChange={(e) =>
              updateLocalSongData({
                release_year: +e.target.value || 0,
              })
            }
          />
        </div>
      </div>

      <p className="mt-6 text-right">
        <Button onClick={_updateSongData}>Ok</Button>
      </p>
    </ModalContentWrapper>
  );
}
