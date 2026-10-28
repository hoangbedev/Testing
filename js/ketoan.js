
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

function showSetReduction() {
    toggleSection("setReduction");
}

function showMonthlyTax() {
    toggleSection("monthlyTax");
    calculateMonthlyTax();
}

function showAnnualTax() {
    toggleSection("annualTax");
    calculateAnnualTax();
}
function showEmployeeTax() {
    toggleSection("employeeTax");
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

//xem thuế nhân viên
function viewEmployeeTax() {
    const IDuser = parseInt(document.getElementById("searchEmployeeId").value); // Lấy ID nhân viên từ input
    const url = '../excel_data/data_tt.xlsx';
    fetch(url)
        .then(response => response.arrayBuffer())  // Lấy dữ liệu tệp Excel dưới dạng binary array
        .then(data => {
            const workbook = XLSX.read(data, { type: 'array' });  // Đọc dữ liệu tệp Excel
            const sheet = workbook.Sheets[workbook.SheetNames[0]];  // Lấy bảng đầu tiên trong tệp
            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // Chuyển đổi bảng Excel thành mảng dữ liệu 2D

            // Biến lưu thông tin nhân viên và thuế
            let employee = null;
            let tax = 0;

            // Duyệt qua từng nhân viên và tính thuế
            for (let i = 1; i < jsonData.length; i++) {  // Bắt đầu từ hàng thứ 2 (hàng đầu là tiêu đề)
                const row = jsonData[i];  // Mỗi dòng dữ liệu của nhân viên
                const id = parseInt(row[0]);  // Cột A là ID nhân viên

                if (id === IDuser) {
                    // Lưu thông tin nhân viên khi tìm thấy ID
                    const name = row[1];  // Cột B là tên nhân viên
                    const position = row[2];  // Cột C là chức vụ
                    const email = row[5];  // Cột F là email
                    const phone = row[4];  // Cột E là số điện thoại
                    const salary = row[3];  // Cột D là lương hàng tháng
                    const dependents = row[6];  // Cột G là số người phụ thuộc

                    // Tính thuế thu nhập cá nhân (theo biểu thuế lũy tiến)
                    const exemptionForSelf = 11000000; // Giảm trừ gia cảnh cho bản thân (11 triệu đồng)
                    const exemptionPerDependent = 4400000; // Giảm trừ cho mỗi người phụ thuộc (4 triệu đồng)

                    // Tính tổng giảm trừ và thu nhập tính thuế
                    const totalExemption = exemptionForSelf + (exemptionPerDependent * dependents);
                    const taxableIncome = salary - totalExemption;

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

                    // Lưu thông tin nhân viên tìm thấy
                    employee = { name, position, salary, phone, email, dependents };
                    break;  // Dừng lại khi tìm thấy nhân viên
                }
            }

            if (employee) {
                // Hiển thị thông tin nhân viên và thuế lên giao diện
                document.getElementById("employeeTaxTable").innerHTML = `
                    <h3>Thông tin nhân viên</h3>
                    <table class="output-table">
                        <tr>
                            <th>ID</th>
                            <td>${IDuser}</td>
                        </tr>
                        <tr>
                            <th>Họ tên</th>
                            <td>${employee.name}</td>
                        </tr>
                        <tr>
                            <th>Chức vụ</th>
                            <td>${employee.position}</td>
                        </tr>
                        <tr>
                            <th>Lương</th>
                            <td>${employee.salary}</td>
                        </tr>
                        <tr>
                            <th>Số điện thoại</th>
                            <td>${employee.phone}</td>
                        </tr>
                        <tr>
                            <th>Email</th>
                            <td>${employee.email}</td>
                        </tr>
                        <tr>
                            <th>Người phụ thuộc</th>
                            <td>${employee.dependents}</td>
                        </tr>
                        <tr>
                            <th>Thuế thu nhập cá nhân</th>
                            <td>${tax.toFixed(2)} VND</td>
                        </tr>
                    </table>
                `;
            } else {
                alert('Không tìm thấy nhân viên với mã ID này!');
            }

        })
        .catch(error => {
            console.error('Error loading Excel file:', error);  // Xử lý lỗi nếu có khi đọc tệp Excel
        });
}

//tính thu thuế 1 tháng
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

    alert("Đang tính thuế...");

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

//tính thuế 1 năm
function calculateMonthlyTax() {
    const salary = parseFloat(document.getElementById("salary").value);
    const dependents = parseInt(document.getElementById("dependents").value);
    const name = document.getElementById("name").value;
    const position = document.getElementById("position").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;



    const exemptionForSelf = 11000000; // Giảm trừ gia cảnh cho bản thân
    const exemptionPerDependent = 4400000; // Giảm trừ cho mỗi người phụ thuộc

    // Tính tổng giảm trừ và thu nhập chịu thuế
    const totalExemption = exemptionForSelf + (exemptionPerDependent * dependents);
    const taxableIncome = salary - totalExemption;

    // Tính thuế thu nhập cá nhân theo biểu thuế lũy tiến
    let taxAmount = 0;
    if (taxableIncome > 0) {
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
    }

    // Cập nhật giao diện hiển thị kết quả
    const resultTable = document.getElementById("monthlyTax");
    resultTable.innerHTML = `
        <h3>Kết quả tính thuế 1 tháng</h3>
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
                <td>${salary.toLocaleString()} VND</td>
            </tr>
            <tr>
                <th>Số người phụ thuộc</th>
                <td>${dependents}</td>
            </tr>
            <tr>
                <th>Giảm trừ gia cảnh</th>
                <td>${exemptionForSelf.toLocaleString()} VND</td>
            </tr>
            <tr>
                <th>Giảm trừ người phụ thuộc</th>
                <td>${(exemptionPerDependent * dependents).toLocaleString()} VND</td>
            </tr>
            <tr>
                <th>Tổng mức giảm trừ</th>
                <td>${totalExemption.toLocaleString()} VND</td>
            </tr>
            <tr>
                <th>Thu nhập chịu thuế</th>
                <td>${taxableIncome > 0 ? taxableIncome.toLocaleString() : "0"} VND</td>
            </tr>
            <tr>
                <th>Thuế thu nhập cá nhân</th>
                <td>${taxAmount.toLocaleString()} VND</td>
            </tr>
        </table>
        <p><strong>Giải thích:</strong> Thuế thu nhập cá nhân được tính theo biểu thuế lũy tiến từng phần dựa trên thu nhập chịu thuế.</p>
    `;
}

//tính thuế 1 năm cho tất cả
function loadAnnualTax() {
    const selectedYear = document.getElementById("yearSelect").value; // Lấy năm từ dropdown
    const filePath = '../excel_data/data_tt.xlsx';

    fetch(filePath)
        .then(response => response.arrayBuffer()) // Đọc file Excel
        .then(data => {
            const workbook = XLSX.read(data, { type: 'array' }); // Đọc dữ liệu Excel
            const sheetName = workbook.SheetNames[0]; // Lấy sheet đầu tiên
            const worksheet = workbook.Sheets[sheetName]; // Lấy nội dung sheet

            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }); // Chuyển sheet thành mảng 2D
            const rows = jsonData.slice(1); // Dữ liệu các dòng

            // Lọc dữ liệu theo năm
            const filteredData = rows.filter(row => row[8] == selectedYear); // Cột "năm" ở index 8
            if (filteredData.length === 0) {
                alert(`Không có dữ liệu cho năm ${selectedYear}`);
                return;
            }

            // Tạo bảng hiển thị
            const table = document.getElementById("annual-tax-table");
            table.innerHTML = `
                <tr>
                    <th>ID</th>
                    <th>Họ tên</th>
                    <th>Chức vụ</th>
                    <th>Lương</th>
                    <th>Số người phụ thuộc</th>
                    <th>Thuế thu nhập cá nhân</th>
                </tr>
            `;

            filteredData.forEach(row => {
                const id = row[0];
                const name = row[1];
                const position = row[2];
                const salary = row[3]; // Lương
                const dependents = row[6];
                const tax = calculateAnnualTax(salary, dependents);

                table.innerHTML += `
                    <tr>
                        <td>${id}</td>
                        <td>${name}</td>
                        <td>${position}</td>
                        <td>${salary} VND</td>
                        <td>${dependents}</td>
                        <td>${tax} VND</td>
                    </tr>
                `;
            });
        })
        .catch(error => {
            console.error("Lỗi khi đọc file Excel:", error);
            alert("Không thể tải dữ liệu thuế.");
        });
}

