import { Button } from "..";
type Props = {
  callback: () => void;
  label?: string;
  desc?: string;
  buttonLabel?: string;
  loading: boolean;
  theme: ThemeType & { alpha: string };
  className?: string;
  close: () => void;
};

export default function ConfirmModal({
  loading,
  theme,
  callback,
  label,
  close,
  buttonLabel,
  desc = "This action cannot be undone",
  className,
}: Props) {
  return (
    <div
      className={`${className || "w-[400px] max-w-[calc(90vw-40px)]"} ${
        loading ? "opacity-60 pointer-events-none" : ""
      }`}
    >
      <div className="text-xl font-playwriteCU leading-[2.2]">
        {label || "Wait a minute"}
      </div>
      {desc && <p className="font-semibold text-red-500">{desc}</p>}

      <div className="flex space-x-3 mt-5">
        <Button
          onClick={close}
          className={`${theme.content_bg} rounded-full text-[14px]`}
          variant={"primary"}
        >
          Close
        </Button>
        <Button
          isLoading={loading}
          className={` text-[#fff] bg-red-500 rounded-full text-[14px] font-bold`}
          variant={"primary"}
          onClick={callback}
        >
          {buttonLabel || "Yes please"}
        </Button>
      </div>
    </div>
  );
}
