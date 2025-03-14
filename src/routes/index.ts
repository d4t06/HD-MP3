import SingerLayout from "@/layout/dashboard/singer-layout";
import {
  Home,
  Search,
  MyMusic,
  Unauthorized,
  Playlist,
  EditSongLyric,
  SingerPage,
} from "../pages";
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
  DashboardEditSingerPage,
} from "../pages/dashboard";
import AddSongLayout from "@/layout/dashboard/add-song-layout";
import PlaylistLayout from "@/layout/dashboard/playlist-layout";

const pubicRouteMap = {
  home: "/",
  search: "/search",
  playlist: "/playlist/:id",
  login: "/login",
  unauthorized: "/unauthorized",
  singer: "/singer/:id",
};

const protectedRouteMap = {
  myMusic: "/my-music",
  songLyric: "/my-music/lyric/:id",
};

const privateRouteMap = {
  dashboard: "/dashboard",
  genre: "/dashboard/genre",
  playlist: "/dashboard/playlist",
  song: "/dashboard/song",
  addSong: "/dashboard/song/add-song",
  editSong: "/dashboard/song/:songId/edit",
  playlistDetail: "/dashboard/playlist/:id",
  songLyric: "/dashboard/lyric/:songId",
  singer: "/dashboard/singer",
  editSinger: "/dashboard/singer/:id",
};

export type PlaylistParamsType = {
  id: string;
};
const publicRoutes = [
  { path: pubicRouteMap.home, component: Home, layout: "" },
  { path: pubicRouteMap.playlist, component: Playlist, layout: "" },
  { path: pubicRouteMap.search, component: Search, layout: "" },
  { path: pubicRouteMap.unauthorized, component: Unauthorized, layout: "" },
  { path: pubicRouteMap.singer, component: SingerPage, layout: "" },
];

const protectedRoutes = [
  { path: protectedRouteMap.myMusic, component: MyMusic, layout: "" },
  { path: protectedRouteMap.songLyric, component: EditSongLyric, layout: "" },
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
    layout: SingerLayout,
  },
  {
    path: privateRouteMap.singer,
    component: DashboardSingerPage,
    layout: SingerLayout,
  },
  {
    path: privateRouteMap.editSinger,
    component: DashboardEditSingerPage,
    layout: SingerLayout,
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
