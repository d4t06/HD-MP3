import { ArrowUpTrayIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import { useAddSongContext } from "@/stores/dashboard/AddSongContext";
import { ChangeEvent, useRef } from "react";
import { Button } from "@/pages/dashboard/_components";

export default function UploadSongBtn({ title }: { title: string }) {
  const { setSongFile } = useAddSongContext();

  const inputRef = useRef<HTMLLabelElement>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) setSongFile(e.target.files[0]);
  };

  return (
    <>
      <label
        ref={inputRef}
        htmlFor="song_upload"
        className={`hidden inline-flex p-1.5 cursor-pointer`}
      >
        <ArrowUpTrayIcon className="w-6" />
      </label>
      <input
        // ref={inputRef}
        onChange={handleInputChange}
        type="file"
        multiple
        accept="audio"
        id="song_upload"
        className="hidden"
      />

      <Button
        onClick={() => inputRef.current?.click()}
        className=""
        size={"clear"}
      >
        <DocumentTextIcon />
        <span>{title}</span>
      </Button>
    </>
  );
}
