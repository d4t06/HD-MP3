import { ModalRef } from "@/components";
import { myUpdateDoc } from "@/services/firebaseService";
import { useToastContext } from "@/stores";
import { RefObject, useState } from "react";
import { useCategoryLobbyContext } from "../CategoryLobbyContext";
import { usePlaylistSectionContext } from "../PlaylistSectionContext";

type Props = {
  modalRef: RefObject<ModalRef>;
};

export default function UsePlaylistSectionAction(mainProps?: Props) {
  const { page, setPage } = useCategoryLobbyContext();
  const { setErrorToast, setSuccessToast } = useToastContext();
  const { playlists, setPlaylists } = usePlaylistSectionContext();

  const [isFetching, setIsFetching] = useState(false);

  type Edit = {
    variant: "add-playlist";
    playlists: Playlist[];
    sectionIndex: number;
  };

  type Remove = {
    variant: "remove-playlist";
    id: string;
    sectionIndex: number;
  };

  type ArrangePlaylists = {
    variant: "arrange-playlist";
    section: Partial<LobbySection>;
    sectionIndex: number;
  };

  const updatePageDoc = async (playlists: Playlist[], sectionIndex: number) => {
    if (!page) return;

    const newPage = { ...page };

    const newSectionData: Partial<LobbySection> = {
      target_ids: playlists.map((p) => p.id).join("_"),
    };

    Object.assign(newPage.playlist_sections[sectionIndex], newSectionData);

    await myUpdateDoc({
      collectionName: "Category_Lobby",
      data: newPage,
      id: "page",
    });

    setPlaylists(playlists);
    setPage(newPage);
  };

  const action = async (props: Edit | Remove | ArrangePlaylists) => {
    try {
      if (!page) return;
      setIsFetching(true);
      switch (props.variant) {
        case "add-playlist": {
          const newPlaylists = [...playlists, ...props.playlists];

          updatePageDoc(newPlaylists, props.sectionIndex);
          setSuccessToast("Add playlist successful");

          break;
        }

        case "remove-playlist": {
          const newPlaylists = playlists.filter((p) => p.id !== props.id);

          updatePageDoc(newPlaylists, props.sectionIndex);

          setSuccessToast("Remove playlist successful");

          break;
        }

        case "arrange-playlist": {
          const newPage = { ...page };

          Object.assign(
            newPage.playlist_sections[props.sectionIndex],
            props.section,
          );

          await myUpdateDoc({
            collectionName: "Category_Lobby",
            data: newPage,
            id: "page",
          });

          setPage(newPage);

          break;
        }
      }

      mainProps?.modalRef.current?.close();
    } catch (error) {
      console.log(error);
      setErrorToast();
    } finally {
      setIsFetching(false);
    }
  };
  return { isFetching, action };
}
