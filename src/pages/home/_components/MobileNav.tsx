import {
  ArrowTrendingUpIcon,
  ChevronRightIcon,
  MusicalNoteIcon,
  SquaresPlusIcon,
} from "@heroicons/react/24/outline";
import { useAuthContext } from "@/stores";
import { LinkItem, Title } from "@/components";

export default function MobileNav() {
  const { user } = useAuthContext();

  // define styles
  const classes = {
    icon: `w-7 mr-2 inline`,
    linkItem: `py-3 border-b text-lg border-[--a-5-cl] last:border-none`,
  };

  return (
    <div className="block md:hidden">
      <Title title="Library" className="mb-1" />

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

      {user && (
        <>
          <LinkItem
            to="/my-music"
            className={classes.linkItem}
            icon={<MusicalNoteIcon className={classes.icon} />}
            label="My Song"
            arrowIcon={<ChevronRightIcon className="w-6" />}
          />
        </>
      )}
    </div>
  );
}