//tính thuế
function calculateAnnualTax(salary, dependents) {
    const exemptionForSelf = 11000000; // Giảm trừ bản thân
    const exemptionPerDependent = 4400000; // Giảm trừ mỗi người phụ thuộc
    const totalExemption = exemptionForSelf + (exemptionPerDependent * dependents);

    const monthlyTaxableIncome = salary - totalExemption;
    const annualTaxableIncome = monthlyTaxableIncome * 12;

    let taxAmount = 0;

    if (annualTaxableIncome > 0) {
        if (annualTaxableIncome <= 60000000) {
            taxAmount = annualTaxableIncome * 0.05;
        } else if (annualTaxableIncome <= 120000000) {
            taxAmount = annualTaxableIncome * 0.1 - 3000000;
        } else if (annualTaxableIncome <= 216000000) {
            taxAmount = annualTaxableIncome * 0.15 - 7500000;
        } else if (annualTaxableIncome <= 384000000) {
            taxAmount = annualTaxableIncome * 0.2 - 16500000;
        } else if (annualTaxableIncome <= 624000000) {
            taxAmount = annualTaxableIncome * 0.25 - 32500000;
        } else if (annualTaxableIncome <= 960000000) {
            taxAmount = annualTaxableIncome * 0.3 - 58500000;
        } else {
            taxAmount = annualTaxableIncome * 0.35 - 98500000;
        }
    }

    return taxAmount;
}

