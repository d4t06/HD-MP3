### update thứ 4 30/8

- Thêm page upload
- Dùng Firebase phía backend, lấy dữ liệu từ Firebase

### update thứ 6 15/9

- 2 action thay đổi song list

* admin song
* user song
  - Play my song
  - Play playlist

### update thứ 7 7/10

- useRef như là biến global, có thể cập nhật giá trị trong một lần render xem usePlaylistDetail Hook

### update thứ 3 17/10

- dùng id3js thay cho id3parser, thêm thư viện blurhash để load ảnh

### update thứ 4 18/10

- Thay đổi trình tự cải thiện thời gian upload nhạc,
- Scroll in to view khi upload nhạc mới

### update thứ 5 19/10

- Sửa lại giao diện thêm lyric

### update thứ 3 24/10

- Sửa chức năng chỉnh sửa bài hát
- Issue: blurhash encode chạy tồn nhiều thời gian

### update thứ 6 27/10

- Thêm hook useDebounce khi click scroll song list

### update thứ 3 31/10

- Fix đăng xuất, đăng nhập
- Issue: Code lăp lại nhiều khi dùng setting menu ở nhiều nơi
- Error: Khi thêm mới bài hát sau đó play trong playlist detail khi mở full screen player bị lỗi

### update thứ 4 1/11

- Sửa chức năng upload nhạc
- Fix lỗi screen undefine trên mobile
- VITE_VA => import.mete.env.VITE_VARs

### update thứ 5 2/11

- Bắt lỗi chức năng upload nhạc
- Thêm component modal
- Sửa function get song lyric, chỉ lấy lyric khi full screen

### update thứ 7 4/11/2023

- Bỏ trường in_playlist ở bảng songs

### update thứ 3 7/11/2023

- Sửa hook usePlaylist detail, hoàn thiện các chức năng của admin

### update thứ 6 10/11/2023

- Thêm status repeat shuffle vào redux store thay vì

### update thứ 7 17/11/2023

- Sửa lỗi scroll text
- Global upload

### Song

- [x] upload
- [x] edit
- [x] delete
- [x] add to playlist
- [x] delete from playlist
- [x] add lyrics

### Playlist

- [x] add
- [x] edit playlist
- [x] delete playlist
- [x] add songs to playlist

### Song queue

- [x] add song
- [x] remove song
- [x] clear song

### control

- [x] repeat
- [] shuffle
- [x] timer
- [] Fix auto play when mysongs to dashboard and dashboard to mysong 

### data

- [x] global upload
- [x] Handle user like_song_ids song when song deleted
- [x] Handle song queue when edit song
- [x] Handle song queue when upload song
- [x] Handle song queue when delete songs

### ui
- [x] song name overflow in queue
- [x] direct edit lyric item in lyric edit
- [x] fix scroll text

### Issues

