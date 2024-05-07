import { ChevronRightIcon, ClockIcon, HeartIcon, MusicalNoteIcon } from "@heroicons/react/24/outline";
import { Button, LinkItem } from "."
import { useAuthStore, useTheme } from "../store"
import { MobileLinkSkeleton } from "./skeleton"
import { routes } from "../routes";
import { useAuthActions } from "../store/AuthContext";

export default function MobileNav () {

    const {theme} = useTheme()

    const {loading: userLoading, user} = useAuthStore()

    const {logIn} = useAuthActions()


    const handleLogIn = async () => {
        try {
           await logIn();
        } catch (error) {
           console.log(error);
        } finally {
        //    setIsOpenModal(false);
        }
     };



       // define styles
   const classes = {
    icon: `w-6 h-6 mr-2 inline`,
    linkItem: `py-[10px] border-b border-${theme.alpha} last:border-none`,
    button: `${theme.content_bg} rounded-full`,
 };
    


    return (
        <div className="pb-[20px]">
        <div className="flex flex-col gap-3 items-start ">
           <h1 className="text-[24px] font-bold">Library</h1>
           {userLoading ? (
              [...Array(3).keys()].map(() => MobileLinkSkeleton)
           ) : (
              <>
                 {user ? (
                    <>
                       <LinkItem
                          className={classes.linkItem}
                          to={routes.MySongs}
                          icon={
                             <MusicalNoteIcon
                                className={classes.icon + theme.content_text}
                             />
                          }
                          label="All songs"
                          arrowIcon={
                             <ChevronRightIcon className="w-5 h-5 text-gray-500" />
                          }
                       />

                       <LinkItem
                          className={classes.linkItem}
                          to={routes.MySongs}
                          icon={
                             <HeartIcon
                                className={classes.icon + theme.content_text}
                             />
                          }
                          label="Favorite"
                          arrowIcon={
                             <ChevronRightIcon className="w-5 h-5 text-gray-500" />
                          }
                       />

                       <LinkItem
                          className={classes.linkItem}
                          to={routes.MySongs}
                          icon={
                             <ClockIcon
                                className={classes.icon + theme.content_text}
                             />
                          }
                          label="Recent"
                          arrowIcon={
                             <ChevronRightIcon className="w-5 h-5 text-gray-500" />
                          }
                       />
                    </>
                 ) : (
                    <Button
                       onClick={handleLogIn}
                       className={`${theme.content_bg} rounded-[4px] px-[40px]`}
                       variant={"primary"}
                    >
                       Login
                    </Button>
                 )}
              </>
           )}
        </div>
     </div>
    )
}