import loadingGif from "@/assets/loading.gif";

type Props = {
  className?: string;
};

export default function Loading({ className = "" }: Props) {
  return <img src={loadingGif} className={`w-[200px] mx-auto ${className}`} />;
}
