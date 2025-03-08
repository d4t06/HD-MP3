type Props = {
  title: string;
  className?: string;
};

export default function Title({ title, className = "" }: Props) {
  return (
    <div className={`text-xl font-playwriteCU leading-[2.4] ${className}`}>{title}</div>
  );
}
