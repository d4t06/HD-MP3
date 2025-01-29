import DashBoardLayout from "../layout/DashBoardLayout";

import {
  Home,
  Dashboard,
  PlaylistDetail,
  MySongs,
  DashboardSongLyric,
  SongLyric,
  DashboardPlaylistDetail,
  DashboardPlaylist,
  DashboardSong,
} from "../pages";
import SearchResultPage from "@/pages/SearchResult";

const routes = {
  Home: "/",
  Search: "/search",
  Dashboard: "/dashboard",
  DashboardPlaylist: "/dashboard/playlists",
  DashboardSong: "/dashboard/songs",
  DashboardSinger: "/dashboard/singers",
  DashboardGenre: "/dashboard/genres",
  DashboardPlaylistDetail: "/dashboard/playlists/:id",
  DashboardSongLyric: "/dashboard/lyric/:id",

  MySongs: "/mysongs",
  Favorite: "/favorite",
  Playlist: "/playlist/:id",
  Lyric: "/mysongs/lyric/:id",
};

export type PlaylistParamsType = {
  id: string;
};

const publicRoutes = [
  { path: routes.Home, component: Home, layout: "" },
  { path: routes.Search, component: SearchResultPage, layout: "" },

  { path: routes.MySongs, component: MySongs, layout: "" },
  { path: routes.Playlist, component: PlaylistDetail, layout: "" },

  { path: routes.Lyric, component: SongLyric, layout: "" },
];

const privateRoutes = [
  {
    path: routes.Dashboard,
    component: Dashboard,
    layout: DashBoardLayout,
    title: "Dashboard",
  },
  {
    path: routes.DashboardPlaylist,
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
  {
    path: routes.DashboardSong,
    component: DashboardSong,
    layout: DashBoardLayout,
    title: "Song",
  },
  { path: routes.DashboardSongLyric, component: DashboardSongLyric, layout: DashBoardLayout },
];

export { publicRoutes, privateRoutes, routes };