//tải dữ liệu thuế theo năm
function populateYearSelect() {
    const filePath = '../excel_data/data_tt.xlsx';

    fetch(filePath)
        .then(response => response.arrayBuffer()) // Đọc file Excel
        .then(data => {
            const workbook = XLSX.read(data, { type: 'array' }); // Đọc dữ liệu Excel
            const sheetName = workbook.SheetNames[0]; // Lấy sheet đầu tiên
            const worksheet = workbook.Sheets[sheetName]; // Lấy nội dung sheet

            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }); // Chuyển sheet thành mảng 2D
            const years = jsonData.slice(1).map(row => row[8]); // Lấy dữ liệu cột năm (cột 8)

            // Lọc bỏ các giá trị không hợp lệ (ví dụ: năm 9999 hoặc trống)
            const validYears = [...new Set(years.filter(year => year && year !== 9999))];

            // Sort và tạo dropdown cho năm
            const yearSelect = document.getElementById("yearSelect");
            yearSelect.innerHTML = ""; // Xóa các tùy chọn cũ

            validYears.sort().reverse().forEach(year => {
                const option = document.createElement("option");
                option.value = year;
                option.textContent = year;
                yearSelect.appendChild(option);
            });

            if (validYears.length > 0) {
                loadAnnualTax(); // Tải dữ liệu của năm đầu tiên
            } else {
                alert("Không có dữ liệu năm hợp lệ!");
            }
        })
        .catch(error => {
            console.error("Lỗi khi đọc file Excel:", error);
            alert("Không thể tải danh sách năm.");
        });
}

//tải dữ liệu thuế theo năm
document.addEventListener("DOMContentLoaded", () => {
    populateYearSelect(); // Tạo danh sách năm
});

function exportToExcel() {
    const table = document.getElementById("annual-tax-table");
    const wb = XLSX.utils.table_to_book(table, { sheet: "Sheet 1" });  // Chuyển bảng HTML thành workbook Excel

    let namefile = document.getElementById("name").value;
    // Tạo link tải xuống file Excel

    XLSX.writeFile(wb, `${namefile}_Thuế.xlsx`);  // Tải file Excel
}

