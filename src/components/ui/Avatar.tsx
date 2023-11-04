import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../config/firebase";
import { Image } from "..";

export default function Avatar({className}: {className?: string}) {
   const [loggedInUser] = useAuthState(auth);

   const classes = {
      imageFrame: `${className || 'w-[35px] h-[35px]'} flex-shrink-0 rounded-full overflow-hidden ${
         !loggedInUser?.photoURL ? "flex items-center justify-center bg-[#ccc]" : ""
      }`,
   };

   return (
      <div className={classes.imageFrame}>
         {loggedInUser?.photoURL ? (
            <Image src={loggedInUser?.photoURL!} classNames="w-full" />
         ) : (
            <h1 className="text-[20px]">
               {loggedInUser?.email ? loggedInUser?.displayName?.charAt(1) : "Z"}
            </h1>
         )}
      </div>
   );
}
