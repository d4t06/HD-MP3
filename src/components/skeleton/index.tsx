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

export function SongSkeleton(props: {
  variant?: "default" | "queue-song";
  skeNum?: number;
  hasCheckBox?: boolean;
}) {
  const { variant = "default", skeNum = 4, hasCheckBox = true } = props;

  return [...Array(skeNum).keys()].map((index) => (
    <div key={index} className="flex items-center px-3 py-2">
      {hasCheckBox && <Skeleton className="h-[18px] w-[18px]" />}

      <Skeleton
        className={`${variant === "default" ? "h-[54px] w-[54px]" : "h-10 w-10"}  ml-[10px]`}
      />
      <div className="ml-[10px]">
        <Skeleton className="h-[16px] w-[140px] max-w-full" />
        <Skeleton className="h-[14px] w-[80px] mt-[6px] max-w-1/2" />
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
