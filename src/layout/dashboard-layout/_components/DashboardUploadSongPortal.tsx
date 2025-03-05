import { createPortal } from "react-dom";
import useUploadSongDashboard from "@/hooks/dashboard/useUploadSongDashboard";
import ToastItem from "@/modules/toast-portal/_components/ToastItem";

export default function DashboardUploadSongPortal() {
  const { handleInputChange, inputRef, isFetching } = useUploadSongDashboard();

  return (
    <>
      {createPortal(
        <div className="">
          <input
            ref={inputRef}
            onChange={!isFetching ? handleInputChange : undefined}
            type="file"
            multiple
            accept="audio"
            id="song-upload"
            className="hidden"
          />

          {isFetching && (
            <ToastItem
              className="fixed bottom-4 right-1/2 translate-x-1/2"
              variant="message"
              message="...Uploading"
            />
          )}
        </div>,
        document.getElementById("portals")!
      )}
    </>
  );
}
