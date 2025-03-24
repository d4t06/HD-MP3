import { TrashIcon } from "@heroicons/react/24/outline";
import useDashboardPlaylistActions from "../_hooks/usePlaylistAction";
import { Link } from "react-router-dom";

type Props = {
  singer: Singer;
};
export default function SingerItem({ singer }: Props) {
  const { action } = useDashboardPlaylistActions();

  return (
    <>
      <Link className="hover:underline" to={`/dashboard/singer/${singer.id}`}>
        {singer.name}
      </Link>

      <div>
        <button onClick={() => action({ variant: "remove-singer", singer })}>
          <TrashIcon className="w-5" />
        </button>
      </div>
    </>
  );
}
