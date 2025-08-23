import SongItem from "@/modules/song-item";
import { ComponentProps } from "react";

type Props = {
  className: string;
};

export default function Skeleton({ className }: Props) {
  return (
    <div
      className={`animate-pulse rounded-[4px] bg-gray-400 dark:bg-gray-600  ${className}`}
    ></div>
  );
}

export function SongSkeleton({
  variant = "system-song",
  skeNum = 4,
  hasCheckBox = true,
  className,
}: {
  variant?: ComponentProps<typeof SongItem>["variant"];
  skeNum?: number;
  hasCheckBox?: boolean;
  className?: string;
}) {
  return [...Array(skeNum).keys()].map((index) => (
    <div key={index} className={`flex items-center px-3 py-2 ${className}`}>
      {hasCheckBox && <Skeleton className="h-[18px] w-[18px] mr-[10px]" />}

      <div className="flex">
        <Skeleton
          className={`${variant === "queue-song" ? "h-10 w-10" : "h-[54px] w-[54px]"}`}
        />
        <div className="ml-[10px]">
          <Skeleton className="h-[16px] w-[140px] max-w-full" />
          <Skeleton className="h-[14px] w-[80px] mt-[6px] max-w-1/2" />
        </div>
      </div>
    </div>
  ));
}

export const MobileLinkSkeleton = () => {
  return (
    <div className="py-3">
      <Skeleton className="w-full h-[28px]" />
    </div>
  );
};

export const playlistSkeleton = [...Array(2).keys()].map((index) => {
  return (
    <div key={index} className="p-2 w-1/2 md:w-1/4">
      <Skeleton className="pt-[100%] rounded-lg" />
      <Skeleton className="h-[21px] mt-1.5 w-3/4" />
      <Skeleton className="h-[13px] mt-1 w-3/4" />
    </div>
  );
});