function loadEmployeeTaxes() {
    const filePath = '../excel_data/data_tt.xlsx';

    fetch(filePath)
        .then(response => response.arrayBuffer()) // Đọc file Excel
        .then(data => {
            const workbook = XLSX.read(data, { type: 'array' }); // Đọc dữ liệu Excel
            const sheetName = workbook.SheetNames[0]; // Lấy sheet đầu tiên
            const worksheet = workbook.Sheets[sheetName]; // Lấy nội dung sheet

            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }); // Chuyển sheet thành mảng 2D
            const header = jsonData[0]; // Tiêu đề
            const rows = jsonData.slice(1); // Dữ liệu các dòng

            // Tạo bảng hiển thị
            const tableBody = document.getElementById("employeeTaxTable");
            tableBody.innerHTML = ""; 
            // Xóa nội dung cũ

            rows.forEach(row => {
                const id = row[0];
                const name = row[1];
                const position = row[2];
                const salary = row[3];
                const dependents = row[6];

                const tax = calculateTax(salary, dependents); // Tính thuế cho nhân viên

                const rowHTML = `
                    <tr>
                        <td>${id}</td>
                        <td>${name}</td>
                        <td>${position}</td>
                        <td>${salary} VND</td> <!-- Hiển thị lương nguyên bản -->
                        <td>${dependents}</td>
                        <td>${tax} VND</td> <!-- Hiển thị thuế nguyên bản -->
                    </tr>
                `;
                tableBody.innerHTML += rowHTML; // Thêm dòng vào bảng
            });
        })
        .catch(error => {
            console.error("Lỗi khi tải dữ liệu Excel:", error);
            alert("Không thể tải dữ liệu từ file Excel.");
        });
}
// 
function calculateTax(salary, dependents) {
    const exemptionForSelf = 11000000; // Giảm trừ bản thân
    const exemptionPerDependent = 4400000; // Giảm trừ mỗi người phụ thuộc

    const totalExemption = exemptionForSelf + (exemptionPerDependent * dependents);
    const taxableIncome = salary - totalExemption;

    if (taxableIncome <= 0) {
        return 0; // Không phải thuế nếu thu nhập không đủ
    }

    let taxAmount = 0;

    // Tính thuế theo biểu thuế lũy tiến
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

    return taxAmount;
}

document.addEventListener("DOMContentLoaded", () => {
    loadEmployeeTaxes(); // Tải dữ liệu thuế khi vào giao diện
});

function showManageDepartments() {
    toggleSection("manageDepartments");
    loadDepartments();
}
//
function loadDepartments() {
    const url = '../excel_data/data_tt.xlsx';  // Đường dẫn đến tệp Excel chứa dữ liệu nhân viên

    // Đọc tệp Excel và xử lý dữ liệu
    fetch(url)
        .then(response => response.arrayBuffer())  // Lấy dữ liệu tệp Excel dưới dạng binary array
        .then(data => {
            const workbook = XLSX.read(data, { type: 'array' });  // Đọc dữ liệu tệp Excel
            const sheet = workbook.Sheets[workbook.SheetNames[0]];  // Lấy bảng đầu tiên trong tệp
            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // Chuyển đổi bảng Excel thành mảng dữ liệu 2D

            let monthlyTaxDetails = '';  // Biến để lưu chi tiết thuế của các nhân viên

            // Duyệt qua từng nhân viên và tính thuế
            for (let i = 1; i < jsonData.length; i++) {  // Bắt đầu từ hàng thứ 2 (hàng đầu là tiêu đề)
                const row = jsonData[i];  // Mỗi dòng dữ liệu của nhân viên
                const name = row[1];  // Cột B là tên nhân viên
                const position = row[2];  // Cột C là chức vụ
                const email = row[5];  // Cột F là email
                const phone = row[4];  // Cột E là số điện thoại
                // const salary = row[3];  // Cột D là lương hàng tháng
                // const dependents = row[6];  // Cột G là số người phụ thuộc
                // const year = row[8];  // Cột I là năm
                const role = row[9];  // Cột J là vai trò

                // Thêm thông tin nhân viên và thuế tính được vào bảng chi tiết
                if(position === "Trưởng phòng" || name === "Trần Văn An"){
                    monthlyTaxDetails += `
                <tr>
                    <td>Phòng ${role}</td>
                    <td>${name}</td>
                    <td>${email}</td>
                    <td>${phone}</td>
                    <td><button class="edit-btn" onclick="editDepartment(this)">Sửa</button></td>
                    <td><button class="delete-btn" onclick="deleteDepartment(this)">Xóa</button></td>
                        
                </tr>
            `;
                }
                
            }

            // Hiển thị kết quả lên giao diện web trong một bảng HTML
            const resultTable = document.getElementById("department-list-table");  // Lấy phần tử bảng trong HTML
            resultTable.innerHTML = ` 
            <table class="output-table1">
                <tr>
                    <th>Phòng ban</th>
                    <th>Trường Phòng</th>
                    <th>Email</th>
                    <th>Số điện thoại</th>
                    <th>Chỉnh sửa</th>
                    <th>Xóa</th>

                </tr>
                ${monthlyTaxDetails}  
            </table>
        `;
        })
        .catch(error => {
            console.error('Error loading Excel file:', error);  // Xử lý lỗi nếu có khi đọc tệp Excel
        });
}

