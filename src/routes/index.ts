import AddSongPage from "@/pages/dashboard/song/AddSong";
import DashBoardLayout from "../layout/DashBoardLayout";

import {
  Home,
  Dashboard,
  PlaylistDetail,
  MySongs,
  DashboardSongLyric,
  DashboardPlaylistDetail,
  DashboardPlaylist,
  DashboardSong,
  Login,
  Unauthorized,
} from "../pages";
import SearchResultPage from "@/pages/SearchResult";
import PrimaryLayout from "@/layout/PrimaryLayout";

const pubicRouteMap = {
  home: "/",
  search: "/search",
  playlist: "/playlist/:id",
  login: "/login",
  unauthorized: "/unauthorized",
};

const protectedRouteMap = {
  mySongs: "/mysongs",
  favorite: "/favorite",
};

const privateRouteMap = {
  dashboard: "/dashboard",
  playlist: "/dashboard/playlists",
  song: "/dashboard/songs",
  addSong: "/dashboard/addSong",
  singer: "/dashboard/singers",
  genre: "/dashboard/genres",
  playlistDetail: "/dashboard/playlists/:id",
  songLyric: "/dashboard/lyric/:id",
};

export type PlaylistParamsType = {
  id: string;
};
const publicRoutes = [
  { path: pubicRouteMap.home, component: Home, layout: PrimaryLayout },
  { path: pubicRouteMap.search, component: SearchResultPage, layout: PrimaryLayout },
  { path: pubicRouteMap.login, component: Login, layout: "" },
  { path: pubicRouteMap.unauthorized, component: Unauthorized, layout: "" },
];

const protectedRoutes = [
  { path: protectedRouteMap.mySongs, component: MySongs, layout: PrimaryLayout },
];

const privateRoutes = [
  {
    path: privateRouteMap.dashboard,
    component: Dashboard,
    layout: DashBoardLayout,
  },
  {
    path: privateRouteMap.playlist,
    component: DashboardPlaylist,
    layout: DashBoardLayout,
  },
  {
    path: privateRouteMap.playlistDetail,
    component: DashboardPlaylistDetail,
    layout: DashBoardLayout,
  },
  {
    path: privateRouteMap.song,
    component: DashboardSong,
    layout: DashBoardLayout,
  },

  {
    path: privateRouteMap.addSong,
    component: AddSongPage,
    layout: DashBoardLayout,
  },
  {
    path: privateRouteMap.songLyric,
    component: DashboardSongLyric,
    layout: DashBoardLayout,
  },
];

export { publicRoutes, privateRoutes, protectedRoutes };
