import useKaraoke from "@/hooks/useKaraoke";
import { ElementRef, useRef } from "react";

type Props = {
  audioEle: HTMLAudioElement;
};

export default function Karaoke({ audioEle }: Props) {
  const lyricElementsRef = useRef<ElementRef<"p">[]>([]);

  const { loading, evenOverlay, oddOverlay, textData } = useKaraoke({
    lyricElementsRef,
    audioEle,
  });

  const classes = {
    lyric: "relative text-[36px] pointer-none",
  };

  if (loading) return "loading";

  return (
    <>
      <div className={classes.lyric}>
        {textData.even || "..."}
        <p ref={evenOverlay} className="absolute left-0 top-0 h-full">
          {textData.even || "..."}
        </p>
      </div>

      <div className={classes.lyric}>
        {textData.odd || "..."}
        <p ref={oddOverlay} className="absolute left-0 top-0 h-full">
          {textData.odd || "..."}
        </p>
      </div>
    </>
  );
}
