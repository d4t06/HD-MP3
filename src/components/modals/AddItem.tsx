import { FormEvent, useEffect, useState, useRef, ReactNode, useMemo } from "react";
import Button from "../ui/Button";
import { useThemeContext } from "@/stores";
import { ModalHeader } from ".";

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
	const { theme } = useThemeContext();

	const [value, setValue] = useState(initValue || "");
	const inputRef = useRef<HTMLInputElement>(null);

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();

		if (!isAbleToSubmit || loading) return;

		cbWhenSubmit(value);
	};

	const isAbleToSubmit = useMemo(() => value.trim() && value !== initValue, [value]);

	useEffect(() => {
		inputRef.current?.focus();
	}, []);

	const classes = {
		input: "rounded-md px-3 py-2 outline-none w-full bg-white/5 text-white",
	};

	return (
		<div className="w-[400px] max-w-[85vw]">
			<ModalHeader close={closeModal} title={title} />
			<form action="" onSubmit={handleSubmit}>
				{variant === "input" && (
					<input
						className={classes.input}
						ref={inputRef}
						placeholder="name..."
						value={value}
						onChange={(e) => setValue(e.target.value.trim())}
					/>
				)}

				{variant === "text-area" && (
					<textarea
						className={classes.input}
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
						className={`${theme.content_bg} rounded-full self-end mt-[15px] ${
							isAbleToSubmit ? "" : "disable"
						}`}
					>
						Save
					</Button>
				</p>
			</form>
		</div>
	);
}
