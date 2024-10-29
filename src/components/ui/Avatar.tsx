import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";
import { Image } from "..";
import userImage from "@/assets/user-default.png";

export default function Avatar({ className }: { className?: string }) {
   const [loggedInUser] = useAuthState(auth);

   const classes = {
      imageFrame: `${className || "w-[35px] h-[35px]"} flex-shrink-0 rounded-full overflow-hidden ${
         !loggedInUser?.photoURL ? "flex items-center justify-center bg-[#ccc]" : ""
      }`,
   };

   return (
      <div className={classes.imageFrame}>
         <Image src={loggedInUser?.photoURL || userImage} className="w-full" />
      </div>
   );
}
