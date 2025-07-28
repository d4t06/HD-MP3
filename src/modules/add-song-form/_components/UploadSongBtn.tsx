import { ArrowUpTrayIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import { useAddSongContext } from "@/stores/dashboard/AddSongContext";
import { ChangeEvent, useRef } from "react";
import { Button } from "@/pages/dashboard/_components";

export default function UploadSongBtn({ title }: { title: string }) {
  const { setSongFile } = useAddSongContext();

  const labelRef = useRef<HTMLLabelElement>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) setSongFile(e.target.files[0]);
  };

  return (
    <>
      <label ref={labelRef} htmlFor="song_upload" className={`hidden`}>
        <ArrowUpTrayIcon className="w-6" />
      </label>
      <input
        onChange={handleInputChange}
        type="file"
        multiple
        accept="audio"
        id="song_upload"
        className="hidden"
      />

      <Button
        onClick={() => labelRef.current?.click()}
      >
        <DocumentTextIcon />
        <span>{title}</span>
      </Button>
    </>
  );
}
