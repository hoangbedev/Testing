// Hiển thị dữ liệu người dùng khi tải trang
window.onload = function () {
    const user = JSON.parse(sessionStorage.getItem("loggedInUser"));
    if (!user) {
        alert("Bạn chưa đăng nhập!");
        window.location.href = "../index.html";
        return;
    }

    // Hiển thị thông tin trong phần thông tin cá nhân
    document.getElementById("name").value = user.name || "";
    document.getElementById("position").value = user.position || "";
    document.getElementById("department").value = user.department || "";
    document.getElementById("email").value = user.email || "";
    document.getElementById("phone").value = user.phone || "";
    document.getElementById("dependents").value = user.dependents || "";
    document.getElementById("salary").value = user.salary || "";

    // Cập nhật vai trò trong tiêu đề
    document.getElementById("user-role").innerHTML = `${user.position}: <strong>${user.name}</strong>`;
};

// Chuyển đổi giữa các phần
function showPersonalInfo() {
    toggleSection("personalInfo");
}

function showTestThue() {
    toggleSection("taxCalculation");
}

function showSalary() {
    toggleSection("viewSalary");
}

function showMonthlyTax() {
    toggleSection("monthlyTax");
    calculateMonthlyTax();
}

function showAnnualTax() {
    toggleSection("annualTax");
    calculateAnnualTax();
}

function toggleSection(sectionId) {
    const sections = document.querySelectorAll(".section");
    sections.forEach(section => {
        section.style.display = section.id === sectionId ? "block" : "none";
    });
}

// Đăng xuất
function logout() {
    sessionStorage.clear();
    window.location.href = "../index.html";
}

function calculateTestTax() {
    const salary = parseFloat(document.getElementById("salary1").value);
    const dependents = parseInt(document.getElementById("dependent1").value);

    if (isNaN(salary) || isNaN(dependents)) {
        alert("Vui lòng nhập đầy đủ và chính xác thông tin!");
        return;
    }

    const taxRate = 0.1; // Ví dụ: Thuế suất là 10%
    const exemptionPerDependent = 4000000; // Giảm trừ cho mỗi người phụ thuộc (ví dụ 4 triệu đồng)

    const taxableIncome = salary - (exemptionPerDependent * dependents);
    const taxAmount = taxableIncome > 0 ? taxableIncome * taxRate : 0;

    // Hiển thị kết quả
    const resultTable = document.getElementById("testTaxTable");
    resultTable.innerHTML = `
    <tr>
        <th>Lương hàng tháng</th>
        <th>Số người phụ thuộc</th>
        <th>Thuế thu nhập cá nhân</th>
    </tr>
    <tr>
        <td>${salary.toFixed(2)} VND</td>
        <td>${dependents}</td>
        <td>${taxAmount.toFixed(2)} VND</td>
    </tr>
    `;
}

function calculateMonthlyTax() {
    const salary = parseFloat(document.getElementById("salary").value);
    const dependents = parseInt(document.getElementById("dependents").value);
    const name = document.getElementById("name").value;
    const position = document.getElementById("position").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;

    if (isNaN(salary) || isNaN(dependents)) {
        alert("Vui lòng nhập đầy đủ và chính xác thông tin!");
        return;
    }

    const taxRate = 0.1; // Thuế suất là 10%
    const exemptionPerDependent = 4000000; // Giảm trừ cho mỗi người phụ thuộc (ví dụ 4 triệu đồng)

    const taxableIncome = salary - (exemptionPerDependent * dependents);
    const taxAmount = taxableIncome > 0 ? taxableIncome * taxRate : 0;

    // Hiển thị kết quả
    const resultTable = document.getElementById("monthlyTax");
    resultTable.innerHTML = `
        <h3>Kết quả tính thuế hàng tháng</h3>
        <table class="output-table">
            <tr>
                <th>Họ và tên</th>
                <td>${name}</td>
            </tr>
            <tr>
                <th>Chức vụ</th>
                <td>${position}</td>
            </tr>
            <tr>
                <th>Email</th>
                <td>${email}</td>
            </tr>
            <tr>
                <th>Số điện thoại</th>
                <td>${phone}</td>
            </tr>
            <tr>
                <th>Lương hàng tháng</th>
                <td>${salary.toFixed(2)} VND</td>
            </tr>
            <tr>
                <th>Số người phụ thuộc</th>
                <td>${dependents}</td>
            </tr>
            <tr>
                <th>Tổng thu nhập chịu thuế</th>
                <td>${taxableIncome.toFixed(2)} VND</td>
            </tr>
            <tr>
                <th>Thuế thu nhập cá nhân</th>
                <td>${taxAmount.toFixed(2)} VND</td>
        </table>
    `;
}

