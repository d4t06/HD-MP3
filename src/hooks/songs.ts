import { Playlist, Song } from "../types";

export const testSongs: Song[] = [
   {
      song_file_path: "songs/Hall Of Fame.mp3",
      song_url:
         "https://firebasestorage.googleapis.com/v0/b/zingmp3-clone-61799.appspot.com/o/songs%2FHall%20Of%20Fame.mp3?alt=media&token=4513773e-5669-4166-8757-f5cf61c5ae36",
      in_playlist: [],
      image_file_path: "",
      duration: 39.4,
      name: "Hall Of Fame",
      id: "halloffame_huudat01234560",
      lyric_id: "",
      by: "huudat01234560@gmail.com",
      image_url:
         "https://e-cdns-images.dzcdn.net/images/cover/049dca48d45587b1bc5d2c47d7b875e8/500x500-000000-80-0-0.jpg",
      singer: "The Script; Will.I.Am",
   },
   {
      name: "OK",
      singer: "Binz",
      song_url:
         "https://firebasestorage.googleapis.com/v0/b/zingmp3-clone-61799.appspot.com/o/songs%2FBinz%20-%20OK%20(mp3cut.net).mp3?alt=media&token=374b0fe6-fecb-40ba-9ada-f80a5903c157",
      id: "ok_huudat01234560",
      by: "huudat01234560@gmail.com",
      duration: 34.3,
      lyric_id: "",
      image_url:
         "https://e-cdns-images.dzcdn.net/images/cover/a1c402bb54906863dadc4df4325a1627/500x500-000000-80-0-0.jpg",
      in_playlist: [],
      image_file_path: "",
      song_file_path: "songs/Binz - OK (mp3cut.net).mp3",
   },
   {
      id: "stealmygirl_huudat01234560",
      duration: 25.7,
      name: "Steal My Girl",
      in_playlist: ["test1_huudat01234560"],
      by: "huudat01234560@gmail.com",
      singer: "One Direction",
      song_url:
         "https://firebasestorage.googleapis.com/v0/b/zingmp3-clone-61799.appspot.com/o/songs%2FSteal%20My%20Girl.mp3?alt=media&token=2ee828a0-edab-4063-97c0-90fe981d4e88",
      lyric_id: "",
      song_file_path: "songs/Steal My Girl.mp3",
      image_url:
         "https://e-cdns-images.dzcdn.net/images/cover/44d6c40a5d127528c991b1923948d4bd/500x500-000000-80-0-0.jpg",
      image_file_path: "",
   },
   {
      duration: 38.8,
      song_file_path: "songs/Tuesday - Burak Yeter_ Danelle Sandoval (mp3cut.net).mp3",
      singer: "Burak Yeter; Danelle Sandoval",
      image_url: "",
      by: "huudat01234560@gmail.com",
      in_playlist: [],
      id: "tuesday_huudat01234560",
      lyric_id: "",
      image_file_path: "",
      name: "Tuesday",
      song_url:
         "https://firebasestorage.googleapis.com/v0/b/zingmp3-clone-61799.appspot.com/o/songs%2FTuesday%20-%20Burak%20Yeter_%20Danelle%20Sandoval%20(mp3cut.net).mp3?alt=media&token=e54ca1ba-cd5a-4d06-90e2-1a263052d34a",
   },
   {
      image_url: "",
      lyric_id: "",
      by: "huudat01234560@gmail.com",
      id: "youi_huudat01234560",
      name: "You & I",
      image_file_path: "",
      singer: "One Direction",
      song_file_path: "songs/You & I (mp3cut.net).mp3",
      song_url:
         "https://firebasestorage.googleapis.com/v0/b/zingmp3-clone-61799.appspot.com/o/songs%2FYou%20%26%20I%20(mp3cut.net).mp3?alt=media&token=6108db2a-bd0b-401f-b4e7-c2191c03f0bd",
      in_playlist: [],
      duration: 56.9,
   },
];

export const testPlaylists: Playlist[] = [
   {
      song_ids: ["stealmygirl_huudat01234560"],
      time: 25.7,
      id: "test1_huudat01234560",
      name: "test 1",
      count: 1,
      by: "huudat01234560@gmail.com",
      image_by: "",
      image_file_path: "",
      image_url:
         "https://e-cdns-images.dzcdn.net/images/cover/049dca48d45587b1bc5d2c47d7b875e8/500x500-000000-80-0-0.jpg",
   },
   {
      image_by: "",
      image_file_path: "",
      count: 0,
      by: "huudat01234560@gmail.com",
      name: "Test",
      time: 0,
      image_url:
         "https://firebasestorage.googleapis.com/v0/b/zingmp3-clone-61799.appspot.com/o/images%2Fpexels-eberhard-grossgasteiger-1367192.jpg?alt=media&token=ca33ebb2-ddb9-47e2-8f46-185cb77a4334&_gl=1*umtjjc*_ga*NzAzNTg1NzE5LjE2OTU3MzAxMTk.*_ga_CW55HF8NVT*MTY5NjQwNzg1My4yMS4xLjE2OTY0MDc4ODcuMjYuMC4w",
      song_ids: [],
      id: "test_huudat01234560",
   },
];
