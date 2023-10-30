import DashBoardLayout from "../layout/DashBoardLayout";

import { Home, Edit, Dashboard, PlaylistDetail, MySongs, DashboardEdit } from "../pages";

const routes = {
   Home: "/",
   Dashboard: "/dashboard",
   DashboardEdit: "/dashboard/edit/:id",

   MySongs: "/mysongs",
   MobileMySongs: "/mobile-mysongs",
   Playlist: "/mysongs/playlist",
   Edit: "/mysongs/edit/:id",
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
