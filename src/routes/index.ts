import PrimaryLayout from "@/layout/primary-layout";
import { Home, Search, MyMusic, Login, Unauthorized, Playlist } from "../pages";
import {
  DashboardAddSongPage,
  DashboardEditSongPage,
  DashboardGenrePage,
  DashboardEditPlaylistPage,
  DashboardPlaylistPage,
  DashboardSingerPage,
  DashboardPage,
  DashboardSongLyricPage,
  DashboardSongPage,
} from "../pages/dashboard";
import AddSongLayout from "@/layout/dashboard/add-song-layout";
import PlaylistLayout from "@/layout/dashboard/playlist-layout";

const pubicRouteMap = {
  home: "/",
  search: "/search",
  playlist: "/playlist/:id",
  login: "/login",
  unauthorized: "/unauthorized",
};

const protectedRouteMap = {
  myMusic: "/my-music",
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
  songLyric: "/dashboard/lyric/:songId",
};

export type PlaylistParamsType = {
  id: string;
};
const publicRoutes = [
  { path: pubicRouteMap.home, component: Home, layout: "" },
  { path: pubicRouteMap.playlist, component: Playlist, layout: "" },
  { path: pubicRouteMap.search, component: Search, layout: "" },
  { path: pubicRouteMap.login, component: Login, layout: "" },
  { path: pubicRouteMap.unauthorized, component: Unauthorized, layout: "" },
];

const protectedRoutes = [
  { path: protectedRouteMap.myMusic, component: MyMusic, layout: "" },
];

const privateRoutes = [
  {
    path: privateRouteMap.dashboard,
    component: DashboardPage,
    layout: "",
  },
  {
    path: privateRouteMap.playlist,
    component: DashboardPlaylistPage,
    layout: "",
  },
  {
    path: privateRouteMap.genre,
    component: DashboardGenrePage,
    layout: "",
  },
  {
    path: privateRouteMap.singer,
    component: DashboardSingerPage,
    layout: "",
  },
  {
    path: privateRouteMap.playlistDetail,
    component: DashboardEditPlaylistPage,
    layout: PlaylistLayout,
  },
  {
    path: privateRouteMap.song,
    component: DashboardSongPage,
    layout: "",
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
    layout: "",
  },
];

export { publicRoutes, privateRoutes, protectedRoutes };
