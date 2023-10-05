import { Playlist, Song } from "../types";

export const testSongs: Song[] = [
   {
      lyric_id: "",
      song_file_path: "songs/Walk Away.mp3",
      duration: 185.7,
      in_playlist: [],
      singer: "LVNDSCAPE; Kaptan",
      id: "walkaway_huudat01234560",
      by: "huudat01234560@gmail.com",
      image_file_path: "",
      name: "Walk Away",
      song_url:
         "https://firebasestorage.googleapis.com/v0/b/zingmp3-clone-61799.appspot.com/o/songs%2FWalk%20Away.mp3?alt=media&token=978e43e0-fb25-42cd-bdcb-1815731147a6",
      image_url: "",
   },
   {
      id: "whatmakesyoubeautiful_huudat01234560",
      song_file_path: "songs/What Makes You Beautiful.mp3",
      in_playlist: [],
      image_file_path: "",
      by: "huudat01234560@gmail.com",
      song_url:
         "https://firebasestorage.googleapis.com/v0/b/zingmp3-clone-61799.appspot.com/o/songs%2FWhat%20Makes%20You%20Beautiful.mp3?alt=media&token=fe0d4f41-12fd-4554-be9c-50abf3955ca6",
      singer: "Direction",
      name: "What Makes You Beautiful",
      image_url: "",
      lyric_id: "",
      duration: 198.8,
   },
   {
      image_url: "",
      singer: "Rhymastic,Hoaprox",
      in_playlist: [],
      lyric_id: "",
      duration: 250.4,
      name: "Yêu 5 (Hoaprox remix)",
      id: "yeu5hoaproxremix_huudat01234560",
      song_file_path: "songs/Yêu 5 (Hoaprox remix).mp3",
      song_url:
         "https://firebasestorage.googleapis.com/v0/b/zingmp3-clone-61799.appspot.com/o/songs%2FY%C3%AAu%205%20(Hoaprox%20remix).mp3?alt=media&token=dc25cfbc-253e-4ef9-b10b-80caa6b1f399",
      by: "huudat01234560@gmail.com",
      image_file_path: "",
   },
];

export const testPlaylists: Playlist[] = [
   {
      image_by: "",
      image_file_path: "",
      by: "huudat01234560@gmail.com",
      id: "test1_huudat01234560",
      song_ids: ["alone_huudat01234560", "reality_huudat01234560"],
      count: 2,
      time: 317.7,
      image_url: "https://firebasestorage.googleapis.com/v0/b/zingmp3-clone-61799.appspot.com/o/images%2Fpexels-philippe-donn-1169754.jpg?alt=media&token=5ea92911-ed41-41ba-9271-ad5629d01050&_gl=1*zpv4ch*_ga*NzAzNTg1NzE5LjE2OTU3MzAxMTk.*_ga_CW55HF8NVT*MTY5NjQwOTg4NC4yMi4xLjE2OTY0MDk5MTcuMjcuMC4w",
      name: "test 1",
   },
   {
      image_file_path: "",
      song_ids: ["reality_huudat01234560", "alone_huudat01234560", "neverbealone_huudat01234560"],
      by: "huudat01234560@gmail.com",
      id: "test_huudat01234560",
      name: "Test",
      count: 3,
      time: 577.7,
      image_url:
         "https://firebasestorage.googleapis.com/v0/b/zingmp3-clone-61799.appspot.com/o/images%2Fpexels-eberhard-grossgasteiger-1367192.jpg?alt=media&token=ca33ebb2-ddb9-47e2-8f46-185cb77a4334&_gl=1*umtjjc*_ga*NzAzNTg1NzE5LjE2OTU3MzAxMTk.*_ga_CW55HF8NVT*MTY5NjQwNzg1My4yMS4xLjE2OTY0MDc4ODcuMjYuMC4w",
      image_by: "",
   },
];
