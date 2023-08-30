import { ClassValue } from "class-variance-authority/types";
import { FC } from "react";

interface Props {
   className?: ClassValue[] | ClassValue
}


const Divider:FC<Props> = ({className}) => {
   return <div className={`${className}`}></div>
}

export default Divider