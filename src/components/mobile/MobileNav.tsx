import {
  ArrowRightOnRectangleIcon,
  ChevronRightIcon,
  ClockIcon,
  HeartIcon,
  MusicalNoteIcon,
} from "@heroicons/react/24/outline";
import { Button, LinkItem } from "..";
import { useAuthStore, useTheme } from "@/store";
import { MobileLinkSkeleton } from "../skeleton";
import { routes } from "@/routes";
import { useAuthActions } from "@/store/AuthContext";

export default function MobileNav() {
  const { theme } = useTheme();

  const { loading: userLoading, user } = useAuthStore();

  const { logIn } = useAuthActions();

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
    <div className="pb-[30px]">
      <div className="text-xl font-playwriteCU leading-[2.2] mb-3">Library</div>
      <div className="flex flex-col space-y-3 items-start ">
        {userLoading ? (
          [...Array(3).keys()].map(() => MobileLinkSkeleton)
        ) : (
          <>
            {user ? (
              <>
                <LinkItem
                  className={classes.linkItem}
                  to={routes.MySongs}
                  icon={<MusicalNoteIcon className={classes.icon + theme.content_text} />}
                  label="All songs"
                  arrowIcon={<ChevronRightIcon className="w-6" />}
                />

                <LinkItem
                  className={classes.linkItem}
                  to={routes.MySongs}
                  icon={<HeartIcon className={classes.icon + theme.content_text} />}
                  label="Favorite"
                  arrowIcon={<ChevronRightIcon className="w-6" />}
                />

                <LinkItem
                  className={classes.linkItem}
                  to={routes.MySongs}
                  icon={<ClockIcon className={classes.icon + theme.content_text} />}
                  label="Recent"
                  arrowIcon={<ChevronRightIcon className="w-6" />}
                />
              </>
            ) : (
              <Button
                onClick={handleLogIn}
                className={`${theme.content_bg} rounded-md space-x-1 py-1`}
              >
                <ArrowRightOnRectangleIcon className="w-7" />
                <span className="font-playwriteCU leading-[2.2]">Login</span>
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
