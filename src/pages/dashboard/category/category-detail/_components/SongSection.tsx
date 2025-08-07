import { Button, Loading } from "@/pages/dashboard/_components";
import { useGetSongs } from "@/hooks";
import { useCategoryContext } from "../CategoryContext";
import { useMemo, useRef } from "react";
import SongCta from "./SongCta";
import DashboardTable from "@/pages/dashboard/_components/ui/Table";
import { ConfirmModal, Modal, ModalRef, NotFound } from "@/components";
import { Link } from "react-router-dom";
import { TrashIcon } from "@heroicons/react/24/outline";
import useCategoryDetailAction from "../_hooks/useCategoryDetailAction";

export default function SongSection() {
  const { setSongs, category, songs } = useCategoryContext();

  const modalRef = useRef<ModalRef>(null);

  const { action, isFetching: actionFetching } = useCategoryDetailAction();

  const songIds = useMemo(
    () => (category?.song_ids ? category.song_ids.split("_") : []),
    [category],
  );

  const { isFetching } = useGetSongs({ setSongs, songIds });

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-[#333]">Songs</h1>

        <SongCta songs={songs} />
      </div>
      {/* <Frame> */}
      {isFetching && <Loading />}
      {!isFetching && (
        <DashboardTable colList={["Name", "Singers", ""]}>
          {songs.length ? (
            songs.map((s, i) => (
              <tr key={i}>
                <td>
                  <Link
                    to={`/dashboard/song/${s.id}/edit`}
                    className="hover:underline"
                  >
                    {s.name}
                  </Link>
                </td>
                <td>
                  {s.singers.map((s, i) => (
                    <Link
                      className="hover:underline"
                      to={`/dashboard/singer/${s.id}`}
                      key={i}
                    >
                      {!!i && ", "}
                      {s.name}
                    </Link>
                  ))}
                </td>
                <td className="text-right">
                  <Button
                    onClick={() => modalRef.current?.open()}
                    size={"clear"}
                    className="p-1"
                  >
                    <TrashIcon className="w-5" />
                  </Button>

                  <Modal variant="animation" ref={modalRef}>
                    <ConfirmModal
                      callback={() =>
                        action({
                          variant: "remove-song",
                          song: s,
                          index: i,
                        })
                      }
                      closeModal={() => modalRef.current?.close()}
                      loading={actionFetching}
                      label={`Remove song '${s.name}'`}
                    />
                  </Modal>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="text-center">
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
