# REQUIREMENT TRACEABILITY MATRIX & DESIGN DECISION RECORD

## 1. REQUIREMENT TRACEABILITY MATRIX (RTM)

| ID | Yêu cầu | Bằng chứng Code / UI | Test Case kiểm thử | Kết quả |
| :--- | :--- | :--- | :--- | :--- |
| **R01** | Expo / React Native project chạy đúng quy ước | `package.json`, `app.json`, `App.js` | Cold start: chạy `npx expo start` và `npx expo-doctor` | PASS (21/21 checks) |
| **R02** | Navigation giữa ≥5 khu vực / screen | `src/navigation/AppNavigator.js` | Mở lần lượt từng screen và back về Home | PASS |
| **R03** | Profile hiển thị dữ liệu đã lưu / mặc định | `src/screens/ProfileScreen.js`, `src/components/ProfileCard.js` | Mở Profile xem Avatar, Name, MSSV, Email, Bio | PASS |
| **R04** | Edit Profile + validation form có kiểm soát | `src/screens/EditProfileScreen.js` | Test case: name rỗng, email sai định dạng, cancel không lưu | PASS |
| **R05** | Theme / preference shared bằng Context | `src/context/AppContext.js` (`useApp`) | Đổi theme ở Settings -> Home, Profile, Activity đổi màu ngay | PASS |
| **R06** | FlatList cho dữ liệu collection | `src/screens/ActivityScreen.js` | Render danh sách có item và empty state khi không có item | PASS |
| **R07** | Persistence bằng AsyncStorage | `src/utils/storage.js`, `src/context/AppContext.js` | Lưu profile/theme -> tắt app bật lại (restart) vẫn giữ nguyên | PASS |
| **R08** | Reusable components | `src/components/CustomButton.js`, `src/components/ProfileCard.js` | Tái sử dụng ở nhiều màn hình | PASS |
| **R09** | Responsive Flexbox / style cơ bản | Các file màn hình trong `src/screens/` | Hiển thị cân đối trên các kích thước màn hình dọc (portrait) | PASS |
| **R10** | Error / Fallback state | `src/utils/storage.js`, `src/screens/ActivityScreen.js` | Xử lý khi storage rỗng/corrupt và khi list không có item | PASS |

---

## 2. DESIGN DECISION RECORD (DDR)

Ghi nhận 5 quyết định kỹ thuật cốt lõi trong quá trình phát triển hệ thống:

### Quyết định 1: Cấu trúc điều hướng (Navigation Architecture)
- **Lựa chọn:** Sử dụng `@react-navigation/native-stack` (Native Stack Navigator).
- **Lý do:** Mang lại hiệu năng native mượt mà trên cả iOS và Android; dễ dàng truyền tham số và quản lý stack màn hình theo đúng quy ước bài tập.
- **Impact nếu đổi yêu cầu:** Nếu yêu cầu chuyển sang Tab Navigator hoặc Drawer Navigator, chỉ cần chỉnh sửa file cấu hình `src/navigation/AppNavigator.js`; toàn bộ mã nguồn bên trong các màn hình giữ nguyên.

### Quyết định 2: Quản lý trạng thái (State Ownership & Architecture)
- **Lựa chọn:** Kết hợp `useState` cho Form cục bộ (EditProfile) và `Context API` (`AppContext`) cho dữ liệu dùng chung (Profile, Theme, Activities).
- **Lý do:** Không gây over-engineering với các thư viện như Redux/Zustand khi ứng dụng ở quy mô vừa phải; giải quyết triệt để vấn đề prop drilling; form state được cô lập để tránh re-render không cần thiết ra ngoài.
- **Impact nếu đổi yêu cầu:** Nếu ứng dụng mở rộng có hàng chục tính năng phức tạp, cấu trúc này dễ dàng chuyển đổi sang Redux Toolkit/Zustand vì dữ liệu đã được trừu tượng hóa tập trung tại `src/context/`.

### Quyết định 3: Lưu trữ bền vững và Hydration (Persistence Strategy)
- **Lựa chọn:** Dùng `AsyncStorage` thông qua module helper `storage.js` có xử lý ngoại lệ `try/catch`, kết hợp cờ `isLoading` trong Context.
- **Lý do:** Dữ liệu được lưu dạng key-value bất đồng bộ trên thiết bị; cờ `isLoading` giúp app đợi đọc xong dữ liệu trước khi render UI, tránh lỗi nháy/giật theme sáng-tối; fallback an toàn ngăn app bị crash nếu file lưu bị hỏng JSON.
- **Impact nếu đổi yêu cầu:** Nếu đổi sang SQLite, WatermelonDB hoặc gọi Cloud API/Firebase, chỉ cần thay đổi phần thân hàm trong `src/utils/storage.js`, interface gọi `saveData`/`loadData` ở UI giữ nguyên.

### Quyết định 4: Hiển thị danh sách hoạt động (List Structure & Optimization)
- **Lựa chọn:** Dùng `FlatList` với thuộc tính `keyExtractor={(item) => item.id}`, `renderItem` nhận props, và `ListEmptyComponent` xử lý trạng thái rỗng.
- **Lý do:** `FlatList` tối ưu bộ nhớ thông qua cơ chế virtualization (chỉ render các item đang hiển thị trên màn hình); `keyExtractor` giúp React nhận biết chính xác item nào thay đổi để cập nhật thay vì render lại cả danh sách.
- **Impact nếu đổi yêu cầu:** Nếu chuyển sang phân nhóm (SectionList) theo thể loại, cấu trúc item component giữ nguyên, chỉ cần định dạng lại mảng dữ liệu thành `{ title, data }` và thay thế tag `FlatList` bằng `SectionList`.

### Quyết định 5: Tái sử dụng Component & Phân chia thư mục (Component Reusability)
- **Lựa chọn:** Tách riêng thư mục `src/components/` chứa `CustomButton` và `ProfileCard`, cùng các thư mục `screens/`, `context/`, `utils/`, `navigation/`.
- **Lý do:** Tuân thủ nguyên lý đơn trách nhiệm (Single Responsibility) và nguyên tắc DRY (Don't Repeat Yourself); thẻ `ProfileCard` được dùng lại ở cả Home và ProfileScreen.
- **Impact nếu đổi yêu cầu:** Khi cần thay đổi kiểu dáng hiển thị avatar, thông tin sinh viên hay màu sắc nút bấm, chỉ cần sửa tại 1 file component duy nhất mà không phải đi sửa từng màn hình.
