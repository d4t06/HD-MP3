import HomePage from "../pages/Home";
import SongsPage from "../pages/MySongs";
import Playlist from "../pages/Playlist";
import Favorite from "../pages/Favorite";
import Edit from "../pages/Edit";
import NoPlayer from "../layout/NoPlayer";
import DashBoard from "../pages/Dashboard";
import PlaylistDetail from "../pages/PlaylistDetail";

const routes = {
   Home: "/React-Zingmp3",
   dashboard: "/React-Zingmp3/dashboard",

   MySongs: "/React-Zingmp3/mysongs",
   Playlist: "/React-Zingmp3/mysongs/playlist",
   favorite: "/React-Zingmp3/mysongs/favorite",
   Edit: "/React-Zingmp3/edit/:id",
}

const publicRoutes = [
   {path: routes.Home, component: HomePage, layout: ''},
   
   {path: routes.dashboard, component: DashBoard , layout: ''}, 

   {path: routes.MySongs, component: SongsPage, layout: ''},
   {path: routes.Playlist, component: Playlist, layout: ''},
   {path: `${routes.Playlist}/:name`, component: PlaylistDetail, layout: ''},

   {path: routes.favorite, component: Favorite, layout: ''},

   {path: routes.Edit, component: Edit , layout: NoPlayer},

]

export {publicRoutes, routes}