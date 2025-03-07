import PrimaryLayout from "@/layout/primary-layout";
import { Home, Search, MyMusic, Login, Unauthorized } from "../pages";
import {
  DashboardAddSongPage,
  DashboardEditSongPage,
  DashboardGenrePage,
  DashboardPlaylistDetailPage,
  DashboardPlaylistPage,
  DashboardSingerPage,
  DashboardPage,
  DashboardSongLyricPage,
  DashboardSongPage,
} from "../pages/dashboard";
import DashBoardLayout from "@/layout/dashboard/dashboard-layout";
import AddSongLayout from "@/layout/dashboard/add-song-layout";

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
  singer: "/dashboard/singer",
  genre: "/dashboard/genre",
  playlist: "/dashboard/playlist",
  song: "/dashboard/song",
  addSong: "/dashboard/song/add-song",
  editSong: "/dashboard/song/:songId/edit",
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
    component: DashboardPage,
    layout: DashBoardLayout,
  },
  {
    path: privateRouteMap.playlist,
    component: DashboardPlaylistPage,
    layout: DashBoardLayout,
  },
  {
    path: privateRouteMap.genre,
    component: DashboardGenrePage,
    layout: DashBoardLayout,
  },
  {
    path: privateRouteMap.singer,
    component: DashboardSingerPage,
    layout: DashBoardLayout,
  },
  {
    path: privateRouteMap.playlistDetail,
    component: DashboardPlaylistDetailPage,
    layout: DashBoardLayout,
  },
  {
    path: privateRouteMap.song,
    component: DashboardSongPage,
    layout: DashBoardLayout,
  },

  {
    path: privateRouteMap.addSong,
    component: DashboardAddSongPage,
    layout: AddSongLayout,
  },
  {
    path: privateRouteMap.editSong,
    component: DashboardEditSongPage,
    layout: AddSongLayout,
  },
  {
    path: privateRouteMap.songLyric,
    component: DashboardSongLyricPage,
    layout: DashBoardLayout,
  },
];

export { publicRoutes, privateRoutes, protectedRoutes };
