import { cva, VariantProps } from "class-variance-authority";

const TitleVariant = cva("font-medium", {
  variants: {
    variant: {
      h1: "text-2xl",
      h2: "text-xl",
      h3: "text-lg",
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
