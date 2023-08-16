export type User = {
   name: string;
   email: string;
   username: string;
};

export interface Song {
   name: string;
   singer: string;
   path: string;
   image: string;
   currentIndex?: number;
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
