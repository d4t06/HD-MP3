import { ModalRef } from "@/components";
import { RefObject, useEffect, useState } from "react";

type Props = {
  setImageFileFromParent?: (file: File) => void;
  modalRef?: RefObject<ModalRef>;
};

export default function useReadCopiedImage(props?: Props) {
  const [imageFile, setImageFile] = useState<File>();

  const _setImageFile = props?.setImageFileFromParent || setImageFile;

  const handleReadImage = async (e: ClipboardEvent) => {
    try {
      const fileLists = e.clipboardData?.files;

      if (!fileLists?.length) return;

      _setImageFile(fileLists[0]);

      props?.modalRef?.current?.close();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    window.addEventListener("paste", handleReadImage);

    return () => {
      window.removeEventListener("paste", handleReadImage);
    };
  }, []);

  return { imageFile, setImageFile };
}
