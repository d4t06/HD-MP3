import { useMemo } from "react";
import { Frame, Loading } from "../../_components";
import PlaylistSectionProvider, {
  usePlaylistSectionContext,
} from "../PlaylistSectionContext";
import PlaylistItem from "./PlaylistItem";
import PlaylistSectionCta from "./PlaylistSectionCta";
import { useGetPlaylists } from "@/hooks";
import SectionCta from "./SectionCta";
import { useCategoryLobbyContext } from "../CategoryLobbyContext";

type Props = {
  section: LobbySection;
  index: number;
};

export function Content({ section, index }: Props) {
  const { page } = useCategoryLobbyContext();
  const { playlists, setPlaylists } = usePlaylistSectionContext();

  const orderedPlaylists = useMemo(() => {
    const result: Playlist[] = [];

    const order = section.target_ids ? section.target_ids.split("_") : [];

    order.forEach((id) => {
      const founded = playlists.find((c) => c.id === id);
      if (founded) result.push(founded);
    });

    return result;
  }, [page, playlists]);

  const { isFetching } = useGetPlaylists({
    setPlaylists,
    playlistIds: section.target_ids ? section.target_ids.split("_") : [],
  });

  return (
    <>
      <div className="flex items-center">
        <h1>{section.name}</h1>

        <SectionCta
          section={section}
          index={index}
          name={section.name}
          variant="playlist"
        />
      </div>

      <Frame>
        {isFetching && <Loading />}

        {!isFetching && (
          <>
            {!!orderedPlaylists.length && (
              <div className="flex flex-wrap -mt-2 -mx-2">
                {orderedPlaylists.map((c, i) => (
                  <PlaylistItem playlist={c} sectionIndex={index} key={i} />
                ))}
              </div>
            )}

            <PlaylistSectionCta
              sectionIndex={index}
              orderedPlaylists={orderedPlaylists}
            />
          </>
        )}
      </Frame>
    </>
  );
}

export default function PlaylistSection(props: Props) {
  return (
    <PlaylistSectionProvider>
      <Content {...props} />
    </PlaylistSectionProvider>
  );
}