function calculateAnnualTax() {
    const salary = parseFloat(document.getElementById("salary").value);
    const dependents = parseInt(document.getElementById("dependents").value);
    const name = document.getElementById("name").value;
    const position = document.getElementById("position").value;
    const email = document.getElementById("email").value;

    // Kiểm tra nhập liệu cơ bản
    if (isNaN(salary) || isNaN(dependents)) {
        alert("Vui lòng nhập đầy đủ và chính xác thông tin!");
        return;
    }

    // Kiểm tra lương không hợp lệ
    if (salary <= 0) {
        alert("Lương phải lớn hơn 0!");
        return;
    }

    // Kiểm tra số người phụ thuộc không hợp lệ
    if (dependents < 0) {
        alert("Số người phụ thuộc không thể là số âm!");
        return;
    }

    if (dependents > 10) {
        alert("Số người phụ thuộc không thể lớn hơn 10!");
        return;
    }

    // Kiểm tra tên và email
    if (name.trim() === "") {
        alert("Vui lòng nhập tên đầy đủ!");
        return;
    }

    if (email.trim() === "" || !email.includes("@")) {
        alert("Vui lòng nhập địa chỉ email hợp lệ!");
        return;
    }

    const taxRate = 0.1; // Thuế suất là 10%
    const exemptionPerDependent = 4000000; // Giảm trừ cho mỗi người phụ thuộc (ví dụ 4 triệu đồng)

    let totalAnnualTax = 0;
    let monthlyTaxDetails = '';

    for (let month = 1; month <= 12; month++) {
        const taxableIncome = salary - (exemptionPerDependent * dependents);
        const monthlyTax = taxableIncome > 0 ? taxableIncome * taxRate : 0;

        // Cộng dồn thuế hàng tháng vào tổng thuế hàng năm
        totalAnnualTax += monthlyTax;

        // Hiển thị thông tin thuế của từng tháng
        monthlyTaxDetails += `
        <tr>
            <td>Tháng ${month}</td>
            <td>${salary.toFixed(2)} VND</td>
            <td>${dependents}</td>
            <td>${monthlyTax.toFixed(2)} VND</td>
        </tr>
        `;
    }

    // Cập nhật kết quả tính thuế
    document.getElementById("annual-name").innerText = name;
    document.getElementById("annual-position").innerText = position;
    document.getElementById("annual-email").innerText = email;

    const resultTable = document.getElementById("annual-tax-table");
    resultTable.innerHTML = `
        <tr>
            <th>Tháng</th>
            <th>Lương hàng tháng</th>
            <th>Số người phụ thuộc</th>
            <th>Thuế thu nhập cá nhân</th>
        </tr>
        ${monthlyTaxDetails}
        <tr>
            <td colspan="3"><strong>Tổng thuế trong năm</strong></td>
            <td><strong>${totalAnnualTax.toFixed(2)} VND</strong></td>
        </tr>
    `;

    // Hiển thị thông báo thành công
    alert(`Thuế hàng năm đã được tính toán thành công! Tổng thuế: ${totalAnnualTax.toFixed(2)} VND`);
}

function exportToExcel() {
    const table = document.getElementById("annual-tax-table");
    const rows = table.querySelectorAll("tr");

    const data = [];

    rows.forEach((row, rowIndex) => {
        const cells = row.querySelectorAll("td, th");
        const rowData = [];
        cells.forEach(cell => {
            rowData.push(cell.innerText);
        });
        data.push(rowData);
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(data);

    XLSX.utils.book_append_sheet(wb, ws, "Annual Tax Report");

    XLSX.writeFile(wb, "QuyetToanThue_1Nam.xlsx");
}
