import SingerLayout from "@/layout/dashboard/singer-layout";
import {
  Home,
  Search,
  MyMusic,
  Unauthorized,
  Playlist,
  EditSongLyric,
  SingerPage,
  UserPage,
  CategoryPage
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
  DashboardAlbumPage,
  HubPageConfig,
} from "../pages/dashboard";
import AddSongLayout from "@/layout/dashboard/add-song-layout";
import PlaylistLayout from "@/layout/dashboard/playlist-layout";
import DashboardEditAlbumPage from "@/pages/dashboard/album/edit";
import ForYouPage from "@/pages/for-you";
import HomePageConfig from "@/pages/dashboard/homepage-config";

const pubicRouteMap = {
  home: "/",
  discorver: "/discover",
  catogory: "/category",
  search: "/search",
  playlist: "/playlist/:id",
  login: "/login",
  unauthorized: "/unauthorized",
  singer: "/singer/:id",
  user: "/user/:id",
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
  songLyric: "/dashboard/lyric/:id",
  singer: "/dashboard/singer",
  editSinger: "/dashboard/singer/:id",
  album: "/dashboard/album",
  editAlbum: "/dashboard/album/:id",
  homepage: "/dashboard/homepage",
  hubpage: "/dashboard/hubpage",
  hubpageDetail: "/dashboard/hubpage/:id",
};

export type PlaylistParamsType = {
  id: string;
};
const publicRoutes = [
  { path: pubicRouteMap.home, component: ForYouPage, layout: "" },
  { path: pubicRouteMap.discorver, component: Home, layout: "" },
  { path: pubicRouteMap.playlist, component: Playlist, layout: "" },
  { path: pubicRouteMap.search, component: Search, layout: "" },
  { path: pubicRouteMap.unauthorized, component: Unauthorized, layout: "" },
  { path: pubicRouteMap.singer, component: SingerPage, layout: "" },
  { path: pubicRouteMap.user, component: UserPage, layout: "" },
  { path: pubicRouteMap.catogory, component: CategoryPage, layout: "" },
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
    path: privateRouteMap.album,
    component: DashboardAlbumPage,
    layout: "",
  },
  {
    path: privateRouteMap.editAlbum,
    component: DashboardEditAlbumPage,
    layout: "",
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
  {
    path: privateRouteMap.songLyric,
    component: DashboardSongLyricPage,
    layout: "",
  },
  {
    path: privateRouteMap.homepage,
    component: HomePageConfig,
    layout: "",
  },
  {
    path: privateRouteMap.hubpage,
    component: HubPageConfig,
    layout: "",
  },
];

export { publicRoutes, privateRoutes, protectedRoutes };
