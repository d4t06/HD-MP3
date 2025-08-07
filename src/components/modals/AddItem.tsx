import {
  FormEvent,
  useEffect,
  useState,
  useRef,
  ReactNode,
  useMemo,
} from "react";
import Button from "../ui/Button";
import { ModalContentWrapper, ModalHeader } from ".";
import { inputClasses } from "../ui/Input";

type Props = {
  closeModal: () => void;
  cbWhenSubmit: (value: string) => void;
  title: string;
  initValue?: string;
  children?: ReactNode;
  loading?: boolean;
  variant?: "input" | "text-area";
};

export default function AddItem({
  closeModal,
  cbWhenSubmit,
  title,
  initValue = "",
  loading,
  variant = "input",
  children,
}: Props) {
  const [value, setValue] = useState(initValue || "");
  const inputRef = useRef<HTMLInputElement>(null);

  const submited = useRef(false);

  const isAbleToSubmit = useMemo(
    () => value.trim() && value !== initValue,
    [value],
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!isAbleToSubmit) return;

    if (!submited.current) {
      submited.current = true;

      cbWhenSubmit(value);
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // const classes = {
  //   input: `rounded-md px-3 py-2 outline-none w-full ${location.hash.includes("/dashboard") ? "bg-black/5" : "bg-white/5 text-white"}`,
  // };

  return (
    <ModalContentWrapper>
      <ModalHeader closeModal={closeModal} title={title} />
      <form action="" onSubmit={handleSubmit}>
        {variant === "input" && (
          <input
            className={inputClasses}
            ref={inputRef}
            placeholder="name..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        )}

        {variant === "text-area" && (
          <textarea
            className={inputClasses}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        )}

        {children}

        <p className="text-right mt-3">
          <Button
            type="submit"
            variant={"primary"}
            isLoading={loading}
            color="primary"
            className={`rounded-full self-end mt-[15px] ${
              isAbleToSubmit ? "" : "disable"
            }`}
          >
            Save
          </Button>
        </p>
      </form>
    </ModalContentWrapper>
  );
}
