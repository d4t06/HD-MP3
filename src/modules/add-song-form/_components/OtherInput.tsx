import { Input, Title } from "@/components";
import { useAddSongContext } from "@/stores/dashboard/AddSongContext";

export default function OtherInput() {
  const { songData, updateSongData, song } = useAddSongContext();

  return (
    <>
      <div>
        <div>Name</div>

        {song ? (
          <Title variant={"h1"} title={song.name} />
        ) : (
          <Input
            className="mt-2"
            placeholder="..."
            value={songData?.name || ""}
            onChange={(e) => updateSongData({ name: e.target.value })}
          />
        )}
      </div>

      <div>
        <div>Release year</div>

        {song ? (
          <Title variant={"h2"} title={song.release_year + ""} />
        ) : (
          <Input
            className="mt-2 md:w-[50%]"
            placeholder="..."
            type="number"
            step={1}
            value={songData?.release_year + ""}
            onChange={(e) =>
              !isNaN(+e.target.value)
                ? updateSongData({ release_year: +e.target.value })
                : {}
            }
          />
        )}
      </div>
    </>
  );
}
