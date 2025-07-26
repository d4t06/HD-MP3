import { Input, ModalContentWrapper, ModalHeader } from "@/components";
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
    like: 0,
  });

  const updateLocalSongData = (data: Partial<Song>) => {
    setLocalSongData((prev) => ({ ...prev, ...data }));
  };

  const _updateSongData = () => {
    updateSongData(localSongData);
    closeModal();
  };

  useEffect(() => {
    if (songData) {
      setLocalSongData({ name: songData.name, like: songData.like });
    }
  }, [songData]);

  const classes = {
    label: "font-semibold text-[#666]",
  };

  return (
    <ModalContentWrapper>
      <ModalHeader title="Edit song" closeModal={closeModal} />

      <div className="space-y-3">
        <div className="space-y-1">
          <label className={classes.label}>Name:</label>
          <Input
            className="bg-black/10"
            value={localSongData?.name}
            onChange={(e) => updateLocalSongData({ name: e.target.value })}
          />
        </div>

        <div className="space-y-1">
          <label className={classes.label}>Like:</label>
          <Input
            className="bg-black/10"
            value={localSongData?.like}
            onChange={(e) =>
              !isNaN(+e.target.value)
                ? updateLocalSongData({ like: +e.target.value })
                : {}
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
