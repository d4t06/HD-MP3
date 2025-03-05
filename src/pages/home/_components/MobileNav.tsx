import {
  ArrowRightOnRectangleIcon,
  ChevronRightIcon,
  ClockIcon,
  HeartIcon,
  MusicalNoteIcon,
} from "@heroicons/react/24/outline";
import { useAuthContext, useThemeContext } from "@/stores";
import useAuthAction from "@/hooks/useAuthActiont";
import { MobileLinkSkeleton } from "@/components/skeleton";
import { Button, LinkItem } from "@/components";

export default function MobileNav() {
  const { theme } = useThemeContext();
  const { loading: userLoading, user } = useAuthContext();
  const { action } = useAuthAction();

  const handleLogIn = async () => {
    try {
      await action("login");
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  // define styles
  const classes = {
    icon: `w-7 mr-2 inline`,
    linkItem: `py-3 border-b text-lg border-${theme.alpha} last:border-none`,
    button: `${theme.content_bg} rounded-full`,
  };

  return (
    <div className="pb-[30px]">
      <div className="text-xl font-playwriteCU leading-[2.2] mb-3">Library</div>
      {userLoading ? (
        [...Array(3).keys()].map((key) => <MobileLinkSkeleton key={key} />)
      ) : (
        <>
          {user ? (
            <>
              <LinkItem
                to="/"
                className={classes.linkItem}
                icon={<MusicalNoteIcon className={classes.icon + theme.content_text} />}
                label="All songs"
                arrowIcon={<ChevronRightIcon className="w-6" />}
              />

              <LinkItem
                to="/"
                className={classes.linkItem}
                icon={<HeartIcon className={classes.icon + theme.content_text} />}
                label="Favorite"
                arrowIcon={<ChevronRightIcon className="w-6" />}
              />

              <LinkItem
                to="/"
                className={classes.linkItem}
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
  );
}
