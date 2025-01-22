import { createPortal } from "react-dom";
import useUploadSongDashboard from "@/hooks/dashboard/useUploadSongDashboard";
import ToastItem from "./_components/ToastItem";
import { useTheme } from "@/store";

export default function DashboardUploadSongPortal() {
  const { theme } = useTheme();
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
              theme={theme}
              message="...Uploading"
            />
          )}
        </div>,
        document.getElementById("portals")!,
      )}
    </>
  );
}
