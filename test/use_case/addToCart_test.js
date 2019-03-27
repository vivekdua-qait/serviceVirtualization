const HomePage = require('../../lib/pages/home_page');
const webdriver = require('selenium-webdriver');
const driver = require('../../webdrivers/webfactory').startDriver();
var chai = require('chai');
var assert = require('chai').assert;
expect = chai.expect;
describe('Checkout Tests', () => {

  before(async () => {
    this.homePage = new HomePage(webdriver, driver);
  });

  it('Add items into Shopping cart, on home page', async () => {
    await this.homePage.openUrl();
    await this.homePage.waitForTitleToBe("Buy Cosmetics Products & Beauty Products Online in India at Best Price | Nykaa");
    await this.homePage.mockAttepmtSubmissionResponse();
    await this.homePage.clickOnBagIcon();
    await this.homePage.getProductCount().then(function(el){
      assert.equal(el.length, 4);
      console.log('Products has been added into the Shopping Cart');
    });
  });
});
