import DashBoardLayout from "../layout/DashBoardLayout";
import NoPlayer from "../layout/NoPlayer";

import { Home, Edit, Dashboard, PlaylistDetail, MySongs, DashboardEdit } from "../pages";

const routes = {
   Home: "/React-Zingmp3",
   Dashboard: "/React-Zingmp3/dashboard",
   DashboardEdit: "/React-Zingmp3/dashboard/edit/:id",

   MySongs: "/React-Zingmp3/mysongs",
   MobileMySongs: "/React-Zingmp3/mobile-mysongs",
   Playlist: "/React-Zingmp3/mysongs/playlist",
   Edit: "/React-Zingmp3/mysongs/edit/:id",
};

export type PlaylistParamsType = {
   id: string;
};

const publicRoutes = [
   { path: routes.Home, component: Home, layout: "" },

   { path: routes.Dashboard, component: Dashboard, layout: DashBoardLayout },

   { path: routes.MySongs, component: MySongs, layout: "" },
   { path: `${routes.Playlist}/:id`, component: PlaylistDetail, layout: "" },

   { path: routes.Edit, component: Edit, layout: "" },

   { path: routes.DashboardEdit, component: DashboardEdit, layout: DashBoardLayout },
];

export { publicRoutes, routes };
