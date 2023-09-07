import HomePage from "../pages/Home";
import SongsPage from "../pages/Songs";
import Playlist from "../pages/Playlist";
import Favorite from "../pages/Favorite";
import Upload from "../pages/Upload";
import Edit from "../pages/Edit";
import NoPlayer from "../layout/NoPlayer";

const routes = {
   home: "/React-Zingmp3",
   allSong: "/React-Zingmp3/songs",
   playlist: "/React-Zingmp3/playlist",
   favorite: "/React-Zingmp3/favorite",
   upload: "/React-Zingmp3/upload",
   Edit: "/React-Zingmp3/edit",
}

const publicRoutes = [
   {path: routes.home, component: HomePage, layout: ''},
   {path: routes.allSong, component: SongsPage, layout: ''},
   {path: routes.playlist, component: Playlist, layout: ''},
   {path: routes.favorite, component: Favorite, layout: ''},
   {path: routes.upload, component: Upload, layout: NoPlayer},
   {path: routes.Edit, component: Edit , layout: NoPlayer},

]

export {publicRoutes, routes}