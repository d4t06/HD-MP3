import { Playlist, Song } from "../types";

export const testSongs: (Song & { song_in: string })[] = [
   {
      blurhash_encode: "",
      song_url:
         "https://firebasestorage.googleapis.com/v0/b/zingmp3-clone-61799.appspot.com/o/songs%2Fdatb2110118%40student.ctu.edu.vn_alexskrindo-jumbo%5Bncsrelease%5D.mp3?alt=media&token=ce5c858f-d936-4fc9-903f-2a562e1118ea",
      by: "admin",
      id: "alexskrindojumboncsrelease_0DR0_admin",
      duration: 191,
      song_file_path: "songs/datb2110118@student.ctu.edu.vn_alexskrindo-jumbo[ncsrelease].mp3",
      singer: "Alex Skrindo",
      lyric_id: "alexskrindojumboncsrelease_0DR0_admin",
      image_file_path: "",
      image_url: "",
      song_in: "admin",
      name: "Jumbo",
   },
   // {
   //    name: "Savannah",
   //    image_url:
   //       "https://firebasestorage.googleapis.com/v0/b/zingmp3-clone-61799.appspot.com/o/images%2Fdivinerssavannahfeatphillykncsrelease_XFi1_admin_stock?alt=media&token=2c144bed-1d96-43ad-a4f1-3a11e03a21da",
   //    image_file_path: "images/divinerssavannahfeatphillykncsrelease_XFi1_admin_stock",
   //    lyric_id: "divinerssavannahfeatphillykncsrelease_XFi1_admin",
   //    song_url:
   //       "https://firebasestorage.googleapis.com/v0/b/zingmp3-clone-61799.appspot.com/o/songs%2Fhuudat01234560_diviners-savannah(feat.phillyk)%5Bncsrelease%5D.mp3?alt=media&token=16b82198-8217-4672-ab4a-ed133382591f",
   //    singer: "Diviners",
   //    id: "divinerssavannahfeatphillykncsrelease_XFi1_admin",
   //    song_file_path: "songs/huudat01234560_diviners-savannah(feat.phillyk)[ncsrelease].mp3",
   //    blurhash_encode: "U;OAh{sUafkB}rW;oLjZ9wWpodWCnPsAR+kB",
   //    duration: 205,
   //    by: "admin",
   //    song_in: "admin",
   // },
   // {
   //    song_url:
   //       "https://firebasestorage.googleapis.com/v0/b/zingmp3-clone-61799.appspot.com/o/songs%2Fhuudat01234560_differentheaven-safeandsound%5Bncsrelease%5D.mp3?alt=media&token=c5e9cbb1-6cc8-4f24-b05d-86a33b700b69",
   //    by: "admin",
   //    song_in: "admin",
   //    lyric_id: "ncs005dddifferentheavensafeandsound_Rnfk_admin",
   //    id: "ncs005dddifferentheavensafeandsound_Rnfk_admin",
   //    blurhash_encode: "U48Eh:@@D47y*Wz~tLGg00CPyp*#HQ7TS5[O",
   //    name: "Safe And Sound",
   //    singer: "Different Heaven",
   //    image_file_path: "images/ncs005dddifferentheavensafeandsound_Rnfk_admin_stock",
   //    image_url:
   //       "https://firebasestorage.googleapis.com/v0/b/zingmp3-clone-61799.appspot.com/o/images%2Fncs005dddifferentheavensafeandsound_Rnfk_admin_stock?alt=media&token=cb41fea4-1246-431e-a0d9-f36ec86fd494",
   //    song_file_path: "songs/huudat01234560_differentheaven-safeandsound[ncsrelease].mp3",
   //    duration: 205,
   // },
   // {
   //    by: "admin",
   //    song_in: "admin",
   //    name: "Popsicle",
   //    song_url:
   //       "https://firebasestorage.googleapis.com/v0/b/zingmp3-clone-61799.appspot.com/o/songs%2Fhuudat01234560_lfz-popsicle.mp3?alt=media&token=77b74c05-bea6-496e-9ce4-dc598f12a562",
   //    song_file_path: "songs/huudat01234560_lfz-popsicle.mp3",
   //    id: "popsicle_Wv03_admin",
   //    image_file_path: "images/popsicle_Wv03_admin_stock",
   //    singer: "LFZ",
   //    lyric_id: "",
   //    duration: 266,
   //    blurhash_encode: "U6S#-ux]bwvVX9P3ugSJysXNInogTER5Tvum",
   //    image_url:
   //       "https://firebasestorage.googleapis.com/v0/b/zingmp3-clone-61799.appspot.com/o/images%2Fpopsicle_Wv03_admin_stock?alt=media&token=76e37783-06b9-4456-a89c-47d06746e4b7",
   // },
   // {
   //    blurhash_encode: "UCAJ${xc00M_OXWVnNjr00R%~Xt7;2s:OtR+",
   //    name: "Gizmo",
   //    song_file_path: "songs/huudat01234560_syncole-gizmo[ncsrelease].mp3",
   //    by: "admin",
   //    duration: 192,
   //    id: "syncolegizmoncsreleasemp3_dfkD_admin",
   //    song_in: "admin",
   //    singer: "Syn Cole",
   //    image_file_path: "images/syncolegizmoncsreleasemp3_dfkD_admin_stock",
   //    lyric_id: "syncolegizmoncsreleasemp3_dfkD_admin",
   //    image_url:
   //       "https://firebasestorage.googleapis.com/v0/b/zingmp3-clone-61799.appspot.com/o/images%2Fsyncolegizmoncsreleasemp3_dfkD_admin_stock?alt=media&token=8feb2882-d550-4a09-b2b8-a34e21a90f32",
   //    song_url:
   //       "https://firebasestorage.googleapis.com/v0/b/zingmp3-clone-61799.appspot.com/o/songs%2Fhuudat01234560_syncole-gizmo%5Bncsrelease%5D.mp3?alt=media&token=3a59d31d-10b8-4845-a2c5-35fb075fabd2",
   // },
   {
      name: "Time",
      song_file_path: "songs/syncole-time.mp3_huudat01234560",
      singer: "Syn Cole",
      blurhash_encode: "U8H,Yj56Mdxt7%r=n$S400%1X,V[_#OZo#s,",
      image_file_path: "images/time_eFcd_admin_stock",
      by: "admin",
      id: "time_eFcd_admin",
      song_url:
         "https://firebasestorage.googleapis.com/v0/b/zingmp3-clone-61799.appspot.com/o/songs%2Fsyncole-time.mp3_huudat01234560?alt=media&token=68c0f28e-50b1-4f25-8fb3-c61221154d27",
      lyric_id: "time_eFcd_admin",
      duration: 183,
      image_url:
         "https://firebasestorage.googleapis.com/v0/b/zingmp3-clone-61799.appspot.com/o/images%2Ftime_eFcd_admin_stock?alt=media&token=b340df35-159e-4cb1-8b6a-6e9574b849a4",
      song_in: "admin",
   },
   {
      blurhash_encode: "UZOzSt~qD%tlozi_buV@x]s:ozaK-VNunOkq",
      lyric_id: "tropiclove_GKjN_admin",
      name: "Tropic Love",
      singer: "Contacreast",
      by: "admin",
      image_file_path: "images/tropiclove_GKjN_admin_stock",
      duration: 300,
      song_url:
         "https://firebasestorage.googleapis.com/v0/b/zingmp3-clone-61799.appspot.com/o/songs%2Fhuudat01234560_contacreast-tropiclove.mp3?alt=media&token=84b102c3-5e44-4e0d-ae90-0c4f0d886c50",
      song_in: "admin",
      id: "tropiclove_GKjN_admin",
      song_file_path: "songs/huudat01234560_contacreast-tropiclove.mp3",
      image_url:
         "https://firebasestorage.googleapis.com/v0/b/zingmp3-clone-61799.appspot.com/o/images%2Ftropiclove_GKjN_admin_stock?alt=media&token=19fbd815-6b18-47b6-8f28-db7a6c0638d6",
   },
];

export const testPlaylists: Playlist[] = [
   {
      name: "NCS",
      id: "test_b6-B_admin",
      time: 654,
      count: 3,
      blurhash_encode: "U48Eh:@@D47y*Wz~tLGg00CPyp*#HQ7TS5[O",
      image_url:
         "https://firebasestorage.googleapis.com/v0/b/zingmp3-clone-61799.appspot.com/o/images%2Fncs005dddifferentheavensafeandsound_Rnfk_admin_stock?alt=media&token=cb41fea4-1246-431e-a0d9-f36ec86fd494",
      by: "admin",
      song_ids: [
         "time_eFcd_admin",
         "popsicle_Wv03_admin",
         "ncs005dddifferentheavensafeandsound_Rnfk_admin",
      ],
   },
];
