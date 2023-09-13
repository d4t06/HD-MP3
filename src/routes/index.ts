import HomePage from "../pages/Home";
import SongsPage from "../pages/MySongs";
import Playlist from "../pages/Playlist";
import Favorite from "../pages/Favorite";
import Edit from "../pages/Edit";
import NoPlayer from "../layout/NoPlayer";
import DashBoard from "../pages/Dashboard";
import PlaylistDetail from "../pages/PlaylistDetail";

const routes = {
   home: "/React-Zingmp3",
   allSong: "/React-Zingmp3/songs",
   playlist: "/React-Zingmp3/songs/playlist",
   favorite: "/React-Zingmp3/favorite",
   Edit: "/React-Zingmp3/edit/:id",
   dashboard: "/React-Zingmp3/dashboard"
}

const publicRoutes = [
   {path: routes.home, component: HomePage, layout: ''},
   {path: routes.allSong, component: SongsPage, layout: ''},
   {path: routes.playlist, component: Playlist, layout: ''},
   {path: `${routes.playlist}/:name`, component: PlaylistDetail, layout: ''},
   {path: routes.favorite, component: Favorite, layout: ''},
   {path: routes.Edit, component: Edit , layout: NoPlayer},
   {path: routes.dashboard, component: DashBoard , layout: ''},

]

export {publicRoutes, routes}