// Xóa và chỉnh sửa phòng ban
function deleteDepartment(button) {
    const row = button.parentElement.parentElement;  // Lấy hàng chứa nút "Xóa"
    row.remove();  // Xóa hàng khỏi bảng
}
// Chỉnh sửa phòng ban
function editDepartment(button) {
    const row = button.parentElement.parentElement;  // Lấy hàng chứa nút "Sửa"
    
    // Lấy các giá trị từ dòng hiện tại
    const departmentName = row.cells[0].textContent;
    const departmentHead = row.cells[1].textContent;
    const departmentEmail = row.cells[2].textContent;
    const departmentPhone = row.cells[3].textContent;

    // Đưa các giá trị vào các trường input để chỉnh sửa
    document.getElementById("departmentName").value = departmentName;
    document.getElementById("departmentHead").value = departmentHead;
    document.getElementById("departmentEmail").value = departmentEmail;
    document.getElementById("departmentPhone").value = departmentPhone;

    // Cập nhật nút "Thêm" thành "Cập nhật" và gán hành động chỉnh sửa cho nó
    const addButton = document.getElementById("addDepartmentButton");
    addButton.textContent = "Cập nhật";
    addButton.setAttribute("onclick", `updateDepartment(this, ${row.rowIndex})`);  // Chuyển `row` vào hàm update
}
// Cập nhật phòng ban
function updateDepartment(button, rowIndex) {
    const departmentName = document.getElementById("departmentName").value.trim();
    const departmentHead = document.getElementById("departmentHead").value.trim();
    const departmentEmail = document.getElementById("departmentEmail").value.trim();
    const departmentPhone = document.getElementById("departmentPhone").value.trim();

    // Kiểm tra tính hợp lệ
    if (!departmentName || !departmentHead || !departmentEmail || !departmentPhone) {
        alert("Vui lòng nhập đầy đủ thông tin!");
        return;
    }

    // Lấy bảng và dòng cần cập nhật
    const resultTable = document.getElementById("department-list-table").querySelector("table tbody");
    const row = resultTable.rows[rowIndex];  // Dùng `rowIndex` để tìm dòng đúng

    // Cập nhật thông tin trong bảng
    row.cells[0].textContent = departmentName;
    row.cells[1].textContent = departmentHead;
    row.cells[2].textContent = departmentEmail;
    row.cells[3].textContent = departmentPhone;

    // Reset form và đổi nút lại thành "Thêm"
    document.getElementById("departmentName").value = "";
    document.getElementById("departmentHead").value = "";
    document.getElementById("departmentEmail").value = "";
    document.getElementById("departmentPhone").value = "";

    button.textContent = "Thêm phòng ban";
    button.setAttribute("onclick", "addDepartment()");  // Đổi lại hành động của nút
}
// Thêm phòng ban
function addDepartment() {
    // Lấy giá trị từ các trường input
    const departmentName = document.getElementById("departmentName").value.trim();
    const departmentHead = document.getElementById("departmentHead").value.trim();
    const departmentEmail = document.getElementById("departmentEmail").value.trim();
    const departmentPhone = document.getElementById("departmentPhone").value.trim();

    // Kiểm tra tính hợp lệ
    if (!departmentName || !departmentHead || !departmentEmail || !departmentPhone) {
        alert("Vui lòng nhập đầy đủ thông tin!");
        return;
    }

    // Lấy bảng hiện tại
    const resultTable = document.getElementById("department-list-table");
    const tableBody = resultTable.querySelector("table > tbody");

    // Nếu chưa có bảng hoặc `tbody`, tạo mới
    if (!tableBody) {
        resultTable.innerHTML = `
            <table class="output-table1">
                <thead>
                    <tr>
                        <th>Tên phòng ban</th>
                        <th>Chức vụ trưởng phòng</th>
                        <th>Email</th>
                        <th>Số điện thoại</th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            </table>`;
    }

    // Cập nhật bảng hiện tại
    const updatedTableBody = resultTable.querySelector("table > tbody");
    const newRow = document.createElement("tr");

    // Thêm hàng mới vào bảng
    newRow.innerHTML = `
        <td>${departmentName}</td>
        <td>${departmentHead}</td>
        <td>${departmentEmail}</td>
        <td>${departmentPhone}</td>
        <td><button class="edit-btn" onclick="editDepartment(this)">Sửa</button></td>
        <td><button class="delete-btn" onclick="deleteDepartment(this)">Xóa</button></td>
                        
    `;
    updatedTableBody.appendChild(newRow);

    // Xóa dữ liệu trong các trường input sau khi thêm
    document.getElementById("departmentName").value = "";
    document.getElementById("departmentHead").value = "";
    document.getElementById("departmentEmail").value = "";
    document.getElementById("departmentPhone").value = "";

    alert("Thêm phòng ban thành công!");
}

