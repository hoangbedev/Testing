const { Builder, By } = require('selenium-webdriver');
const assert = require('assert');

describe('Kiểm tra chức năng Đăng nhập', function () {
  this.timeout(30000); // Tăng thời gian timeout nếu cần thiết

  let driver;

  before(async function () {
    driver = await new Builder().forBrowser('chrome').build();
  });

  after(async function () {
    await driver.quit();
  });

  const testData = [
    { username: '20202001', password: '1234' },
    { username: '20212002', password: '1234' },
    { username: '20222003', password: '1234' },
    { username: '20232004', password: '1122' },
    { username: '20202005', password: '3344' },
    { username: '20212006', password: '5566' },
    { username: '20222007', password: '7788' },
    { username: '20232008', password: '9900' },
    { username: '20242009', password: '1212' },
    { username: '20202010', password: '3434' },
    { username: '20202011', password: '1235' },
    { username: '20212012', password: '5679' },
    { username: '20222013', password: '9102' },
    { username: '20232014', password: '1123' },
    { username: '20202015', password: '3345' },
    { username: '20212016', password: '5567' },
    { username: '20222017', password: '7789' },
    { username: '20232018', password: '9901' },
    { username: '20242019', password: '1213' },
    { username: '20202020', password: '3435' },
    { username: '20202021', password: '1236' },
    { username: '20212022', password: '5670' },
    { username: '20222023', password: '9103' },
    { username: '20232024', password: '1124' },
    { username: '20202025', password: '3346' },
    { username: '20212026', password: '5568' },
    { username: '20222027', password: '7790' },
    { username: '20232028', password: '9902' },
    { username: '20242029', password: '1214' },
    { username: '20202030', password: '3436' },
    { username: '20212031', password: '5671' },
    { username: '20222032', password: '9104' },
    { username: '20232033', password: '1125' },
    { username: '20202034', password: '3347' },
    { username: '20212035', password: '5569' },
    { username: '20222036', password: '7791' },
    { username: '20232037', password: '9903' },
    { username: '20242038', password: '1215' },
    { username: '20202039', password: '3437' },
    { username: '20212040', password: '5672' },
    { username: '20222041', password: '9105' },
    { username: '20232042', password: '1126' },
    { username: '20202043', password: '3348' },
    { username: '20212044', password: '5570' },
    { username: '20222045', password: '7792' },
    { username: '20232046', password: '9904' },
    { username: '20242047', password: '1216' },
    { username: '20202048', password: '3438' },
    { username: '20212049', password: '5673' },
    { username: '20222050', password: '9106' },
  ];

  testData.forEach(({ username, password }) => {
    it(`Đăng nhập với Username: ${username} và Password: ${password}`, async function () {
      await driver.get("http://127.0.0.1:5500/index.html");
      await driver.manage().window().setRect({ width: 550, height: 692 });
      await driver.findElement(By.id("username")).click();
      await driver.findElement(By.id("username")).clear();
      await driver.findElement(By.id("username")).sendKeys(username);
      await driver.findElement(By.id("password")).click();
      await driver.findElement(By.id("password")).clear();
      await driver.findElement(By.id("password")).sendKeys(password);
      await driver.findElement(By.css("button")).click();
      
      // Kiểm tra xem đăng nhập có thành công không, chỉnh sửa selector nếu cần
      const isLoggedIn = await driver.findElement(By.css(".logout-button")).isDisplayed();
      assert.strictEqual(isLoggedIn, true);

      // Logout sau khi kiểm tra
      await driver.findElement(By.css(".logout-button")).click();
    });
  });
});
