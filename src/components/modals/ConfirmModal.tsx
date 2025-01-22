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
        loading ? "disable" : ""
      }`}
    >
      <div className="text-xl font-playwriteCU leading-[2.2] mb-3">
        {label || "Wait a minute"}
      </div>
      {desc && <p className="font-semibold text-lg text-red-500">{desc}</p>}

      <div className="flex space-x-3 mt-5">
        <Button
          onClick={close}
          className={`bg-white/10 border border-white/10 rounded-full px-3 py-0.5`}
          variant={"primary"}
          size={'clear'}
        >
          Close
        </Button>
        <Button
          isLoading={loading}
          className={`${theme.content_bg} rounded-full px-3`}
          variant={"primary"}
          size={'clear'}
          onClick={callback}
        >
          {buttonLabel || "Yes, Please"}
        </Button>
      </div>
    </div>
  );
}
