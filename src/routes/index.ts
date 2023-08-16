import HomePage from "../pages/Home";
import SongsPage from "../pages/Songs";
import Playlist from "../pages/Playlist";
import Favorite from "../pages/Favorite";

const publicRoutes = [
   {path: '/React-Zingmp3', component: HomePage},
   {path: '/songs', component: SongsPage},
   {path: '/playlist', component: Playlist},
   {path: '/favorite', component: Favorite},

]

export {publicRoutes}