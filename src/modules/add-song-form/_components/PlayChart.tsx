import WeekSelect from "@/modules/week-select";
import Chart from "./Chart";
import usePlayChart from "../_hooks/usePlayChart";

export default function PlayChart() {
  const { submit } = usePlayChart();

  return (
    <>
      <Chart
      className="h-[200px] rounded-lg"
        data={[
          { label: "asd", value: 10 },
          { label: "aasd", value: 20 },
          { label: "asdg", value: 30 },
        ]}
      />

      <WeekSelect submit={submit} />
    </>
  );
}
