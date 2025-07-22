import { ComponentProps, useEffect, useMemo, useState } from "react";
import WeekSelect from ".";

type WeekOption = {
  label: string;
  value: string;
};

function getCurrentWeek() {
  const currentDate = new Date(Date.now());

  const currentYear = currentDate.getFullYear();
  const startOfYear = new Date(currentYear, 0, 1);

  startOfYear.setDate(startOfYear.getDate() + (startOfYear.getDay() % 7));
  const currentWeek = Math.round(
    (currentDate.getTime() - startOfYear.getTime()) / (7 * 24 * 3600 * 1000),
  );

  return { currentWeek, currentYear };
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

    const { currentWeek, currentYear } = getCurrentWeek();
    for (let w = 1; w <= currentWeek; w++) {
      options.push({
        label: `Week ${w}, ${currentYear}`,
        value: `${currentYear}-W${w}`, // Format: "YYYY-WW"
      });
    }
    setWeekOptions(options);

    setCurrentIndex(options.length - 1);
    submit(options[options.length - 1].value);
  }, []);

  return { weekOptions, currentWeekData, setCurrentIndex, currentIndex };
}
