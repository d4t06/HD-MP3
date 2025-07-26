import { cva, VariantProps } from "class-variance-authority";

const TitleVariant = cva("", {
  variants: {
    variant: {
      h1: "text-2xl font-semibold",
      h2: "text-xl font-semibold",
      h3: "text-lg font-medium",
    }
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
