// Base class for all components including page-base and spa-page-base
const sleep = require('await-sleep');
var webdriver = require('selenium-webdriver');
By = webdriver.By;

class ComponentBase {
  constructor(
    webdriver,
    driver,
    waitTimeout = 10000,
  ) {
    this.webdriver = webdriver;
    this.driver = driver;
    this.waitTimeout = waitTimeout;
    this.log = myVar => process.stdout.write(`${myVar}\n`);
  }

   async element(locator, value){
      switch(locator){
        case 'css':{
          return await this.driver.findElement(By.css(value));
        }
        case 'name':{
          return await this.driver.findElement(By.name(value));
        }
        case 'xpath':{
          return  await this.driver.findElement(By.xpath(value));
        }
        case 'id':{
          return await this.driver.findElement(By.id(value));
        }
        case 'linkText':{
          return await this.driver.findElement(By.linkText(value));
        }
        case 'classname':{
          return await this.driver.findElement(By.classname(value));
        }
        case 'partialLinkText':{
          return  await this.driver.findElement(By.partialLinkText(value));
        }
        default:{
          console.log(`No a valid locator type ${value}`)
        }
      }
  }

 async selectDropdownText(locator,value,index){
    await this.click(locator,value);
    this.el = await this.elements(locator,`${value} option`);// this.webelement.findElements(this.webdriver.By.css("option"));
    await this.clickWhenClickable(this.el[index]);//.click();
  }

  async getElementText(locator,value){
     this.driver.findElement({"css": `${value}`}).then(function(el) {
      return el.getText();;
    });
  }

  async swtichFrame(locator,value){
      await this.waitForElementByCss(value);
      await this.driver.switchTo().frame(this.element(locator,value));
  }

  async switchWindow(){
    this.currentWindows = await this.driver.getAllWindowHandles();
    await this.driver.switchTo().window(this.currentWindows[this.currentWindows.length -1]);
  }

  async executeScript(query,index){
    this.driver.executeScript(`var a = document.querySelector('${query}'); a.selectedIndex=${index};`)
  }
  
  async click(locator,value){
    this.webelement =  await this.element(locator,value);
    await this.webelement.click();
    this.log(`click on element : ${locator} `+ ` `+`${value}`)
  }

  async enterText(locator,value,text){
    this.webelement = await this.element(locator,value);
    await this.webelement.click();
    await this.webelement.clear();
    await this.webelement.sendKeys(text);
    await this.log(`enter text :: - `+ `${text}`+` on element : ${locator} `+ ` `+`${value}`)
  }

   async elements(locator, value){
    switch(locator){
      case 'css':{
        return  await this.driver.findElements(By.css(value));
      }
      case 'name':{
        return  await this.driver.findElements(By.name(value));
      }
      case 'xpath':{
        return await this.driver.findElements(By.xpath(value));
      }
      case 'id':{
        return await this.driver.findElements(By.id(value));
      }
      case 'linkText':{
        return await this.driver.findElements(By.linkText(value));
      }
      case 'classname':{
        return await this.driver.findElements(By.classname(value));
      }
      case 'partialLinkText':{
        return await this.driver.findElements(By.partialLinkText(value));
      }
      default:{
        console.log(`No a valid locator type ${value}`)
      }
    }
  }

 async clickWhenClickableByCss(cssName, waitTimeout = 20000) {
    const element = await this.waitForElementByCss(cssName, waitTimeout);
    await this.clickWhenClickable(element, waitTimeout);
  }

  // wait for named element to be clickable and then click it
  async clickWhenClickableByName(elementName, waitTimeout = 20000) {
    const element = this.waitForElementByName(elementName, waitTimeout);
    await this.clickWhenClickable(element, waitTimeout);
  }

  async clickWhenClickable(element, waitTimeout = 20000) {
    await this.driver.wait(this.webdriver.until.elementIsVisible(element), waitTimeout);
    await this.driver.wait(this.webdriver.until.elementIsEnabled(element), waitTimeout);
    await element.click();
  }

  async waitForElementByCss(cssName, waitTimeout = 10000) {
    const selector = this.webdriver.By.css(cssName);
    const result = await this.waitForElement(selector, cssName, waitTimeout);
    return result;
  }

  async waitForElementByName(elementName, waitTimeout = 10000) {
    const selector = this.webdriver.By.name(elementName);
    const result = await this.waitForElement(selector, elementName, waitTimeout);
    return result;
  }

  // async clickWhenClickable(element, waitTimeout = 10000) {
  //   await this.driver.wait(this.webdriver.until.elementIsVisible(element), waitTimeout);
  // }

  async waitForElement(selector, elementName, waitTimeout) {
    let result;
    await this.driver.wait(() =>
      this.driver.findElement(selector)
        .then(
          (element) => {
            result = element;
            return true;
          },
          (err) => {
            if (err.name === 'NoSuchElementError') {
              return false;
            }
            return true;
          },
        ), waitTimeout, `Unable to find element: ${elementName}`);
    return result;
  }

  async waitForElementsByCss(cssName, waitTimeout = 10000) {
    const selector = this.webdriver.By.css(cssName);
    const result = await this.waitForElements(selector, cssName, waitTimeout);
    return result;
  }

  async waitForElements(selector, elementsName, waitTimeout) {
    let result;
    await this.driver.wait(() =>
      this.driver.findElements(selector)
        .then(
          (elements) => {
            result = elements;
            return true;
          },
          (err) => {
            if (err.name === 'NoSuchElementsError') {
              return false;
            }
            return true;
          },
        ), waitTimeout, `Unable to find elements: ${elementsName}`);
    return result;
  }

  async wait() {
    let promise = new Promise((resolve, reject) => {
      setTimeout(() => resolve("done!"), 5000)
    });
    let result = await promise; // wait till the promise resolves (*)

  }
  

  // output the messages from the webdriver browser console
  // Note: after we watch this for a while - we may want to add some asserts
  async dumpWebDriverLogs() {
    await this.driver.manage().logs().get('browser').then((logs) => {
      if (logs.length === 0) {
        this.log('- No items found in webdriver log');
      }
      this.log(`- logs.length: ${logs.length}`);
      logs.forEach((log) => {
        this.log(`- ${log.message}`);
      });
    });
  }

}

module.exports = ComponentBase;
