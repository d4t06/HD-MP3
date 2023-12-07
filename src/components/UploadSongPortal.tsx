import { createPortal } from "react-dom";
import { useRef } from "react";
import { useUploadSongs } from "../hooks";

function UploadSongPortal({ admin }: { admin?: boolean }) {
   const audioRef = useRef<HTMLAudioElement>(null);
   const inputRef = useRef<HTMLInputElement>(null);
   const testImageRef = useRef<HTMLImageElement>(null);

   const { handleInputChange } = useUploadSongs({
      audioRef,
      testImageRef,
      inputRef,
      admin,
   });

   const classes = {
      container: `upload portal fixed z-[199] bottom-[120px] right-[30px] max-[549px]:bottom-[unset] max-[540px]:top-[10px] max-[540px]:right-[10px]`,
   };

   return (
      <>
         {createPortal(
            <div className={classes.container}>
               <audio className="hidden" ref={audioRef} />
               <input
                  ref={inputRef}
                  onChange={handleInputChange}
                  type="file"
                  multiple
                  accept="audio"
                  id="song_upload"
                  className="hidden"
               />
               <img className="hidden" ref={testImageRef} />
            </div>,
            document.getElementById("portals")!
         )}
      </>
   );
}

export default UploadSongPortal;
