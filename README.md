# Assignment 1 - MMA301

## 1. TỔNG QUAN DỰ ÁN (OVERVIEW & SCREEN MAP)

Ứng dụng được xây dựng bằng **React Native (Expo)** với mục tiêu quản lý hồ sơ sinh viên và các hoạt động/sở thích cá nhân. Ứng dụng đáp ứng đủ 5 màn hình theo quy định:
1. **HomeScreen (`src/screens/HomeScreen.js`):** Chào mừng, tóm tắt thông tin nhanh (Avatar chữ, Tên, MSSV, thống kê số hoạt động), kèm các nút điều hướng.
2. **ProfileScreen (`src/screens/ProfileScreen.js`):** Hiển thị chi tiết hồ sơ cá nhân và nút chuyển sang màn hình chỉnh sửa.
3. **EditProfileScreen (`src/screens/EditProfileScreen.js`):** Form chỉnh sửa với cơ chế kiểm soát (Controlled inputs), kiểm tra hợp lệ (Validation) nghiêm ngặt trước khi lưu, hỗ trợ Lưu (Save Changes) và Hủy (Cancel).
4. **ActivityScreen (`src/screens/ActivityScreen.js`):** Hiển thị danh sách hoạt động bằng `FlatList`, hỗ trợ đánh dấu Yêu thích (Favorite/Favorited - thay đổi state), bộ lọc theo yêu thích, thêm mới và xóa item, cùng giao diện khi danh sách trống (Empty state: No Items Found).
5. **SettingsScreen (`src/screens/SettingsScreen.js`):** Đổi giao diện Sáng / Tối (Light/Dark Mode) có hiệu lực toàn ứng dụng, lưu bền vững bằng `AsyncStorage`, và nút Khôi phục mặc định (Reset All Data to Default).

