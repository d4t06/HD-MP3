import { Button, Loading } from "@/pages/dashboard/_components";
import { useCategoryContext } from "../CategoryContext";
import { useGetPlaylists } from "@/hooks";
import DashboardTable from "@/pages/dashboard/_components/ui/Table";
import { Link } from "react-router-dom";
import { abbreviateNumber } from "@/utils/abbreviateNumber";
import { ConfirmModal, Modal, ModalRef, NotFound } from "@/components";
import PlaylistCta from "./PlaylistCta";
import { TrashIcon } from "@heroicons/react/24/outline";
import useCategoryDetailAction from "../_hooks/useCategoryDetailAction";
import { useRef } from "react";

export default function PlaylistSection() {
  const { setPlaylists, orderedPlaylists, playlistIds } = useCategoryContext();

  const { isFetching } = useGetPlaylists({ setPlaylists, playlistIds });

  const modalRef = useRef<ModalRef>(null);

  const { action, isFetching: actionFetching } = useCategoryDetailAction();

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-[#333]">Playlists</h1>

        <PlaylistCta />
      </div>
      {/* <Frame> */}
      {isFetching && <Loading />}
      {!isFetching && (
        <DashboardTable colList={["Name", "Like", ""]}>
          {orderedPlaylists.length ? (
            orderedPlaylists.map((p, i) => (
              <tr key={i}>
                <td>
                  <Link
                    className="hover:underline"
                    to={`/dashboard/playlist/${p.id}`}
                  >
                    {p.name}
                  </Link>
                </td>
                <td>{abbreviateNumber(p.like)}</td>
                <td className="text-right">
                  <Button onClick={() => modalRef.current?.open()} size={"clear"} className="p-1">
                    <TrashIcon className="w-5" />
                  </Button>

                  <Modal variant="animation" ref={modalRef}>
                    <ConfirmModal
                      callback={() =>
                        action({ variant: "remove-playlist", playlist:p, index: i })
                      }
                      close={() => modalRef.current?.close()}
                      loading={actionFetching}
                      label={`Remove playlist '${p.name}'`}
                    />
                  </Modal>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4}>
                <NotFound />
              </td>
            </tr>
          )}
        </DashboardTable>
      )}
      {/* </Frame> */}
    </>
  );
}
