import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import { useAddSongContext } from "@/stores/dashboard/AddSongContext";
import { ChangeEvent, useRef } from "react";
import { Button } from "@/pages/dashboard/_components";

export default function UploadSongBtn() {
  const { setSongFile } = useAddSongContext();

  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) setSongFile(e.target.files[0]);
  };

  return (
    <>
      <input
        ref={inputRef}
        onChange={handleInputChange}
        type="file"
        multiple
        accept="audio"
        id="song_upload"
        className="hidden"
      />

      <Button className="" size={"clear"}>
        <label
          htmlFor="song_upload"
          className={`inline-flex p-1 cursor-pointer`}
        >
          <ArrowUpTrayIcon className="w-6" />
        </label>
      </Button>
    </>
  );
}