### Tài liệu bàn giao kèm theo:
- **[RTM_DDR.md](file:///d:/MMA301/asg1/DoNguyenHao_SE1909/RTM_DDR.md):** Ma trận truy vết yêu cầu (R01 - R10) & 5 Quyết định thiết kế kỹ thuật.
- **[TEST_MATRIX.md](file:///d:/MMA301/asg1/DoNguyenHao_SE1909/TEST_MATRIX.md):** Ma trận kiểm thử chi tiết và 2 Nhật ký sửa lỗi thực tế.
- **[AI_LOG.md](file:///d:/MMA301/asg1/DoNguyenHao_SE1909/AI_LOG.md):** Nhật ký sử dụng AI có kiểm soát theo chuẩn Engineering Practice.

### Hướng dẫn cài đặt và chạy ứng dụng:
```bash
# 1. Cài đặt các thư viện phụ thuộc
npm install

# 2. Khởi động ứng dụng Expo
npx expo start

# 3. Phím tắt chạy trên các nền tảng:
# - Quét mã QR trên màn hình bằng ứng dụng Expo Go (Android / iOS)
# - Nhấn 'w' để mở trên trình duyệt Web
# - Nhấn 'a' để mở trên máy ảo Android Emulator
```

---

## 2. CẤU TRÚC THƯ MỤC DỰ ÁN (PROJECT STRUCTURE)

```text
DoNguyenHao_SE1909/
├── App.js                         # Root Component, bọc SafeArea & Context Provider
├── app.json                       # Cấu hình Expo
├── package.json                   # Dependencies của dự án
├── src/
│   ├── components/                # Reusable Components (Tái sử dụng)
│   │   ├── CustomButton.js        # Nút bấm chung với các biến thể (primary, secondary, danger)
│   │   └── ProfileCard.js         # Thẻ hiển thị avatar và thông tin cá nhân (dùng ở Home & Profile)
│   ├── context/
│   │   └── AppContext.js          # Quản lý State toàn cục (Profile, Theme, Activities) & Hydration
│   ├── navigation/
│   │   └── AppNavigator.js        # Cấu hình Native Stack Navigation cho 5 màn hình
│   ├── screens/                   # 5 Màn hình chính
│   │   ├── HomeScreen.js
│   │   ├── ProfileScreen.js
│   │   ├── EditProfileScreen.js
│   │   ├── ActivityScreen.js
│   │   └── SettingsScreen.js
│   └── utils/
│       └── storage.js             # Helper đọc/ghi AsyncStorage có try/catch và fallback an toàn
└── README.md                      # Tài liệu báo cáo & vấn đáp
```

---

## 3. THIẾT KẾ GIẢI PHÁP (SOLUTION DESIGN & REASONING)

### 3.1 State Ownership Map

| State | Vị trí | Lý do thiết kế |
| :--- | :--- | :--- |
| **Local Form inputs** (`name`, `bio`, `studentId`, `email`) | Local State (`EditProfileScreen`) | Chỉ phục vụ quá trình nhập liệu; khi Cancel không ảnh hưởng đến Profile chính |
| **Shared Profile** | `AppContext` + `AsyncStorage` | Nhiều màn hình cùng đọc (`Home`, `Profile`); cập nhật tức thì khi lưu |
| **Theme Mode** (`light` / `dark`) | `AppContext` + `AsyncStorage` | Áp dụng toàn ứng dụng (`app-wide`), giữ nguyên khi khởi động lại app |
| **Activities collection** | `AppContext` + `AsyncStorage` | Dùng chung để hiển thị danh sách và đồng bộ thống kê ở `HomeScreen` |
| **Hydration flag** (`isLoading`) | `AppContext` | Giúp ứng dụng nạp xong dữ liệu từ storage trước khi vẽ UI, tránh giật/nháy giao diện |

### 3.2 Design Decision Record – Tối thiểu 5 quyết định

| Quyết định | Lựa chọn của tôi | Lý do | Impact nếu đổi requirement |
| :--- | :--- | :--- | :--- |
| **Navigation** | `@react-navigation/native-stack` (Native Stack) | Hiệu năng mượt mà chuẩn native trên cả iOS và Android; luồng chuyển đổi giữa 5 màn hình phân cấp rõ ràng, dễ bảo trì. | Nếu đổi sang Tab Navigator hoặc Drawer, chỉ cần sửa cấu hình ở `AppNavigator.js`; logic bên trong 5 màn hình giữ nguyên không bị ảnh hưởng. |
| **State ownership** | `useState` cục bộ kết hợp `Context API` (`AppContext`) | Tránh over-engineering với Redux khi phạm vi app vừa phải; giải quyết triệt để prop drilling; cô lập state form ở màn hình Edit để tránh re-render thừa. | Nếu yêu cầu scale app lớn hơn, dễ dàng refactor Context sang Redux Toolkit/Zustand do toàn bộ state đã được gom tập trung tại `src/context/`. |
| **Persistence / hydration** | `AsyncStorage` với helper `storage.js` + cờ `isLoading` trong Context | Dữ liệu lưu bền vững dạng key-value; helper có `try/catch` và fallback an toàn tránh crash khi JSON hỏng; cờ `isLoading` ngăn lỗi chớp màn hình trước khi nạp xong theme. | Nếu đổi sang dùng SQLite, WatermelonDB hoặc Mock API/Firebase, chỉ cần thay đổi bên trong file `src/utils/storage.js`, interface gọi hàm `saveData`/`loadData` ở UI giữ nguyên. |
| **List item structure** | `FlatList` với `keyExtractor={(item) => item.id}`, `renderItem` và `ListEmptyComponent` | Tối ưu bộ nhớ nhờ cơ chế virtualization (chỉ render item trên màn hình); `keyExtractor` giúp React nhận biết chính xác item thay đổi; có Empty State xử lý mảng rỗng theo rubric. | Nếu đổi requirement sang phân nhóm (SectionList), cấu trúc item giữ nguyên, chỉ cần định dạng dữ liệu mảng thành `{ title, data }` và thay tag `FlatList` bằng `SectionList`. |
| **Folder / component reuse** | Tách thư mục chuẩn: `components/`, `context/`, `navigation/`, `screens/`, `utils/` | Đảm bảo nguyên lý đơn trách nhiệm (Single Responsibility) và DRY; component `ProfileCard` và `CustomButton` được dùng lại ở nhiều màn hình. | Khi đổi style giao diện (màu sắc, border nút bấm, cách hiển thị avatar), chỉ cần sửa 1 file component duy nhất mà không phải đi sửa từng màn hình. |

---

## 4. MA TRẬN YÊU CẦU & KIỂM THỬ (TEST MATRIX)

| # | Trường hợp kiểm thử | Thao tác thực hiện | Kết quả mong đợi | Kết quả thực tế |
|---|---|---|---|---|
| 1 | **First Run / Khởi động lần đầu** | Mở app khi chưa có dữ liệu trong máy | Dùng dữ liệu mặc định an toàn, không crash | **PASS** |
| 2 | **Profile Read** | Vào màn hình Profile | Hiển thị đúng Avatar, Tên, MSSV, Email, Bio | **PASS** |
| 3 | **Validation: Để trống tên** | Vào Edit Profile, xóa trắng ô Tên -> Bấm Save Changes | Báo lỗi màu đỏ, KHÔNG ghi đè dữ liệu cũ | **PASS** |
| 4 | **Validation: Email sai định dạng** | Nhập email không có đuôi `@` -> Bấm Save Changes | Báo lỗi email không hợp lệ, chặn lưu | **PASS** |
| 5 | **Edit Profile: Lưu hợp lệ** | Sửa tên/bio hợp lệ -> Bấm Save Changes | Thông báo thành công, Profile cập nhật ngay | **PASS** |
| 6 | **Edit Profile: Hủy (Cancel)** | Sửa thông tin -> Bấm Cancel | Quay lại màn hình cũ, dữ liệu giữ nguyên | **PASS** |
| 7 | **Theme Toggle** | Vào Settings -> Bật Dark mode switch | Toàn bộ 5 màn hình đổi sang nền tối | **PASS** |
| 8 | **Theme Persistence** | Bật Dark mode -> Tắt và mở lại ứng dụng | Ứng dụng vẫn duy trì Dark mode | **PASS** |
| 9 | **FlatList Interaction** | Bấm nút Favorite ở mục hoạt động | Trạng thái chuyển đổi giữa Favorite và Favorited | **PASS** |
| 10 | **FlatList Empty State** | Bật lọc Favorites khi chưa có mục nào | Hiển thị No Items Found và thông báo danh sách trống | **PASS** |

---

## 5. NHẬT KÝ SỬA LỖI (DEBUG LOGS - TỐI THIỂU 2 LỖI THEO RUBRIC)

### Lỗi 1: Giao diện bị chớp màu sáng trước khi chuyển sang Dark mode khi mở lại app
- **Triệu chứng:** Người dùng đã lưu Dark mode, nhưng khi mở lại app thì màn hình sáng chớp lên 0.5s rồi mới sang tối.
- **Giả thuyết:** Dữ liệu từ `AsyncStorage` là bất đồng bộ (async), trong khi State mặc định ban đầu được set là `'light'`.
- **Cách kiểm tra:** Kiểm tra thời điểm render của `AppNavigator` và `useEffect` đọc storage.
- **Root cause:** Component render giao diện trước khi `loadData` từ `AsyncStorage` hoàn tất.
- **Cách khắc phục:** Thêm state `isLoading` vào `AppContext`. Trong thời gian nạp dữ liệu, `AppNavigator` hiển thị `ActivityIndicator`. Khi nạp xong mới render các màn hình.
- **Retest:** Tắt app, mở lại -> Giao diện lập tức hiển thị đúng Dark mode mượt mà, không bị chớp sáng.

### Lỗi 2: FlatList không re-render khi thay đổi thuộc tính `isFavorite`
- **Triệu chứng:** Nhấn nút Favorite nhưng trạng thái trên màn hình không cập nhật ngay.
- **Giả thuyết:** Mảng `activities` bị mutate trực tiếp (`item.isFavorite = !item.isFavorite`) nên React không phát hiện sự thay đổi tham chiếu để kích hoạt render lại.
- **Cách kiểm tra:** Kiểm tra hàm `toggleFavoriteActivity` trong Context.
- **Root cause:** Vi phạm nguyên tắc bất biến (Immutability) của React State.
- **Cách khắc phục:** Sử dụng phương thức `.map()` để trả về một mảng mới với object được clone bằng cú pháp spread `{ ...item, isFavorite: !item.isFavorite }`.
- **Retest:** Nhấn nút Favorite -> UI lập tức cập nhật trạng thái mượt mà.

---

## 6. SẴN SÀNG VẤN ĐÁP / PHỎNG VẤN (INTERVIEW CHEAT SHEET)

Khi giảng viên chỉ định mở file giải thích theo mô hình **Purpose - Input - Trigger - Transform - Output**:

1. **Hỏi về hàm `validateForm()` trong `EditProfileScreen.js`:**
   - **Purpose:** Kiểm tra dữ liệu người dùng nhập có hợp lệ trước khi lưu hay không.
   - **Input:** State `name`, `studentId`, `email`.
   - **Trigger:** Người dùng nhấn nút "Save Changes".
   - **Transform:** Dùng `.trim()`, `.length` và Regular Expression để kiểm tra từng điều kiện. Nếu lỗi thì gán vào object `newErrors`.
   - **Output:** Trả về `true` nếu hợp lệ, `false` nếu có lỗi và hiển thị thông báo đỏ trên giao diện.

2. **Hỏi về `keyExtractor` trong `FlatList` (`ActivityScreen.js`):**
   - **Trả lời:** `keyExtractor` nhận từng item và trả về chuỗi ID duy nhất (`(item) => item.id`). React Native dùng ID này để theo dõi, so sánh và tái sử dụng các node UI một cách hiệu quả, tránh render lại toàn bộ danh sách khi chỉ có 1 item thay đổi.

3. **Hỏi về cơ chế Hydration trong `AppContext.js`:**
   - **Trả lời:** Hydration là quá trình nạp lại dữ liệu đã lưu từ ổ đĩa (`AsyncStorage`) vào bộ nhớ RAM (`React State`) khi ứng dụng khởi chạy lần đầu thông qua `useEffect(..., [])`.

4. **Khi giảng viên yêu cầu Transfer Task (thay đổi nhỏ):**
   - *Ví dụ thêm trường Số điện thoại (Phone):*
     + Mở `DEFAULT_PROFILE` trong `AppContext.js` thêm `phone: '0901234567'`.
     + Mở `ProfileCard.js` thêm một dòng hiển thị số điện thoại.
     + Mở `EditProfileScreen.js` thêm state `phone`, ô `TextInput` và quy tắc validate (10 chữ số).

---

## 7. HẠN CHẾ & PHẠM VI DỰ ÁN (LIMITATIONS)

Theo đúng định hướng nền tảng của Assignment 1:
- **Dữ liệu cục bộ (Offline only):** Dữ liệu hiện được lưu trữ trên bộ nhớ máy thông qua `AsyncStorage`, chưa kết nối cơ sở dữ liệu đám mây (Firebase/Cloud Backend).
- **Phạm vi bảo mật:** Chưa áp dụng quy trình xác thực người dùng (Authentication) cấp độ sản xuất do nằm ngoài phạm vi yêu cầu (Section 1.4 của đề bài).
- **Tập trung vào nền tảng cốt lõi:** Ưu tiên luồng ứng dụng mượt mà, cấu trúc state chuẩn mực và xử lý lỗi chặt chẽ thay vì sử dụng nhiều thư viện animation phức tạp.

