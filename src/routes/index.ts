import NoPlayer from "../layout/NoPlayer";
import DashBoardLayout from "../layout/DashBoardLayout";

import { Home, Edit, Dashboard, PlaylistDetail, MySongs } from "../pages";

// mobile

const routes = {
   Home: "/React-Zingmp3",
   Dashboard: "/React-Zingmp3/dashboard",

   MySongs: "/React-Zingmp3/mysongs",
   MobileMySongs: "/React-Zingmp3/mobile-mysongs",
   Playlist: "/React-Zingmp3/mysongs/playlist",
   Edit: "/React-Zingmp3/edit/:id",
};

export type PlaylistParamsType = {
   id: string;
};

const publicRoutes = [
   { path: routes.Home, component: Home, layout: "" },

   { path: routes.Dashboard, component: Dashboard, layout: DashBoardLayout },

   { path: routes.MySongs, component: MySongs, layout: "" },
   { path: `${routes.Playlist}/:id`, component: PlaylistDetail, layout: "" },

   { path: routes.Edit, component: Edit, layout: NoPlayer },
];

export { publicRoutes, routes };
