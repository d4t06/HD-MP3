function timeToSeconds(timeString: string) {
  const [_h, m, sAndMs] = timeString.split(":");
  const [s, ms] = sAndMs.split(",");

  const tenths = Math.round(+ms.slice(0, 3) / 100);

  return +m * 60 + +s + +("0." + tenths);
}

export function converSrt(content: string) {
  const lines = content.split("\n");
  const result = [];
  let bucket: Lyric = {
    start: 0,
    end: 0,
    text: "",
    cut: [],
    tune: {
      start: 0,
      end: 0,
      grow: [],
    },
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // gap line
    if (!line) {
      if (!bucket.text) continue;

      const text = bucket.text.trim();
      const words = text.split(" ");
      const cut = words.map(() => []);
      const grow = words.map(() => 0);

      const data: Partial<Lyric> = {
        text,
        tune: { start: bucket.start, end: bucket.end, grow },
        cut,
      };

      Object.assign(bucket, data);

      result.push({ ...bucket });
      bucket.text = "";
    }

    //   index line
    if (!isNaN(+line)) continue;

    // This is the time range line
    if (line.includes("-->")) {
      const [startTimeStr, endTimeStr] = line.split("-->").map((s) => s.trim());
      const start = timeToSeconds(startTimeStr);
      const end = timeToSeconds(endTimeStr);

      if (isNaN(start) || isNaN(end)) throw new Error(`Error at '${i}'`);

      Object.assign(bucket, { start, end });
    } else {
      bucket.text += line.trim() + " ";
    }
  }

  return result;
}
