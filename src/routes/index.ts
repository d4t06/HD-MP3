import { DashboardPlaylistDetail, DashboardPlaylist } from "@/pages";
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
  DashboardPlaylists: "/dashboard/playlists",
  DashboardSongs: "/dashboard/songs",
  DashboardSingers: "/dashboard/singers",
  DashboardGenres: "/dashboard/genres",
  DashboardPlaylistDetail: "/dashboard/playlist/:id",
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
  {
    path: routes.Dashboard,
    component: Dashboard,
    layout: DashBoardLayout,
    title: "Dashboard",
  },
  {
    path: routes.DashboardPlaylists,
    component: DashboardPlaylist,
    layout: DashBoardLayout,
    title: "Playlist",
  },
  {
    path: routes.DashboardPlaylistDetail,
    component: DashboardPlaylistDetail,
    layout: DashBoardLayout,
    title: "Playlist Detail",
  },
  { path: routes.DashboardEdit, component: DashboardSongLyric, layout: DashBoardLayout },
];

export { publicRoutes, privateRoutes, routes };
