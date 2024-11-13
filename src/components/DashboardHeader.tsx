import { useTheme } from "../store";

import { Link } from "react-router-dom";

export default function DashboardHeader() {
  const { theme } = useTheme();

  const classes = {
    header: `${theme.side_bar_bg} fixed top-0 w-full z-[99]`,
  };

  return (
    <>
      <div className={`${classes.header}`}>
        <div className="container h-[60px] flex items-center">
          <Link to={"/dashboard"} className="text-xl font-[600]">
            HD
            <span className={`${theme.content_text} ml-[4px] uppercase`}>Dashboard</span>
          </Link>
        </div>
      </div>
    </>
  );
}
