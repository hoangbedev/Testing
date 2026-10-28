
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
    document.getElementById("dependents").value = user.dependents || "0";
    document.getElementById("salary").value = user.salary || "";

    // Cập nhật vai trò trong tiêu đề
    document.getElementById("user-role").innerHTML = `${user.position} ${user.department}: <strong>${user.name}</strong>`;
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

function showEmployeeList() {
    toggleSection("employeeList");
    employeeList();

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

    const exemptionForSelf = 11000000; // Giảm trừ gia cảnh cho bản thân
    const exemptionPerDependent = 4400000; // Giảm trừ cho mỗi người phụ thuộc

    // Tính thu nhập chịu thuế
    const totalExemption = exemptionForSelf + (exemptionPerDependent * dependents);
    const taxableIncome = salary - totalExemption;

    if (taxableIncome <= 0) {
        alert("Thu nhập không đủ để tính thuế.");
        return;
    }

    // Khai báo các mức thuế lũy tiến
    let taxAmount = 0;

    if (taxableIncome <= 5000000) {
        taxAmount = taxableIncome * 0.05;
    } else if (taxableIncome <= 10000000) {
        taxAmount = taxableIncome * 0.1 - 250000;
    } else if (taxableIncome <= 18000000) {
        taxAmount = taxableIncome * 0.15 - 750000;
    } else if (taxableIncome <= 32000000) {
        taxAmount = taxableIncome * 0.2 - 1650000;
    } else if (taxableIncome <= 52000000) {
        taxAmount = taxableIncome * 0.25 - 3250000;
    } else if (taxableIncome <= 80000000) {
        taxAmount = taxableIncome * 0.3 - 5850000;
    } else {
        taxAmount = taxableIncome * 0.35 - 9850000;
    }

    // Hiển thị kết quả và thông tin chi tiết
    const resultTable = document.getElementById("testTaxTable");
    resultTable.innerHTML = `
    <tr>
        <th>Lương hàng tháng</th>
        <th>Số người phụ thuộc</th>
        <th>Thu nhập chịu thuế</th>
        <th>Thuế thu nhập cá nhân</th>
    </tr>
    <tr>
        <td>${salary.toFixed(2)} VND</td>
        <td>${dependents}</td>
        <td>${taxableIncome.toFixed(2)} VND</td>
        <td>${taxAmount.toFixed(2)} VND</td>
    </tr>
    <tr>
        <td colspan="4" style="text-align: left;">
            <strong>Giải thích:</strong><br>
            - Giảm trừ cho bản thân: ${exemptionForSelf.toLocaleString()} VND<br>
            - Giảm trừ cho người phụ thuộc: ${exemptionPerDependent.toLocaleString()} VND x ${dependents} người = ${(exemptionPerDependent * dependents).toLocaleString()} VND<br>
            - Tổng mức giảm trừ: ${totalExemption.toLocaleString()} VND<br>
            - Thu nhập chịu thuế: ${taxableIncome.toLocaleString()} VND<br>
            - Thuế được tính theo biểu thuế lũy tiến từng phần.
        </td>
    </tr>
    `;
}

