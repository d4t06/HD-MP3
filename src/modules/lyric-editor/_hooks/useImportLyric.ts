import { useToastContext } from "@/stores";
import { ChangeEventHandler } from "react";
import { useEditLyricContext } from "../_components/EditLyricContext";
import { converSrt } from "./converSrt";

export default function useImportLyric() {
  const { setErrorToast } = useToastContext();
  const { setLyrics, setIsChanged, setIsPreview } = useEditLyricContext();

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (!e.target.files) return;

    const file = e.target.files[0];

    const acceptFileExtension = ["json", "srt"];

    const fileExtension = file.name.split(".")[1];
    const reader = new FileReader();

    reader.onload = (_e) => {
      try {
        if (!_e.target?.result || typeof _e.target.result !== "string") return;

        // json format
        if (fileExtension === "json") {
          const lyrics = JSON.parse(
            (_e.target?.result as string | undefined) || "[]",
          );

          setLyrics(lyrics);

          // srt format
        } else {
          const result = converSrt(_e.target.result);
          setLyrics(result);
        }

        setIsChanged(true);
        setIsPreview(true);
      } catch (error: any) {
        console.log(error);
        setErrorToast(error.message || "");
      } finally {
        e.target.value = "";
      }
    };

    if (acceptFileExtension.includes(fileExtension)) {
      reader.readAsText(file);
    } else {
      setErrorToast("File not supported");
      e.target.value = "";
    }
  };

  return { handleInputChange };
}
