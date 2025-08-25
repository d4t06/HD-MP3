import {
  forwardRef,
  useImperativeHandle,
  useRef,
  type Ref,
  type RefObject,
} from "react";
import SongControl from "./_components/SongControl";
import PlayerProvider, { usePlayerContext } from "./_components/PlayerContext";
import { Blurhash } from "react-blurhash";
import SongLyric from "./_components/SongLyric";
import useSongCardEffect from "./_hooks/useSongCardEffect";
import { useCommentContext } from "../comment/components/CommentContext";

type Props = {
  song: Song;
  index: number;
};

function Content({
  song,
  index,
  songItemRef,
}: Props & { songItemRef: RefObject<HTMLDivElement | null> }) {
  const { controlRef } = usePlayerContext();

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useSongCardEffect({ index, songItemRef: songItemRef });

  return (
    <>
      <div className="relative z-0 flex items-center flex-shrink-0 text-white h-full w-full sm:w-auto sm:aspect-[3/5] rounded-xl overflow-hidden">
        <div className="absolute inset-0 z-[-1] overflow-hidden ">
          {song.blurhash_encode && (
            <Blurhash
              hash={song.blurhash_encode}
              height={"100%"}
              width={"100%"}
            />
          )}
        </div>

        <div className="absolute top-0 left-0 w-full z-[99]">
          <div className="relative p-4">
            {audioRef.current && <SongLyric audioEle={audioRef.current} />}
            <div className="absolute inset-0 z-[-1] bg-gradient-to-b from-black/20 to-transparent"></div>
          </div>
        </div>

        <div className="w-full aspect [1/1] overflow relative mask-image">
          <img
            onClick={() => controlRef.current?.handlePlayPause()}
            className="w-full object-cover"
            src={song.image_url}
          />
        </div>

        <div className="absolute z-0 bottom-0 left-0 w-full">
          <div className="relative p-4">
            <div className="absolute inset-0 z-[-1] bg-gradient-to-b to-black/60 from-transparent"></div>

            <div className="font-bold">{song.name}</div>
            <div className="opacity-[.8] text-sm">
              {song.singers.map((s, i) => (
                <span key={i}> {(i ? ", " : "") + s.name}</span>
              ))}
            </div>
            <div className="mt-2">
              {audioRef.current && (
                <SongControl song={song} audioEle={audioRef.current} />
              )}
            </div>
          </div>
        </div>
      </div>

      <audio className="hidden" ref={audioRef} />
    </>
  );
}

function SongCard(props: Props, ref: Ref<HTMLDivElement>) {
  const { isOpenComment } = useCommentContext();

  const innerRef = useRef<HTMLDivElement | null>(null);

  useImperativeHandle(ref, () => innerRef.current!);

  return (
    <>
      <div className="h-full flex-shrink-0 p-4 min-h-[360px] snap-center">
        <div
          data-index={props.index}
          className={`relative h-full w-full transition-[right] duration-[.3s]  ${isOpenComment ? "semi-lg:right-[calc(400px*0.5)] " : "right-0"}`}
          ref={innerRef}
        >
          <PlayerProvider>
            <Content {...props} songItemRef={innerRef} />
          </PlayerProvider>
        </div>
      </div>
    </>
  );
}

export default forwardRef(SongCard);
