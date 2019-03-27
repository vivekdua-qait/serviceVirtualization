const chrome = require('selenium-webdriver/chrome');
const webdriver = require('selenium-webdriver');
const chromedriver = require('chromedriver');

function startDriver(){
  const pref = new webdriver.logging.Preferences();
  chrome.setDefaultService(new chrome.ServiceBuilder(chromedriver.path).build());
  var options = new chrome.Options();
  options.addArguments('--start-maximized');
  options.addArguments('--remote-debugging-port=9000');
  const driver = new webdriver.Builder()
  .forBrowser('chrome')
  .setChromeOptions(options)
  .setLoggingPrefs(pref)
  .build();
  driver.manage().window().maximize();
  driver.manage().deleteAllCookies();
  driver.manage().timeouts().implicitlyWait(90000);
  return driver;
}

module.exports = {
  startDriver: startDriver
}
