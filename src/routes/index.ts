import PrimaryLayout from "@/layout/primary-layout";
import {
  Home,
  Dashboard,
  // Playlist,
  Search,
  MyMusic,
  DashboardSongLyric,
  DashboardPlaylistDetail,
  DashboardPlaylist,
  DashboardSong,
  Login,
  Unauthorized,
} from "../pages";
import DashBoardLayout from "@/layout/dashboard-layout";

const pubicRouteMap = {
  home: "/",
  search: "/search",
  playlist: "/playlist/:id",
  login: "/login",
  unauthorized: "/unauthorized",
};

const protectedRouteMap = {
  MyMusic: "/MyMusic",
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
  { path: pubicRouteMap.search, component: Search, layout: PrimaryLayout },
  { path: pubicRouteMap.login, component: Login, layout: "" },
  { path: pubicRouteMap.unauthorized, component: Unauthorized, layout: "" },
];

const protectedRoutes = [
  { path: protectedRouteMap.MyMusic, component: MyMusic, layout: PrimaryLayout },
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

  // {
  //   path: privateRouteMap.addSong,
  //   component: AddSongPage,
  //   layout: DashBoardLayout,
  // },
  {
    path: privateRouteMap.songLyric,
    component: DashboardSongLyric,
    layout: DashBoardLayout,
  },
];

export { publicRoutes, privateRoutes, protectedRoutes };
