import useKaraoke from "@/hooks/useKaraoke";
import KaraokeItem from "./KaraokeItem";

type Props = {
  audioEle: HTMLAudioElement;
};

export default function Karaoke({ audioEle }: Props) {
  const { loading, evenOverlay, oddOverlay, textData } = useKaraoke({
    audioEle,
  });

  if (loading) return "loading";

  return (
    <>
      <KaraokeItem overlayRef={evenOverlay} text={textData.even} />
      <KaraokeItem overlayRef={oddOverlay} text={textData.odd} />
    </>
  );
}
