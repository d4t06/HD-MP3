import { useThemeContext } from "@/stores";

type Props = {
  className: string;
};

export default function Skeleton({ className }: Props) {
  const { theme } = useThemeContext();
  return (
    <div className={`animate-pulse rounded-[4px] bg-${theme.alpha} ${className}`}></div>
  );
}

export const SongItemSkeleton = [...Array(4).keys()].map((index) => {
  return (
    <div
      key={index}
      className="flex items-center p-[10px] border-b-[1px] border-transparent"
    >
      <Skeleton className="h-[18px] w-[18px]" />

      <Skeleton className="h-[54px] w-[54px] ml-[10px] rounded-[4px]" />
      <div className="ml-[10px]">
        <Skeleton className="h-[20px] mb-[5px] w-[150px]" />
        <Skeleton className="h-[12px] mt-[5px] w-[100px]" />
      </div>
    </div>
  );
});

export const MobileLinkSkeleton = () => {
  return (
    <div className="py-3">
      <Skeleton className="w-full h-[28px]" />
    </div>
  );
};

export const PlaylistSkeleton = [...Array(2).keys()].map((index) => {
  return (
    <div key={index} className="w-1/4 p-[8px] max-[549px]:w-1/2">
      <Skeleton className="pt-[100%] rounded-lg" />
      <Skeleton className="h-[21px] mt-1.5 w-full" />
      <Skeleton className="h-[13px] mt-1 w-full" />
    </div>
  );
});
