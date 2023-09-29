import { useTheme } from "../../store/ThemeContext"

type Props = {
   className: string
}

export default function Skeleton ({className}: Props) {
   const {theme} = useTheme()
   return (
      <div className={`animate-pulse rounded-[4px] bg-${theme.alpha} ${className}`}></div>
   )
}