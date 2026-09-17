# Bài tập: Asynchronous booking workflow

## Mục tiêu

Hoàn thành ba API trong `booking-workflow.js`:

1. Callback API.
2. Promise API.
3. Async workflow dùng `await`.

## Quy tắc

- Không đổi dữ liệu mẫu.
- Không đổi tên hoặc parameter của function.
- Không sửa test để test pass.
- Dùng `setTimeout(..., 100)` để mô phỏng I/O.
- Chưa dùng package ngoài.

## Trình tự

### Bước 1: Callback

Hoàn thành `findRoomWithCallback()`.

Chạy:

```powershell
npm run test:exercise
```

Hai test callback cần pass trước khi làm tiếp.

### Bước 2: Promise

Hoàn thành `findRoom()` bằng `new Promise()`.

Hai nhánh cần có:

- `resolve(room)`
- `reject(new Error('Room not found'))`

### Bước 3: async/await

Hoàn thành `createBooking()`.

Yêu cầu:

- `hours <= 0` phải throw `Error('Hours must be greater than 0')`.
- Phải gọi và await `findRoom(roomId)`.
- Room không available phải throw `Error('Room is unavailable')`.
- Giá tiền bằng `hourlyPrice * hours`.

### Bước 4: Hoàn thành

```powershell
npm run test:exercise
```

Kết quả cần đạt:

```text
tests 7
pass 7
fail 0
```

## Sau khi test pass

Tự trả lời:

1. Callback được gọi ở đâu?
2. Promise được tạo và settled ở đâu?
3. Lỗi từ `findRoom()` đi qua `createBooking()` như thế nào?
4. Nếu bỏ `await`, biến `room` chứa giá trị gì?
5. Phần nào mô phỏng database I/O?
