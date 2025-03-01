import { FormEvent, useEffect, useState, useRef, ReactNode } from "react";
import { Button } from "..";
import { useThemeContext } from "@/stores";

type Props = {
  submit: (value: string) => void;
  title?: string;
  initValue?: string;
  children?: ReactNode;
  loading?: boolean;
  variant?: "input" | "text-area";
};

export default function InputModal({
  submit,
  title,
  initValue,
  loading,
  variant = "input",
  children,
}: Props) {
  const { theme } = useThemeContext();
  const [value, setValue] = useState(initValue || "");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    submit(value);
  };

  const classes = {
    input: `bg-${theme.alpha} w-full py-2 text-lg rounded-lg outline-none px-2 mt-3`,
  };

  return (
    <div className="w-[500px] max-w-[85vw]">
      <h1 className="text-xl font-medium ">{title || "Title"}</h1>

      <form action="" onSubmit={handleSubmit}>
        {variant === "input" && (
          <input
            className="w-full"
            ref={inputRef}
            placeholder="name..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        )}

        {variant === "text-area" && (
          <textarea
            //  @ts-ignore
            ref={inputRef}
            className={`${classes.input} min-h-[50vh] no-scrollbar`}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        )}

        {children}

        <div className="flex space-x-2 mt-5">
          <Button className={`${theme.content_bg} rounded-full`} isLoading={loading} type="submit">
            Save
          </Button>
        </div>
      </form>
    </div>
  );
}
