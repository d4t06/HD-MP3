import {
	forwardRef,
	useImperativeHandle,
	useRef,
	type Ref,
	type RefObject,
} from "react";
import SongControl from "./SongControl";
import PlayerProvider, { usePlayerContext } from "./PlayerContext";
import { Blurhash } from "react-blurhash";
import SongLyric from "./SongLyric";
import useSongItemEffect from "../_hooks/useSongItemEffect";

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

	// const [_hasAudio, setHasAudio] = useState(false);

	const audioRef = useRef<HTMLAudioElement | null>(null);

	useSongItemEffect({ index, songItemRef: songItemRef });

	// useEffect(() => {
	// 	setHasAudio(true);
	// }, []);

	return (
		<>
			<div className="relative flex items-center flex-shrink-0 text-white h-full w-full sm:w-auto sm:aspect-[3/5] rounded-xl overflow-hidden">
				{/*background*/}
				<div className="absolute inset-0 z-[-1] overflow-hidden ">
					{/*	<img
						src={song.image_url}
						className="blur-[100px] z-[-10] w-full h-full object-cover scale-[1.5]"
					/>*/}

					{song.blurhash_encode && (
						<Blurhash
							hash={song.blurhash_encode}
							height={"100%"}
							width={"100%"}
						/>
					)}
				</div>

				<div className="absolute top-0 left-0 w-full p-4 z-[99]">
					{audioRef.current && <SongLyric audioEle={audioRef.current} />}
				</div>

				<div className="w-full aspect-[1/1] overflow-hidden rounded-md relative mask-vertical">
					<img
						onClick={() => controlRef.current?.handlePlayPause()}
						className="w-full"
						src={song.image_url}
					/>
				</div>

				<div className="absolute z-0 bottom-0 left-0 w-full">
					<div className="relative p-4">
						<div className="absolute inset-0 z-[-1] bg-gradient-to-b to-black/60 from-transparent"></div>

						<div className="text-xl font-semibold">{song.name}</div>
						<div className="opacity-[.8]">
							{song.singers.map((s, i) => (
								<span key={i}> {(i ? ", " : "") + s.name}</span>
							))}
						</div>
						<div className="mt-5">
							{audioRef.current && <SongControl audioEle={audioRef.current} />}
						</div>
					</div>
				</div>
			</div>

			<audio className="hidden" ref={audioRef} />
		</>
	);
}

function Wrapper(props: Props, ref: Ref<HTMLDivElement>) {
	const innerRef = useRef<HTMLDivElement | null>(null);

	useImperativeHandle(ref, () => innerRef.current!);

	return (
		<>
			<div
				data-index={props.index}
				className="video-item h-full w-full p-4 snap-center sm:flex justify-center"
				ref={innerRef}
			>
				<PlayerProvider>
					<Content {...props} songItemRef={innerRef} />
				</PlayerProvider>
			</div>
		</>
	);
}

export default forwardRef(Wrapper);
