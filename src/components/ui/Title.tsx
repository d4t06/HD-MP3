import { cva, VariantProps } from "class-variance-authority";

const TitleVariant = cva("", {
  variants: {
    variant: {
      h1: "text-2xl font-bold text-[#1f1f1f]",
      h2: "text-xl font-bold text-[#1f1f1f]",
      h3: "text-lg font-semibold text-[#333]",
    },
  },
  defaultVariants: {
    variant: "h1",
  },
});

type Props = VariantProps<typeof TitleVariant> & {
  title: string;
  className?: string;
};

export default function Title({ title, variant, className = "" }: Props) {
  return (
    <div className={`${TitleVariant({ variant, className })} `}>{title}</div>
  );
}
