import PrimaryLayout from "@/layout/primary-layout";
import {
  Home,
  Dashboard,
  // Playlist,
  Search,
  MyMusic,
  DashboardEditSongLyric,
  DashboardPlaylistDetail,
  DashboardPlaylist,
  DashboardSong,
  Login,
  Unauthorized,
} from "../pages";
import DashBoardLayout from "@/layout/dashboard-layout";
import AddSongPage from "@/pages/dashboard/song/add-song";

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
  playlist: "/dashboard/playlist",
  song: "/dashboard/song",
  addSong: "/dashboard/song/add-song",
  singer: "/dashboard/singer",
  genre: "/dashboard/genre",
  playlistDetail: "/dashboard/playlist/:id",
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

  {
    path: privateRouteMap.addSong,
    component: AddSongPage,
    layout: DashBoardLayout,
  },
  {
    path: privateRouteMap.songLyric,
    component: DashboardEditSongLyric,
    layout: DashBoardLayout,
  },
];

export { publicRoutes, privateRoutes, protectedRoutes };
