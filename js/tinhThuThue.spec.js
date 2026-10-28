const { Builder, By, Key, until } = require('selenium-webdriver');
const assert = require('assert');

describe('Default Suite', function () {
  this.timeout(30000);
  let driver;
  let vars;

  beforeEach(async function () {
    console.log("Starting a new test case...");
    driver = await new Builder().forBrowser('chrome').build();
    vars = {};
  });

  afterEach(async function () {
    console.log("Test case completed.");
    await driver.quit();
  });

  const salaryAndDependents = [
    { "salary1": 0, "dependent1": 0, "expectedAlert": "Lương phải lớn hơn 0!" },
    { "salary1": 1, "dependent1": 1, "expectedAlert": "Thu nhập quá thấp, không cần nộp thuế!" },
    { "salary1": 50000000, "dependent1": 1, "expectedAlert": "Thuế được tính thành công!" },
    { "salary1": 199999999, "dependent1": 2, "expectedAlert": "Thuế được tính thành công!" },
    { "salary1": 200000000, "dependent1": 6, "expectedAlert": "Thuế được tính thành công!" },
    { "salary1": -1, "dependent1": -1, "expectedAlert": "Dữ liệu không hợp lệ: Lương và số người phụ thuộc phải là số dương!" },
    { "salary1": 1000000000, "dependent1": 100, "expectedAlert": "Số người phụ thuộc không thể vượt quá 10!" },
    { "salary1": 16000000, "dependent1": 0, "expectedAlert": "Thuế được tính thành công!" },
    { "salary1": 16000000, "dependent1": 2, "expectedAlert": "Thuế được tính thành công!" },
    { "salary1": 21000000, "dependent1": 1, "expectedAlert": "Thuế được tính thành công!" },
    { "salary1": 21000000, "dependent1": 3, "expectedAlert": "Thuế được tính thành công!" },
    { "salary1": 29000000, "dependent1": 3, "expectedAlert": "Thuế được tính thành công!" },
    { "salary1": 43000000, "dependent1": 0, "expectedAlert": "Thuế được tính thành công!" },
    { "salary1": 63000000, "dependent1": 0, "expectedAlert": "Thuế được tính thành công!" },
    { "salary1": 91000000, "dependent1": 1, "expectedAlert": "Thuế được tính thành công!" },
    { "salary1": 120000000, "dependent1": 2, "expectedAlert": "Thuế được tính thành công!" },
    { "salary1": 21000000, "dependent1": 4, "expectedAlert": "Thuế được tính thành công!" },
    { "salary1": 21000000, "dependent1": 5, "expectedAlert": "Thuế được tính thành công!" },
    { "salary1": 21000000, "dependent1": 6, "expectedAlert": "Thuế được tính thành công!" },
    { "salary1": 21000000, "dependent1": 100, "expectedAlert": "Số người phụ thuộc không thể vượt quá 10!" },
    { "salary1": 21000000, "dependent1": 110, "expectedAlert": "Số người phụ thuộc không thể vượt quá 10!" },
    { "salary1": 21000000, "dependent1": 1100, "expectedAlert": "Số người phụ thuộc không thể vượt quá 10!" }
  ];
  

  salaryAndDependents.forEach(pair => {
    it(`tinhThuThue with salary = ${pair.salary1} and dependent = ${pair.dependent1}`, async function () {
      console.log(`Testing with salary = ${pair.salary1} and dependents = ${pair.dependent1}`);

      await driver.get("http://127.0.0.1:5500/");
      await driver.manage().window().setRect({ width: 1920, height: 1051 });

      await driver.findElement(By.id("username")).sendKeys("20232004");
      await driver.findElement(By.id("password")).sendKeys("1122");
      await driver.findElement(By.css("button")).click();
      await driver.findElement(By.css("button:nth-child(3)")).click();

      const salaryInput = driver.findElement(By.id("salary1"));
      const dependentInput = driver.findElement(By.id("dependent1"));

      await salaryInput.clear();
      await salaryInput.sendKeys(pair.salary1.toString());

      await dependentInput.clear();
      await dependentInput.sendKeys(pair.dependent1.toString());

      await driver.findElement(By.css("button:nth-child(9)")).click();

      const alert = await driver.switchTo().alert();
      const alertText = await alert.getText();

      try {
        assert.strictEqual(alertText, pair.expectedAlert, `Incorrect alert message for salary = ${pair.salary1} and dependents = ${pair.dependent1}`);
        console.log(`Test Passed for salary = ${pair.salary1} and dependents = ${pair.dependent1}`);
      } catch (error) {
        console.error(`Test Failed for salary = ${pair.salary1} and dependents = ${pair.dependent1}: ${error.message}`);
      } finally {
        await alert.accept();
      }
    });
  });
});
