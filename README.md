# Kiểm thử website quản lý thuế thu nhập cá nhân

## 1. Tổng quan

Dự án là website quản lý thuế thu nhập cá nhân, gồm các vai trò nhân viên, kế toán và trưởng phòng. Bộ kiểm thử tự động dùng **Mocha** để tổ chức test case và **Selenium WebDriver** để thao tác trên trình duyệt thật. Các bài kiểm thử hiện tập trung vào đăng nhập, thiết lập giảm trừ, tính thuế và tra cứu thuế nhân viên.

Ứng dụng là website tĩnh, không có lệnh khởi động máy chủ được khai báo trong `package.json`. Các test Selenium đang truy cập địa chỉ `http://127.0.0.1:5500/`, vì vậy cần mở website bằng một máy chủ tĩnh tại đúng địa chỉ này trước khi chạy test.

## 2. Cấu trúc liên quan đến kiểm thử

- `index.html`: trang đăng nhập và điểm bắt đầu của ứng dụng.
- `html/`: giao diện theo vai trò, gồm kế toán, nhân viên và trưởng phòng.
- `js/`: mã giao diện và các file test Selenium có hậu tố `.spec.js`.
- `excel_data/`: dữ liệu nhân viên được ứng dụng sử dụng.
- `Testcase.xlsx`: tài liệu test case thủ công của dự án.
- `Video/`: video minh họa quá trình kiểm thử.

## 3. Công nghệ và yêu cầu

- Node.js và npm.
- Các thư viện Mocha và Selenium WebDriver được khai báo trong `package.json` ở thư mục gốc.
- Google Chrome và Mozilla Firefox: các suite hiện chọn cả hai trình duyệt.
- WebDriver tương thích với trình duyệt. Selenium Manager có thể tự tìm/tải driver trong môi trường cho phép truy cập mạng; nếu không, cần cấu hình driver tương ứng trên máy.
- Tiện ích **Live Server** trong VS Code hoặc máy chủ tĩnh tương đương, được cấu hình phục vụ thư mục gốc tại cổng `5500`.

## 4. Chuẩn bị môi trường

Mở terminal tại thư mục gốc dự án và cài các dependency:

```bash
npm install
```

Trong VS Code, mở `index.html` bằng **Live Server**. Xác nhận trang đăng nhập truy cập được tại `http://127.0.0.1:5500/index.html` trước khi chạy Selenium. Nếu Live Server chọn cổng khác, hãy đổi cấu hình về `5500`, vì địa chỉ đang được ghi cố định trong các file test.

## 5. Quy trình kiểm thử tự động

1. Cài dependency Node.js và chuẩn bị Chrome, Firefox cùng WebDriver.
2. Khởi chạy website tĩnh tại `127.0.0.1:5500`.
3. Chạy Mocha từ thư mục gốc. Mocha nạp các file `*.spec.js` trong `js/`.
4. Với mỗi test case, Selenium mở trình duyệt, điều hướng tới ứng dụng, thao tác với các trường/nút và kiểm tra một số điều kiện được viết trong test.
5. Hook `afterEach` đóng trình duyệt sau từng test case.
6. Mocha hiển thị kết quả trong terminal. Một số bài test chỉ thao tác giao diện mà chưa kiểm tra kết quả đầu ra, xem mục **Giới hạn hiện tại**.

### Chạy toàn bộ suite

```bash
npx mocha "js/*.spec.js"
```

Trong PowerShell trên Windows, nếu `npx` bị chặn bởi Execution Policy, dùng shim `.cmd`:

```powershell
npx.cmd mocha "js/*.spec.js"
```

### Chạy một suite

```bash
npx mocha js/dangNhap.spec.js
npx mocha js/giamTru.spec.js
npx mocha js/tinhThuThue.spec.js
npx mocha js/tinhThue1Thang.spec.js
npx mocha js/xemThueNhanVien.spec.js
```

Các lệnh trên có thể thay `npx` bằng `npx.cmd` trong PowerShell nếu cần.

## 6. Phạm vi các suite

| File test | Trình duyệt | Phạm vi kiểm thử |
| --- | --- | --- |
| `js/dangNhap.spec.js` | Firefox | Đăng nhập bằng 50 tài khoản mẫu, chờ nút đăng xuất được tìm thấy rồi đăng xuất. |
| `js/giamTru.spec.js` | Chrome | Thao tác chức năng thiết lập giảm trừ với các trường hợp mã nhân viên thiếu/sai, lương thiếu/có giá trị, số người phụ thuộc âm, hợp lệ hoặc thiếu. Các test được đặt tên từ `TC001` đến `TC008`. |
| `js/tinhThuThue.spec.js` | Chrome | Tính thuế với 22 cặp lương và số người phụ thuộc, gồm lương bằng 0, thu nhập thấp, giá trị dương/âm và số người phụ thuộc vượt giới hạn; so sánh nội dung thông báo alert mong đợi. |
| `js/tinhThue1Thang.spec.js` | Firefox | Đăng nhập bằng các tài khoản mẫu và kiểm tra đăng nhập thành công. File hiện tạo hai test có nội dung giống nhau cho mỗi tài khoản trong danh sách 50 tài khoản. |
| `js/xemThueNhanVien.spec.js` | Chrome | Đăng nhập bằng 10 tài khoản mẫu, mở chức năng xem thuế nhân viên và thao tác tra cứu. |

Thông tin tài khoản kiểm thử được ghi trực tiếp trong các file test. Không dùng tài khoản thật hoặc dữ liệu cá nhân thật khi mở rộng danh sách này.

## 7. Diễn giải kết quả

- `passing`: test chạy hết và các assertion trong test đó thỏa mãn.
- `failing`: thao tác Selenium lỗi, không tìm thấy phần tử, timeout, hoặc assertion thất bại.
- Nếu không mở được trình duyệt, kiểm tra trình duyệt/WebDriver và khả năng Selenium Manager tải driver.
- Nếu test không mở được trang, kiểm tra Live Server đang phục vụ đúng thư mục và cổng `5500`.
- Các test dùng selector CSS và ID của giao diện. Thay đổi cấu trúc HTML có thể khiến test cần được cập nhật.

## 8. Giới hạn hiện tại và lưu ý

- `tinhThuThue.spec.js` bắt lỗi assertion bên trong `try/catch` rồi chỉ ghi log; lỗi so sánh alert có thể không được Mocha báo là test `failing`.
- `dangNhap.spec.js` và `tinhThue1Thang.spec.js` gọi `isDisplayed()` nhưng không `await` kết quả; vì vậy assertion hiện tại chưa xác nhận đúng trạng thái hiển thị của nút đăng xuất.
- `giamTru.spec.js` và `xemThueNhanVien.spec.js` chủ yếu thực hiện thao tác, chưa có assertion xác nhận đầy đủ kết quả hiển thị hoặc dữ liệu được lưu.
- `tinhThue1Thang.spec.js` đặt hai test giống nhau cho mỗi tài khoản, làm số lần chạy tăng gấp đôi.
- Test phụ thuộc vào tài khoản mẫu, dữ liệu ứng dụng, trình duyệt và máy chủ chạy ở cổng cố định; kết quả có thể khác nếu các dữ liệu này thay đổi.
- `package.json` hiện chưa khai báo script `test`; do đó chạy Mocha trực tiếp bằng `npx mocha` như hướng dẫn ở trên.

Đây là mô tả bộ test hiện có, không khẳng định mọi quy tắc nghiệp vụ hay mọi vai trò của ứng dụng đã được kiểm thử đầy đủ.