function calculateDepartmentTax() {
    const url = '../excel_data/data_tt.xlsx'; // Đường dẫn đến file Excel chứa dữ liệu nhân viên

    fetch(url)
        .then(response => response.arrayBuffer())
        .then(data => {
            const workbook = XLSX.read(data, { type: 'array' });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            const departments = {}; // Lưu dữ liệu phòng ban và tổng thuế
            const exemptionForSelf = 11000000; // Giảm trừ bản thân
            const exemptionPerDependent = 4400000; // Giảm trừ mỗi người phụ thuộc

            for (let i = 1; i < jsonData.length; i++) {
                const row = jsonData[i];
                const department = row[9]; // Phòng ban
                const salary = row[3]; // Lương
                const dependents = row[6]; // Số người phụ thuộc

                // Tính giảm trừ và thu nhập chịu thuế
                const totalExemption = exemptionForSelf + (exemptionPerDependent * dependents);
                const taxableIncome = salary - totalExemption;

                let tax = 0;
                if (taxableIncome > 0) {
                    if (taxableIncome <= 5000000) tax = taxableIncome * 0.05;
                    else if (taxableIncome <= 10000000) tax = taxableIncome * 0.1 - 250000;
                    else if (taxableIncome <= 18000000) tax = taxableIncome * 0.15 - 750000;
                    else if (taxableIncome <= 32000000) tax = taxableIncome * 0.2 - 1650000;
                    else if (taxableIncome <= 52000000) tax = taxableIncome * 0.25 - 3250000;
                    else if (taxableIncome <= 80000000) tax = taxableIncome * 0.3 - 5850000;
                    else tax = taxableIncome * 0.35 - 9850000;
                }

                // Tính tổng thuế theo phòng ban
                if (!departments[department]) {
                    departments[department] = 0;
                }
                departments[department] += tax;
            }

            // Hiển thị kết quả
            let resultHTML = `<h3>Thuế của các phòng ban</h3>
                              <table class="output-table">
                                <tr><th>Phòng ban</th><th>Tổng thuế (VND)</th></tr>`;
            for (const [department, totalTax] of Object.entries(departments)) {
                resultHTML += `<tr><td>${department}</td><td>${totalTax.toLocaleString()}</td></tr>`;
            }
            resultHTML += `</table>`;

            document.getElementById("department-list-table").innerHTML = resultHTML;
        })
        .catch(error => {
            console.error("Lỗi khi đọc file Excel:", error);
            alert("Không thể tính thuế cho phòng ban.");
        });
}

