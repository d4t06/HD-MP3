import { ModalRef } from "@/components";
import { myUpdateDoc } from "@/services/firebaseService";
import { useToastContext } from "@/stores";
import { RefObject, useState } from "react";
import { useCategoryLobbyContext } from "../CategoryLobbyContext";

type Props = {
  modalRef: RefObject<ModalRef>;
};

export default function UsePlaylistSectionAction(mainProps?: Props) {
  const { setErrorToast, setSuccessToast } = useToastContext();
  const { page, setPage } = useCategoryLobbyContext();

  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  const [isFetching, setIsFetching] = useState(false);

  type Edit = {
    type: "add-playlist";
    playlists: Playlist[];
    sectionIndex: number;
  };

  type Remove = {
    type: "remove-playlist";
    id: string;
    sectionIndex: number;
  };

  const updatePageDoc = async (playlists: Playlist[], sectionIndex: number) => {
    if (!page) return;

    const newPage = { ...page };

    const newSectionData: Partial<CategoryLobbySection> = {
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

  const action = async (props: Edit | Remove) => {
    try {
      if (!page) return;
      setIsFetching(true);
      switch (props.type) {
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