// Tính thuế hàng tháng
function calculateMonthlyTax() {
    const salary = parseFloat(document.getElementById("salary").value);
    const dependentsInput = document.getElementById("dependents").value;
    const dependents = parseInt(dependentsInput) || 0; // Mặc định là 0 nếu không nhập hoặc nhập sai
    const name = document.getElementById("name").value;
    const position = document.getElementById("position").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;


    const exemptionForSelf = 11000000; // Giảm trừ gia cảnh cho bản thân
    const exemptionPerDependent = 4400000; // Giảm trừ cho mỗi người phụ thuộc

    // Tính thu nhập chịu thuế
    const totalExemption = exemptionForSelf + (exemptionPerDependent * dependents);
    const taxableIncome = salary - totalExemption;

    if (taxableIncome <= 0) {
        const taxMessage = document.getElementById("taxMessage");
        taxMessage.style.display = "block"; // Hiển thị thông báo
        taxMessage.innerText = "Thu nhập không đủ để tính thuế."; // Cập nhật nội dung thông báo
        return;
    }
    

    // Khai báo các mức thuế lũy tiến theo Cách 2
    let taxAmount = 0;

    if (taxableIncome <= 5000000) {
        taxAmount = taxableIncome * 0.05;
    } else if (taxableIncome <= 10000000) {
        taxAmount = taxableIncome * 0.1 - 250000;
    } else if (taxableIncome <= 18000000) {
        taxAmount = taxableIncome * 0.15 - 750000;
    } else if (taxableIncome <= 32000000) {
        taxAmount = taxableIncome * 0.2 - 1650000;
    } else if (taxableIncome <= 52000000) {
        taxAmount = taxableIncome * 0.25 - 3250000;
    } else if (taxableIncome <= 80000000) {
        taxAmount = taxableIncome * 0.3 - 5850000;
    } else {
        taxAmount = taxableIncome * 0.35 - 9850000;
    }

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
// Tính thuế hàng năm
function calculateAnnualTax() {
    const salary = parseFloat(document.getElementById("salary").value);
    const dependentsInput = parseInt(document.getElementById("dependents").value);
    const dependents = parseInt(dependentsInput) || 0; // Mặc định là 0 nếu không nhập hoặc nhập sai
    const name = document.getElementById("name").value;
    const position = document.getElementById("position").value;
    const email = document.getElementById("email").value;

    const exemptionForSelf = 11000000; // Giảm trừ gia cảnh cho bản thân
    const exemptionPerDependent = 4400000; // Giảm trừ cho mỗi người phụ thuộc

    let totalAnnualTax = 0;
    let monthlyTaxDetails = '';

    for (let month = 1; month <= 12; month++) {
        const totalExemption = exemptionForSelf + (exemptionPerDependent * dependents);
        const taxableIncome = salary - totalExemption;

        let monthlyTax = 0;
        if (taxableIncome <= 0) {
            monthlyTax = 0;
        } else {
            if (taxableIncome <= 5000000) {
                monthlyTax = taxableIncome * 0.05;
            } else if (taxableIncome <= 10000000) {
                monthlyTax = taxableIncome * 0.1 - 250000;
            } else if (taxableIncome <= 18000000) {
                monthlyTax = taxableIncome * 0.15 - 750000;
            } else if (taxableIncome <= 32000000) {
                monthlyTax = taxableIncome * 0.2 - 1650000;
            } else if (taxableIncome <= 52000000) {
                monthlyTax = taxableIncome * 0.25 - 3250000;
            } else if (taxableIncome <= 80000000) {
                monthlyTax = taxableIncome * 0.3 - 5850000;
            } else {
                monthlyTax = taxableIncome * 0.35 - 9850000;
            }
        }


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
}
// Xuất dữ liệu thuế hàng năm ra file Excel
function exportToExcel() {
    const table = document.getElementById("annual-tax-table");
    const wb = XLSX.utils.table_to_book(table, { sheet: "Sheet 1" });  // Chuyển bảng HTML thành workbook Excel

    let namefile = document.getElementById("name").value;
    // Tạo link tải xuống file Excel

    XLSX.writeFile(wb, `${namefile}_Thuế.xlsx`);  // Tải file Excel
}
// Xuất dữ liệu thuế hàng tháng ra file Excel
function employeeList() {
    const url = '../excel_data/data_tt.xlsx';  // Đường dẫn đến tệp Excel chứa dữ liệu nhân viên

    // Đọc tệp Excel và xử lý dữ liệu
    fetch(url)
        .then(response => response.arrayBuffer())  // Lấy dữ liệu tệp Excel dưới dạng binary array
        .then(data => {
            const workbook = XLSX.read(data, { type: 'array' });  // Đọc dữ liệu tệp Excel
            const sheet = workbook.Sheets[workbook.SheetNames[0]];  // Lấy bảng đầu tiên trong tệp
            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // Chuyển đổi bảng Excel thành mảng dữ liệu 2D

            let monthlyTaxDetails = '';  // Biến để lưu chi tiết thuế của các nhân viên
            const user = JSON.parse(sessionStorage.getItem("loggedInUser"));
            // Duyệt qua từng nhân viên và tính thuế
            for (let i = 1; i < jsonData.length; i++) {  // Bắt đầu từ hàng thứ 2 (hàng đầu là tiêu đề)
                const row = jsonData[i];  // Mỗi dòng dữ liệu của nhân viên
                const name = row[1];  // Cột B là tên nhân viên
                const position = row[2];  // Cột C là chức vụ
                const email = row[5];  // Cột F là email
                const phone = row[4];  // Cột E là số điện thoại
                const salary = row[3];  // Cột D là lương hàng tháng
                const dependents = row[6];  // Cột G là số người phụ thuộc
                const role = row[9];  // Cột J là phong ban

                // Tính thuế thu nhập cá nhân (theo biểu thuế lũy tiến)
                const exemptionForSelf = 11000000; // Giảm trừ gia cảnh cho bản thân (11 triệu đồng)
                const exemptionPerDependent = 4400000; // Giảm trừ cho mỗi người phụ thuộc (4 triệu đồng)

                // Tính tổng giảm trừ và thu nhập tính thuế
                const totalExemption = exemptionForSelf + (exemptionPerDependent * dependents);
                const taxableIncome = salary - totalExemption;

                let tax = 0;  // Biến lưu thuế phải nộp
                if (taxableIncome <= 0) {
                    tax = 0;  // Không phải nộp thuế nếu thu nhập âm hoặc bằng 0
                } else {

                    // Áp dụng biểu thuế lũy tiến để tính thuế
                    if (taxableIncome <= 5000000) {
                        tax = taxableIncome * 0.05;  // Thuế suất 5% nếu thu nhập dưới 5 triệu
                    } else if (taxableIncome <= 10000000) {
                        tax = taxableIncome * 0.1 - 250000;  // Thuế suất 10% nếu thu nhập từ 5 triệu đến 10 triệu
                    } else if (taxableIncome <= 18000000) {
                        tax = taxableIncome * 0.15 - 750000;  // Thuế suất 15% nếu thu nhập từ 10 triệu đến 18 triệu
                    } else if (taxableIncome <= 32000000) {
                        tax = taxableIncome * 0.2 - 1650000;  // Thuế suất 20% nếu thu nhập từ 18 triệu đến 32 triệu
                    } else if (taxableIncome <= 52000000) {
                        tax = taxableIncome * 0.25 - 3250000;  // Thuế suất 25% nếu thu nhập từ 32 triệu đến 52 triệu
                    } else if (taxableIncome <= 80000000) {
                        tax = taxableIncome * 0.3 - 5850000;  // Thuế suất 30% nếu thu nhập từ 52 triệu đến 80 triệu
                    } else {
                        tax = taxableIncome * 0.35 - 9850000;  // Thuế suất 35% nếu thu nhập trên 80 triệu
                    }
                }
                if(role == user.department){
                    monthlyTaxDetails += `
                <tr>
                    <td>${name}</td>
                    <td>${position}</td>
                    <td>${email}</td>
                    <td>${phone}</td>
                    <td>${salary}</td>
                    <td>${dependents}</td>
                    <td>${tax.toFixed(2)}</td>  
            `;
                }
                // Thêm thông tin nhân viên và thuế tính được vào bảng chi tiết
            }

            // Hiển thị kết quả lên giao diện web trong một bảng HTML
            const resultTable = document.getElementById("employee-list-table");  // Lấy phần tử bảng trong HTML
            resultTable.innerHTML = ` 
            <table class="output-table1">
                <tr>
                    <th>Họ và tên</th>
                    <th>Chức vụ</th>
                    <th>Email</th>
                    <th>Số điện thoại</th>
                    <th>Lương hàng tháng</th>
                    <th>NPT</th>
                    <th>Thuế TNCN</th>
                </tr>
                ${monthlyTaxDetails}  
            </table>
        `;
        })
        .catch(error => {
            console.error('Error loading Excel file:', error);  // Xử lý lỗi nếu có khi đọc tệp Excel
        });
}// Xuất dữ liệu thuế hàng tháng ra file Excel
function exportToExcel2() {
    const table = document.getElementById("employee-list-table");  // Lấy bảng dữ liệu thuế
    const wb = XLSX.utils.table_to_book(table, { sheet: "Sheet 1" });  // Chuyển bảng HTML thành workbook Excel

    // Tạo link tải xuống file Excel
    XLSX.writeFile(wb, "DS_Cty.xlsx");  // Tải file Excel 
}
