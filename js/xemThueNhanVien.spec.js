const { Builder, By } = require('selenium-webdriver');

describe('Xem THue Nhan Vien', function() {
  this.timeout(30000);
  let driver;

  const credentials = [
    { username: '20212002', password: '1234' },
    { username: '20202005', password: '3344' },
    { username: '20232008', password: '9900' },
    { username: '20212012', password: '5679' },
    { username: '20202034', password: '3347' },
    { username: '20232037', password: '9903' },
    { username: '20212040', password: '5672' },
    { username: '20202043', password: '3348' },
    { username: '20232046', password: '9904' },
    { username: '20212049', password: '5673' },
  ];

  beforeEach(async function() {
    driver = await new Builder().forBrowser('chrome').build();
  });

  afterEach(async function() {
    await driver.quit();
  });

  credentials.forEach(({ username, password }) => {
    it(`Kế Toán ${username}`, async function() {
      await driver.get("http://127.0.0.1:5500/");
      await driver.manage().window().setRect({ width: 1920, height: 1051 });
      await driver.findElement(By.id("username")).click();
      await driver.findElement(By.id("username")).sendKeys(username);
      await driver.findElement(By.id("password")).click();
      await driver.findElement(By.id("password")).sendKeys(password);
      await driver.findElement(By.css("button")).click();
      await driver.findElement(By.css("button:nth-child(7)")).click();
      await driver.findElement(By.css("#employeeTax > button")).click();
    });
  });
});
