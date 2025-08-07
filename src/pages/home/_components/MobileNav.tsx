import {
  ArrowRightOnRectangleIcon,
  ArrowTrendingUpIcon,
  ChevronRightIcon,
  ClockIcon,
  HeartIcon,
  MusicalNoteIcon,
  SquaresPlusIcon,
} from "@heroicons/react/24/outline";
import { useAuthContext } from "@/stores";
import useAuthAction from "@/hooks/useAuthActiont";
import { MobileLinkSkeleton } from "@/components/skeleton";
import { Button, LinkItem, Title } from "@/components";

export default function MobileNav() {
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
    linkItem: `py-3 border-b text-lg border-[--a-5-cl] last:border-none`,
  };

  return (
    <div className="block md:hidden">
      <Title title="Library" className="mb-1" />
      {userLoading ? (
        [...Array(3).keys()].map((key) => <MobileLinkSkeleton key={key} />)
      ) : (
        <>
          {user ? (
            <>
              <LinkItem
                to="/trending"
                className={classes.linkItem}
                icon={<ArrowTrendingUpIcon className={classes.icon} />}
                label="Trending"
                arrowIcon={<ChevronRightIcon className="w-6" />}
              />

              <LinkItem
                to="/category"
                className={classes.linkItem}
                icon={<SquaresPlusIcon className={classes.icon} />}
                label="Category"
                arrowIcon={<ChevronRightIcon className="w-6" />}
              />
            </>
          ) : (
            <Button
              color="primary"
              onClick={handleLogIn}
              className={`rounded-md`}
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
