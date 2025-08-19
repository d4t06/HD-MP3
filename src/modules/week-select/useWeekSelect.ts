import { ComponentProps, useEffect, useMemo, useState } from "react";
import WeekSelect from ".";

type WeekOption = {
  label: string;
  value: string;
};

function getWeekAndYear(date: Date) {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  );
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const currentWeek = Math.ceil(
    ((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7,
  );
  return { currentWeek, year: d.getUTCFullYear() };
}

export default function useWeekSelect({
  submit,
}: ComponentProps<typeof WeekSelect>) {
  const [weekOptions, setWeekOptions] = useState<WeekOption[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentWeekData = useMemo(
    () => weekOptions[currentIndex],
    [currentIndex],
  );

  useEffect(() => {
    const options: WeekOption[] = [];

    const { currentWeek, year } = getWeekAndYear(new Date());

    for (let w = 1; w <= currentWeek - 1; w++) {
      options.push({
        label: `Week ${w}, ${year}`,
        value: `${year}-W${w}`, // Format: "YYYY-WW"
      });
    }
    setWeekOptions(options);

    setCurrentIndex(options.length - 1);
    submit(options[options.length - 1].value);
  }, []);

  return { weekOptions, currentWeekData, setCurrentIndex, currentIndex };
}
