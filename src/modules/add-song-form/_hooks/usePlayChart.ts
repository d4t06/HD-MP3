import { Timestamp } from "firebase/firestore";

function getWeekTimestamps(weekString: string) {
  const parts = weekString.split("-W");
  const year = parseInt(parts[0]);
  const weekNumber = parseInt(parts[1]);

  const jan1 = new Date(year, 0, 1);

  const dayOfWeekJan1 = jan1.getDay();

  // Calculate the number of days to add to get to the first day of the target week.
  // We assume weeks start on Monday. If Jan 1st is a Sunday (0), the first Monday is Jan 2nd.
  // If Jan 1st is a Monday (1), it's Jan 1st.
  // If Jan 1st is a Tuesday (2), the first Monday is Jan 7th (6 days later).
  // The formula (1 - dayOfWeekJan1 + 7) % 7 calculates days to add to get to the first Monday of the year.
  // Then add (weekNumber - 1) * 7 for the target week.
  const daysToAdd = (weekNumber - 1) * 7 + ((1 - dayOfWeekJan1 + 7) % 7);

  const startDate = new Date(jan1.getTime());
  startDate.setDate(jan1.getDate() + daysToAdd);

  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(startDate.getTime());
  endDate.setDate(startDate.getDate() + 6);

  endDate.setHours(23, 59, 59, 999);

  return {
    start: Timestamp.fromDate(startDate),
    end: Timestamp.fromDate(endDate),
  };
}

export default function usePlayChart() {
  const submit = (w: string) => {
    const result = getWeekTimestamps(w);
    console.log(result);
  };

  return { submit };
}
