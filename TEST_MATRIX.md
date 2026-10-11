# BẢNG MA TRẬN KIỂM THỬ VÀ NHẬT KÝ DEBUG (TEST MATRIX & DEBUG LOGS)

## 1. MA TRẬN KIỂM THỬ CHI TIẾT (TEST MATRIX)

| # | Nhóm kiểm thử | Trường hợp (Case) | Thao tác thực hiện | Kết quả mong đợi | Kết quả thực tế | Trạng thái |
|---|---|---|---|---|---|:---:|
| 1 | **Startup** | First run | Mở app lần đầu khi chưa có dữ liệu trong AsyncStorage | App sử dụng dữ liệu mặc định an toàn, không bị crash | App khởi động mượt, tải dữ liệu mặc định thành công | **PASS** |
| 2 | **Profile** | Read | Mở màn hình ProfileScreen | Hiển thị đầy đủ thông tin: Avatar, Tên, MSSV, Email, Bio | Thông tin hiển thị chính xác | **PASS** |
| 3 | **Edit Profile** | Invalid name | Vào Edit Profile, xóa trắng ô Họ và tên -> Bấm Save Changes | Báo lỗi màu đỏ dưới ô nhập, không ghi vào Storage | Hiện dòng chữ đỏ yêu cầu tối thiểu 2 ký tự, không lưu | **PASS** |
| 4 | **Edit Profile** | Invalid email | Nhập email thiếu định dạng (ví dụ: `abcxyz`) -> Bấm Save Changes | Báo lỗi email không hợp lệ, không ghi dữ liệu | Báo lỗi màu đỏ, dữ liệu cũ giữ nguyên | **PASS** |
| 5 | **Edit Profile** | Valid update | Nhập họ tên và bio mới hợp lệ -> Bấm Save Changes | Cập nhật Profile, hiện thông báo thành công và quay lại màn hình trước | Profile ở Home và ProfileScreen cập nhật ngay lập tức | **PASS** |
| 6 | **Edit Profile** | Cancel action | Nhập thay đổi thông tin nhưng nhấn nút Cancel | Hủy bỏ thay đổi, quay lại màn hình trước, không lưu dữ liệu | Thông tin cũ giữ nguyên hoàn toàn | **PASS** |
| 7 | **Theme** | Toggle Light/Dark | Vào Settings -> Bật/tắt công tắc Dark Mode | Toàn bộ các màn hình và thanh header đổi sang màu tương ứng | Giao diện toàn app đổi màu đồng bộ tức thì | **PASS** |
| 8 | **Theme** | Persistence | Bật Dark mode -> Tắt hoàn toàn ứng dụng và mở lại (restart) | Ứng dụng vẫn duy trì đúng Dark mode đã chọn trước đó | Mở lại app vẫn giữ Dark mode | **PASS** |
| 9 | **List** | Normal render | Mở màn hình ActivityScreen khi có sẵn các mục | FlatList hiển thị danh sách các mục kèm thể loại rõ ràng | Danh sách render đúng dạng card kèm thông tin | **PASS** |
| 10 | **List** | Empty state | Chuyển sang tab bộ lọc Favorites khi chưa có mục nào | Hiển thị tiêu đề No Items Found và thông báo hướng dẫn | Giao diện Empty state hiển thị rõ ràng, không bị lỗi | **PASS** |
| 11 | **List** | Interaction | Nhấn nút Favorite hoặc xóa một hoạt động trong danh sách | State cập nhật ngay lập tức: nút đổi trạng thái hoặc item bị xóa khỏi list | Nút đổi giữa Favorite/Favorited mượt mà, xóa item chính xác | **PASS** |
| 12 | **Storage** | Corrupt / Missing | Giả lập chuỗi JSON trong AsyncStorage bị lỗi hoặc key null | App không crash, tự động fallback về dữ liệu mẫu mặc định | App chạy bình thường với fallback an toàn | **PASS** |
| 13 | **Navigation** | All screens | Điều hướng qua lại giữa cả 5 màn hình và sử dụng nút Back | Chuyển màn hình mượt mà, không mất trạng thái ngoài mong muốn | Native Stack hoạt động trơn tru | **PASS** |

---

## 2. NHẬT KÝ SỬA LỖI THỰC TẾ (DEBUG LOGS - 2 LỖI THEO RUBRIC)

### Debug Log 01: Lỗi chớp giao diện sáng/tối khi khởi động lại ứng dụng
- **Triệu chứng (Symptom):** Người dùng đã chọn giao diện nền tối (Dark mode) và tắt app. Khi mở lại app, màn hình bị chớp màu sáng khoảng 0.5s trước khi chuyển sang màu tối.
- **Giả thuyết (Hypothesis):** Quá trình đọc dữ liệu từ `AsyncStorage` là bất đồng bộ (async), trong khi State khởi tạo ban đầu của component lại mặc định là `'light'`.
- **Cách kiểm tra (Inspection):** Đặt `console.log` tại hàm `hydrateData` trong `AppContext.js` và tại hàm render của `AppNavigator.js`. Nhận thấy `AppNavigator` render lần 1 trước khi `loadData` trả về kết quả.
- **Nguyên nhân gốc rễ (Root Cause):** Chưa có cơ chế đợi quá trình nạp dữ liệu (Hydration) hoàn tất trước khi render giao diện chính.
- **Giải pháp khắc phục (Fix):** Bổ sung state `isLoading` vào `AppContext`. Trong thời gian nạp dữ liệu từ AsyncStorage, `AppNavigator` sẽ hiển thị component chờ `ActivityIndicator`. Khi nạp xong thì mới render các màn hình chính.
- **Kiểm thử lại (Retest):** Tắt app và mở lại nhiều lần -> App hiển thị đúng Dark mode ngay từ đầu, hiện tượng chớp sáng biến mất hoàn toàn.

---

### Debug Log 02: FlatList không cập nhật giao diện khi đổi trạng thái Favorite
- **Triệu chứng (Symptom):** Khi nhấn vào nút Favorite ở một dòng hoạt động, trạng thái yêu thích bên trong mảng có thay đổi nhưng giao diện trên màn hình không đổi màu ngay.
- **Giả thuyết (Hypothesis):** Mảng dữ liệu `activities` bị sửa trực tiếp (mutation) làm cho tham chiếu bộ nhớ của mảng không thay đổi, khiến React không nhận biết được sự thay đổi để re-render.
- **Cách kiểm tra (Inspection):** Kiểm tra mã nguồn hàm `toggleFavoriteActivity` trong Context, phát hiện code ban đầu tìm phần tử và gán trực tiếp: `targetItem.isFavorite = !targetItem.isFavorite; setActivities(activities);`.
- **Nguyên nhân gốc rễ (Root Cause):** Vi phạm nguyên tắc bất biến (Immutability) trong React State. React chỉ so sánh tham chiếu nông (shallow comparison) của mảng state.
- **Giải pháp khắc phục (Fix):** Sử dụng hàm `.map()` để tạo ra một mảng hoàn toàn mới, đồng thời clone object bằng cú pháp spread operator `{ ...item, isFavorite: !item.isFavorite }`.
- **Kiểm thử lại (Retest):** Nhấn nút Favorite trên từng item -> Giao diện phản hồi ngay lập tức, chuyển đổi mượt mà giữa trạng thái `Favorite` và `Favorited`.
