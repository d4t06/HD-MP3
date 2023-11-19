import { Playlist, Song } from "../types";

export const testSongs: Song[] = [
   {
      name: "Waiting For Love",
      blurhash_encode: "U5EyDD0000k]00=}?]9a]ppH^+RO4-MeIT-;",
      in_playlist: [],
      song_url:
         "https://firebasestorage.googleapis.com/v0/b/zingmp3-clone-61799.appspot.com/o/songs%2Fwaitingforlove-avicii_simonaldred.mp3_huudat01234560?alt=media&token=d8dfd092-d06c-45f2-9bdc-d287c14b9a15",
      song_file_path: "songs/waitingforlove-avicii_simonaldred.mp3_huudat01234560",
      singer: "Avicii, Simon Aldred",
      duration: 230.7,
      image_file_path: "images/waitingforlove_mrV__admin_stock",
      lyric_id: "waitingforlove_aviciisimonaldred",
      by: "admin",
      id: "waitingforlove_mrV__admin",
      image_url:
         "https://firebasestorage.googleapis.com/v0/b/zingmp3-clone-61799.appspot.com/o/images%2Fwaitingforlove_mrV__admin_stock?alt=media&token=0feacd9d-aa74-42ec-8072-5199da889aa4",
   },

   {
      name: "Waiting For Love User",
      blurhash_encode: "U5EyDD0000k]00=}?]9a]ppH^+RO4-MeIT-;",
      in_playlist: [],
      song_url:
         "https://firebasestorage.googleapis.com/v0/b/zingmp3-clone-61799.appspot.com/o/songs%2Fwaitingforlove-avicii_simonaldred.mp3_huudat01234560?alt=media&token=d8dfd092-d06c-45f2-9bdc-d287c14b9a15",
      song_file_path: "songs/waitingforlove-avicii_simonaldred.mp3_huudat01234560",
      singer: "Avicii, Simon Aldred",
      duration: 230.7,
      image_file_path: "images/waitingforlove_mrV__admin_stock",
      lyric_id: "waitingforlove_aviciisimonaldred",
      by: "user",
      id: "waitingforlove_mrV__admin__user",
      image_url:
         "https://firebasestorage.googleapis.com/v0/b/zingmp3-clone-61799.appspot.com/o/images%2Fwaitingforlove_mrV__admin_stock?alt=media&token=0feacd9d-aa74-42ec-8072-5199da889aa4",
   },
];

export const testPlaylists: Playlist[] = [
   {
      song_ids: ["tropiclove_i2Fn_admin", "pain_bmxi_admin", "stereoheartsfeatadamlevine_m3Yg"],
      image_url:
         "https://firebasestorage.googleapis.com/v0/b/zingmp3-clone-61799.appspot.com/o/images%2Fpain_bmxi_admin_stock?alt=media&token=d0bacec2-835e-4f68-a7b6-544580d2b582",
      time: 694,
      blurhash_encode: "UFC5iOSh4:X8{|ayW;WVDhay-;ayogShnioJ",
      id: "test_b6-B_admin_adf",
      count: 3,
      image_file_path: "",
      by: "user",
      image_by: "",
      name: "NCS",
   },

   {
      song_ids: ["tropiclove_i2Fn_admin", "pain_bmxi_admin"],
      image_url:
         "https://firebasestorage.googleapis.com/v0/b/zingmp3-clone-61799.appspot.com/o/images%2Fpain_bmxi_admin_stock?alt=media&token=d0bacec2-835e-4f68-a7b6-544580d2b582",
      time: 694,
      blurhash_encode: "UFC5iOSh4:X8{|ayW;WVDhay-;ayogShnioJ",
      id: "test_b6-B_admin",
      count: 3,
      image_file_path: "",
      by: "admin",
      image_by: "",
      name: "NCS",
   },
];
