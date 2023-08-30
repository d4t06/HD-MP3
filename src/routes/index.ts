import HomePage from "../pages/Home";
import SongsPage from "../pages/Songs";
import Playlist from "../pages/Playlist";
import Favorite from "../pages/Favorite";
import Upload from "../pages/Upload";

const routes = {
   home: "/React-Zingmp3",
   allSong: "/React-Zingmp3/songs",
   playlist: "/React-Zingmp3/playlist",
   favorite: "/React-Zingmp3/favorite",
   upload: "/React-Zingmp3/upload",
}

const publicRoutes = [
   {path: routes.home, component: HomePage},
   {path: routes.allSong, component: SongsPage},
   {path: routes.playlist, component: Playlist},
   {path: routes.favorite, component: Favorite},
   {path: routes.upload, component: Upload},

]

export {publicRoutes, routes}