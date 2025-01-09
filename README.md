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

### update thứ 3 21/11/2023

- thêm require auth cho trang dashboard

### update thứ 4 29/11/2023

- Sửa giao diện, fix lỗi

### update thứ 6 1/2/2024

- margin sẽ không hoạt động nếu dùng flex gap

### update thứ 2 6/5/2024

- refactoring code
- use empty value context

### update Wednesday 23/10/2024

- Store temp song lyric in case the submit process error
- Refactoring set song's current time to localStorage
- Fix restore song's current time by the previous playing
- Instant scroll to active lyric when go to edit lyric page
- Refactoring playStatusSlice
- Refactoring get song lyric
- blur filter cause lag on iphone => fix: translate3d 0

### update Tuesday 29/10/2024

- Fix bug

### update Thursday 9/1/2025

- Refactoring login logic, getSongAndPlaylist logic

### Song

- [x] upload
- [x] edit
- [x] delete
- [x] add to playlist
- [x] delete from playlist
- [x] add lyrics
- [x] active
- [x] like song
- [x] Handle actually song when edit song
- [x] Handle actually song when upload song
- [x] Handle actually song when delete songs

### Playlist

- [x] add
- [x] edit playlist
- [x] delete playlist
- [x] add songs to playlist
- [x] active
- [x] handle actually song when remove song
- [x] handle actually song when add new song
- [x] handle actually song when add to playlist song item

### Song queue

- [x] add song
- [x] remove song
- [x] clear song

### Control

- [x] repeat
- [x] shuffle
- [x] timer
- [x] focus mode

### data

- [x] global upload

--- song

- [x] Handle user like_song_ids song when song deleted

--- playlist

- [] Handle playlist songs when song delete

### ui

- [x] song name overflow in queue
- [x] direct edit lyric item in lyric edit
- [x] fix scroll text
- [x] increase song thumb size when min width 1356px
- [x] scroll to first temp song when upload song
- [x] add my logo
- [x] add text color to theme props

### Issues

- [x] không tải được like song ở trên mobile
- [x] Nút điều khiển trên mobile to
- [x] không load dươc lyric trên mobile
- [x] dừng load lyric song khi song lỗi
- [x] edit song in playlist page
