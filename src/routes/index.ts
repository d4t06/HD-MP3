import HomePage from "../pages/Home";
import SongsPage from "../pages/MySongs";
import Playlist from "../pages/Playlist";
import Edit from "../pages/Edit";
import NoPlayer from "../layout/NoPlayer";
import DashBoard from "../pages/Dashboard";
import PlaylistDetail from "../pages/PlaylistDetail";

// mobile

const routes = {
   Home: "/React-Zingmp3",
   dashboard: "/React-Zingmp3/dashboard",

   MySongs: "/React-Zingmp3/mysongs",
   MobileMySongs: "/React-Zingmp3/mobile-mysongs",
   Playlist: "/React-Zingmp3/mysongs/playlist",
   Edit: "/React-Zingmp3/edit/:id",
}

const publicRoutes = [
   { path: routes.Home, component: HomePage, layout: '' },

   { path: routes.dashboard, component: DashBoard, layout: '' },

   { path: routes.MySongs, component: SongsPage, layout: '' },
   { path: routes.Playlist, component: Playlist, layout: '' },
   { path: `${routes.Playlist}/:name`, component: PlaylistDetail, layout: '' },



   { path: routes.Edit, component: Edit, layout: NoPlayer },

]

export { publicRoutes, routes }