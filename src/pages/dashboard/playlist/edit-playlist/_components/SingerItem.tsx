import useDashboardPlaylistActions from "../_hooks/usePlaylistAction";

type Props = {
  singer: Singer;
};
export default function SingerItem({ singer }: Props) {
  const { action } = useDashboardPlaylistActions();

  return (
    <button className="mt-2 mx-1" onClick={() => action({ variant: "remove-singer", singer })}>
      {singer.name}
    </button>
  );
}
