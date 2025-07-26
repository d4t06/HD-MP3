import { useMemo } from "react";

type Data = { label: string; value: number }[];

type Props = {
  data: Data;
  className?: string;
  colWidth?: string;
};

export default function Chart({
  data,
  className = "",
  colWidth = "w-[40px]",
}: Props) {
  const largestValue = useMemo(() => {
    if (!data.length) return 0;

    const newData = data.sort((a, b) => b.value - a.value);

    return newData[0].value;
  }, [data]);

  return (
    <div className={`flex justify-center border border-black/10 p-4 gap-2 items-end ${className}`}>
      {data.map((d, i) => (
        <div
          key={i}
          style={{ height: `${Math.ceil((d.value / largestValue) * 100)}%` }}
          className={`${colWidth} bg-black`}
        ></div>
      ))}
    </div>
  );
}
