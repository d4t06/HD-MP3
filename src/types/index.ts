export type User = {
   name: string;
   email: string;
   username: string;
};

// export type Song = {
//    name: string;
//    singer: string;
//    path: string;
//    image: string;
//    currentIndex?: number;
// }
export type Song = {
   name: string,
   singer: string,
   image_path: string,
   song_path: string,
   by: string,
   duration: number,
   lyric: string,
}

export interface Playlist {
   name: string;
   songs: Array<number>;
}

export interface Lyric {
   start: number;
   end: number,
   text: string;
}

export type ThemeKeyType = 'red'|'green_light'|'deep_blue'

export type ThemeType = {
   id: string,
   type: string,
   bottom_player_bg: string,
   side_bar_bg: string,
   container: string
   content_text: string,
   content_hover_text: string,
   content_bg:string,
   content_hover_bg: string,
}


export type ThemesType = Record<'red'|'green_light'|'deep_blue', ThemeType>
