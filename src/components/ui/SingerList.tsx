import { ReactNode } from "react";
import { NotFound, SingerItem } from "..";

type Props = {
  singers: Singer[];
  whenEmpty?: ReactNode;
  loading?: boolean;
  skeNumber?: number;
  className?: string;
};

export default function SingerList({
  singers,
  whenEmpty,
  loading = false,
  skeNumber = 4,
  className = "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 ",
}: Props) {
  const skeleton = [...Array(skeNumber).keys()].map((i) => (
    <SingerItem key={i} variant="skeleton" />
  ));

  return (
    <div
      className={!loading && !singers.length ? "" : `-mt-3 -mx-3 ${className}`}
    >
      {loading && skeleton}

      {!loading && (
        <>
          {singers.length
            ? singers.map((s, i) => (
                <SingerItem variant="singer-item" singer={s} key={i} />
              ))
            : whenEmpty || <NotFound className="mx-auto" variant="less" />}
        </>
      )}
    </div>
  );
}
