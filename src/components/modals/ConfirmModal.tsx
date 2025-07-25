import { useThemeContext } from "@/stores";
import { Button, ModalContentWrapper, ModalHeader } from "..";
import { ReactNode } from "react";
type Props = {
  callback: () => void;
  label?: string;
  desc?: string;
  loading: boolean;
  className?: string;
  closeModal: () => void;
  children?: ReactNode;
};

export default function ConfirmModal({
  loading,
  callback,
  label,
  children,
  closeModal,
  desc = "This action cannot be undone",
}: Props) {
  const { theme } = useThemeContext();

  return (
    <ModalContentWrapper disable={loading} className={`w-[450px]`}>
      <ModalHeader closeModal={closeModal} title={label || "Wait a minute"} />

      {desc && <p className="font-semibold text-lg text-red-400">{desc}</p>}

      <div className="flex space-x-3 mt-5">
        {children || (
          <>
            <Button
              onClick={close}
              className={`bg-white/10 border border-white/10 rounded-full px-3 py-0.5`}
              variant={"primary"}
              size={"clear"}
            >
              Close
            </Button>
            <Button
              isLoading={loading}
              className={`${theme.content_bg} rounded-full px-3`}
              variant={"primary"}
              size={"clear"}
              onClick={callback}
            >
              Yes, Please
            </Button>
          </>
        )}
      </div>
    </ModalContentWrapper>
  );
}
