function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // URL trỏ đến file Excel trên server
  const url = '../excel_data/data_tt.xlsx';

  fetch(url)
    .then(response => response.arrayBuffer())
    .then(data => {
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // Sử dụng mảng 2D

      let found = false;
      for (let i = 1; i < jsonData.length; i++) {  // Bắt đầu từ dòng thứ 2
        const row = jsonData[i];
        const rowUsername = row[0];  // Cột A là username
        const rowPassword = row[7];  // Cột H là password
        const rowPosition = row[2];  // Cột C là chức vụ

        // So sánh username và password
        if (String(rowUsername) === String(username) && String(rowPassword) === String(password)) {
          found = true;

          // Lưu dữ liệu người dùng vào sessionStorage
          sessionStorage.setItem("loggedInUser", JSON.stringify({
            username: rowUsername,
            position: rowPosition,
            email: row[5], // Email cột F
            phone: row[4], // Số điện thoại cột E
            dependents: row[6], // Người phụ thuộc cột G
            name: row[1], // Tên cột B
            salary: row[3], // Lương cố định cột D
            department: row[9]// cột J là phòng ban
          }));

          // Chuyển hướng dựa vào chức vụ
          if (rowPosition === "Nhân viên") {
            window.location.href = "html/nhanvien.html";
          } else if (rowPosition === "Kế toán") {
            window.location.href = "html/ketoan.html";
          } else if (rowPosition === "Trưởng phòng") {
            window.location.href = "html/truongphong.html";
          }
          break;
        }
      }

      if (!found) {
        alert("Tài khoản hoặc mật khẩu không chính xác.");
      }
    })
    .catch(error => console.error('Lỗi khi xử lý file Excel:', error));
}
