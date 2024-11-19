import { parseBlob } from "music-metadata";

type ParserSong = {
  name: string;
  singer: string;
  image: ArrayBuffer | null;
  duration: number;
};

export const parserSong = async (songFile: File) => {
  if (!songFile) return;
  const result = await parseBlob(songFile);

  if (!result) return;

  const {
    common: { title, artist },
    format: { duration },
  } = result;

  const data = Object.assign({}, {
    name: title || songFile.name,
    singer: artist || "...",
    duration: duration || 0,
  } as ParserSong);

  return data;
};