function showManageEmployees() {
    toggleSection("employeeList");
    employeeList();
}

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

            // Duyệt qua từng nhân viên và tính thuế
            for (let i = 1; i < jsonData.length; i++) {  // Bắt đầu từ hàng thứ 2 (hàng đầu là tiêu đề)
                const row = jsonData[i];  // Mỗi dòng dữ liệu của nhân viên
                const name = row[1];  // Cột B là tên nhân viên
                // const position = row[2];  // Cột C là chức vụ
                // const email = row[5];  // Cột F là email
                // const phone = row[4];  // Cột E là số điện thoại
                const salary = row[3];  // Cột D là lương hàng tháng
                // const dependents = row[6];  // Cột G là số người phụ thuộc
                // const year = row[8];  // Cột I là năm
                const role = row[9];  // Cột J là vai trò

                // Thêm thông tin nhân viên và thuế tính được vào bảng chi tiết
                monthlyTaxDetails += `
                <tr>
                    <td>${i}</td>
                    <td>${name}</td>
                    <td>${salary}</td>
                    <td>${role}</td>
                </tr>
            `;
            }

            // Hiển thị kết quả lên giao diện web trong một bảng HTML
            const resultTable = document.getElementById("employee-list-table");  // Lấy phần tử bảng trong HTML
            resultTable.innerHTML = ` 
            <table class="output-table1">
                <tr>
                    <th>STT</th>
                    <th>Họ và tên</th>
                    <th>Lương hàng tháng</th>
                    <th>Phòng ban</th>
                </tr>
                ${monthlyTaxDetails}  
            </table>
        `;
        })
        .catch(error => {
            console.error('Error loading Excel file:', error);  // Xử lý lỗi nếu có khi đọc tệp Excel
        });
}

//chọn phòng ban
function loadRole() {
    const roleSelect = document.getElementById("PosittonSelect");
    const selectedRole = roleSelect.value;
    const url = '../excel_data/data_tt.xlsx';

    if (selectedRole === "") {
        return; // Do nothing if the default option is selected
    }

    fetch(url)
        .then(response => response.arrayBuffer())
        .then(data => {
            const workbook = XLSX.read(data, { type: 'array' });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            let filteredDetails = '';

            for (let i = 1; i < jsonData.length; i++) {
                const row = jsonData[i];
                const role = row[9];

                if (role === selectedRole) {
                    const name = row[1];
                    const salary = row[3];
                    filteredDetails += `
                        <tr>
                            <td>${i}</td>
                            <td>${name}</td>
                            <td>${salary}</td>
                            <td>${role}</td>
                        </tr>
                    `;
                }
            }

            const resultTable = document.getElementById("employee-list-table");
            resultTable.innerHTML = `
                <table class="output-table1">
                    <tr>
                        <th>STT</th>
                        <th>Họ và tên</th>
                        <th>Lương hàng tháng</th>
                        <th>Phòng ban</th>
                    </tr>
                    ${filteredDetails}
                </table>
            `;
        })
        .catch(error => {
            console.error('Error loading Excel file:', error);
        });
}
//
function populateRoleSelect() {
    const url = '../excel_data/data_tt.xlsx';

    fetch(url)
        .then(response => response.arrayBuffer())
        .then(data => {
            const workbook = XLSX.read(data, { type: 'array' });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            const roles = jsonData.slice(1).map(row => row[9]);
            const uniqueRoles = [...new Set(roles.filter(role => role))];

            const roleSelect = document.getElementById("PosittonSelect");
            roleSelect.innerHTML = "";

            const defaultOption = document.createElement("option");
            defaultOption.value = "";
            defaultOption.textContent = "Chọn phòng ban";
            roleSelect.appendChild(defaultOption);

            uniqueRoles.forEach(role => {
                const option = document.createElement("option");
                option.value = role;
                option.textContent = role;
                roleSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error loading Excel file:', error);
        });
}
document.addEventListener("DOMContentLoaded", () => {
    populateRoleSelect();
});
