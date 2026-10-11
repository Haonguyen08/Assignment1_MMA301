# NHẬT KÝ SỬ DỤNG AI (AI USAGE LOG)

MMA301 - Multiplatform Mobile App Development  
Assignment 01 - Personal Profile & Activity App  
Đỗ Nguyên Hạo - SE1909  
Mục tiêu tài liệu: Ghi nhận minh bạch quá trình sử dụng trợ lý AI, làm rõ các thông tin cốt lõi của bài tập và cách sinh viên kiểm chứng, làm chủ mã nguồn theo tiêu chuẩn đánh giá của môn học.

---

## 1. TỔNG HỢP THÔNG TIN CỐT LÕI CỦA BÀI TẬP (EXTRACTED ASSIGNMENT SCOPE)

- **Bối cảnh ứng dụng:** Ứng dụng quản lý hồ sơ và hoạt động cá nhân (Personal Profile & Activity App).
- **Phạm vi 5 màn hình bắt buộc:**
  1. `HomeScreen`: Chào mừng, hiển thị tóm tắt hồ sơ (ProfileCard) và thống kê hoạt động, điều hướng nhanh.
  2. `ProfileScreen`: Xem chi tiết thông tin cá nhân (Avatar chữ, Tên, MSSV, Email, Bio), có nút chuyển sang Edit.
  3. `EditProfileScreen`: Form có kiểm soát (Controlled inputs), kiểm tra dữ liệu đầu vào (Validation) trước khi lưu, hỗ trợ Save và Cancel.
  4. `ActivityScreen`: Danh sách hoạt động bằng `FlatList`, có tương tác thay đổi state (Favorite/Favorited, thêm mới, xóa), có giao diện khi danh sách trống (Empty State).
  5. `SettingsScreen`: Chuyển đổi giao diện Sáng / Tối (Light/Dark Mode) có hiệu lực toàn ứng dụng, lưu bền vững bằng `AsyncStorage`, có nút Khôi phục mặc định (Reset).
