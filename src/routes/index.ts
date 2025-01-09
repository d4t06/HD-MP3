import DashboardPlaylist from "@/pages/DashboardPlaylist";
import DashBoardLayout from "../layout/DashBoardLayout";

import {
  Home,
  Dashboard,
  PlaylistDetail,
  MySongs,
  DashboardSongLyric,
  SongLyric,
} from "../pages";
import SearchResultPage from "@/pages/SearchResult";

const routes = {
  Home: "/",
  Search: "/search",
  Dashboard: "/dashboard",
  DashboardPlaylist: "/dashboard/playlist/:id",
  DashboardEdit: "/dashboard/edit/:id",

  MySongs: "/mysongs",
  Favorite: "/favorite",
  Playlist: "/playlist/:id",
  Edit: "/mysongs/edit/:id",
};

export type PlaylistParamsType = {
  id: string;
};

const publicRoutes = [
  { path: routes.Home, component: Home, layout: "" },
  { path: routes.Search, component: SearchResultPage, layout: "" },

  { path: routes.MySongs, component: MySongs, layout: "" },
  { path: routes.Playlist, component: PlaylistDetail, layout: "" },

  { path: routes.Edit, component: SongLyric, layout: "" },
];

const privateRoutes = [
  { path: routes.Dashboard, component: Dashboard, layout: DashBoardLayout },
  {
    path: routes.DashboardPlaylist,
    component: DashboardPlaylist,
    layout: DashBoardLayout,
  },
  { path: routes.DashboardEdit, component: DashboardSongLyric, layout: DashBoardLayout },
];

export { publicRoutes, privateRoutes, routes };
