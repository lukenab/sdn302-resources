# Callback, Promise và async/await

## Mục tiêu buổi học

Sau buổi này, bạn cần:

- Giải thích được callback là gì.
- Mô tả ba trạng thái của Promise.
- Hiểu `async` tạo ra Promise như thế nào.
- Hiểu `await` tạm dừng phần nào của chương trình.
- Phân biệt chạy tuần tự với chạy đồng thời.
- Dự đoán thứ tự cơ bản giữa synchronous code, Promise microtask và timer callback.
- Hoàn thành workflow đặt phòng giả lập và làm test pass.

## 1. Nền tảng: JavaScript thực thi hàm

Một function có thể được lưu vào biến, truyền vào function khác và gọi sau:

```js
function greet(name) {
  console.log(`Hello, ${name}`);
}

function execute(callback) {
  callback('Lan');
}

execute(greet);
```

Trong ví dụ này, `greet` được truyền như một giá trị. `execute` quyết định thời điểm gọi nó.

## 2. Callback

Callback là function được truyền cho function khác để function nhận nó gọi tại một thời điểm phù hợp.

Callback không tự động có nghĩa là bất đồng bộ:

```js
[1, 2, 3].map((number) => number * 2);
```

Callback của `map()` được gọi đồng bộ.

Callback trở thành một phần của luồng bất đồng bộ khi API gọi nó sau khi công việc hoàn thành:

```js
setTimeout(() => {
  console.log('Timer completed');
}, 1000);
```

Node.js thường sử dụng error-first callback:

```js
function callback(error, value) {
  if (error) {
    console.error(error);
    return;
  }

  console.log(value);
}
```

Argument đầu tiên chứa lỗi hoặc `null`; argument thứ hai chứa kết quả thành công.

## 3. Promise

Promise là object đại diện cho kết quả sau cùng của một thao tác bất đồng bộ.

```text
pending
  ├── fulfilled
  └── rejected
```

Promise chỉ chuyển khỏi `pending` một lần.

```js
const promise = new Promise((resolve, reject) => {
  const success = true;

  if (success) {
    resolve('Done');
  } else {
    reject(new Error('Failed'));
  }
});
```

Để sử dụng kết quả:

```js
promise
  .then((value) => {
    console.log(value);
  })
  .catch((error) => {
    console.error(error.message);
  })
  .finally(() => {
    console.log('Finished');
  });
```

Một Promise chain phụ thuộc vào giá trị được return từ callback của `.then()`. Quên `return` có thể làm bước sau nhận `undefined` hoặc chạy sớm hơn dự kiến.

## 4. async function

Mỗi lần gọi async function, JavaScript trả về một Promise:

```js
async function getNumber() {
  return 10;
}

const result = getNumber();

console.log(result instanceof Promise); // true
```

Giá trị `10` trở thành fulfillment value của Promise.

Nếu async function throw:

```js
async function fail() {
  throw new Error('Failed');
}
```

Promise trả về sẽ ở trạng thái rejected.

## 5. await

`await` nhận một Promise và tạm dừng phần còn lại của async function cho đến khi Promise settled.

```js
async function run() {
  const value = await Promise.resolve(10);
  console.log(value);
}
```

`await` không chặn toàn bộ Node.js process. Trong lúc function `run()` đang chờ, event loop vẫn có thể xử lý công việc khác.

Nếu Promise rejected, biểu thức `await` throw lỗi:

```js
async function run() {
  try {
    await Promise.reject(new Error('Database unavailable'));
  } catch (error) {
    console.error(error.message);
  }
}
```

## 6. Tuần tự và đồng thời

Chạy tuần tự khi bước sau cần kết quả bước trước:

```js
const room = await findRoom();
const booking = await createBooking(room);
```

Chạy đồng thời khi các thao tác độc lập:

```js
const [rooms, users] = await Promise.all([
  loadRooms(),
  loadUsers()
]);
```

Không dùng `Promise.all()` nếu bước thứ hai cần dữ liệu của bước thứ nhất.

## 7. Event loop ở mức cần thiết

Thứ tự đơn giản:

1. Chạy synchronous code trên call stack.
2. Xử lý Promise microtasks.
3. Xử lý timer callbacks khi timer đã sẵn sàng.

Hãy dự đoán trước khi chạy:

```js
console.log('A');

setTimeout(() => console.log('B'), 0);

Promise.resolve().then(() => console.log('C'));

console.log('D');
```

Kết quả:

```text
A
D
C
B
```

## 8. Thứ tự thực hành

1. Chạy `npm run demo:callback`.
2. Vẽ lại thời điểm callback được gọi.
3. Chạy `npm run demo:promise`.
4. Viết lại Promise chain bằng lời.
5. Chạy `npm run demo:async`.
6. So sánh output với Promise demo.
7. Dự đoán rồi chạy `npm run demo:event-loop`.
8. Làm bài tập trong thư mục `exercise`.
9. Chạy `npm run test:exercise` đến khi test pass.

## 9. Câu hỏi tự kiểm tra

1. Mọi callback có bất đồng bộ không?
2. Executor của `new Promise()` chạy ngay hay chạy sau?
3. Async function trả về gì?
4. `await` tạm dừng toàn bộ Node.js hay chỉ async function bao quanh?
5. Khi nào dùng `Promise.all()`?
6. Vì sao Promise callback thường chạy trước `setTimeout(..., 0)`?
7. Một rejected Promise đi vào `.catch()` hoặc `try/catch` bằng cách nào?

## 10. Nguồn chính thống

- [MDN: Asynchronous JavaScript](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Async_JS)
- [MDN: Using promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)
- [MDN: async function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
- [MDN: await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await)
