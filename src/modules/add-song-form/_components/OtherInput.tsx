import { Input, Title } from "@/components";
import { useAddSongContext } from "@/stores/dashboard/AddSongContext";

export default function OtherInput() {
  const { songData, updateSongData, variant } = useAddSongContext();

  return (
    <>
      <div>
        <div>Name</div>

        {variant.current === "edit" ? (
          <Title variant={"h1"} title={songData?.name || ""} />
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

        {variant.current === "edit" ? (
          <Title variant={"h2"} title={songData?.release_year + ""} />
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
