// The contact page allows users to contact sweet light studios
"use strict";
const PageBase = require('../page-base');
var homePageObject = require('./pageobject/homePage.json');
var shoppingCartJson = require('./pageobject/shoppingCart.json');
var puppeteer = require('puppeteer-core');
var unirest = require('unirest');

class HomePage extends PageBase {
	constructor (
		webdriver,
		driver,
		targetUrl = 'https://www.nykaa.com/',
		waitTimeout = 30000
		) {
		const articleSelector = 'Macmillan Learning Achieve Start';
		super(webdriver, driver, targetUrl, articleSelector, waitTimeout);
	}

	async clickOnBagIcon() {
		await this.wait();
		await this.clickWhenClickableByCss(homePageObject.addBagIcon.value);
		// await this.driver.executeScript("document.querySelector(\".AddBagIcon\").click();");
	}

  async getProductCount(){
    return await this.elements("css",".container-box");
	 // // var el = this.elements("css",".container-box");
	 // // return this.webdriver.promise.filter(el,function(el){
		// //  return el;
	 // // })
		// this.driver.findElements(By.css(".container-box")).then(function(elements){
		// 	return elements.size();
		// }).catch(function(err){
		// 	console.log("This is an error"+err)
		// })
		// 	// return new Promise((resolve, reject)=>{
		// 	// 	  this.driver.findElements(By.css(".container-box"))
		// 	// 		.then(function(elements){
		// 	// 					return elements.length;
		// 	// 	})
		// 	// })
	}

	mockAttepmtSubmissionResponse(){
		return new Promise((resolve, reject)=>{
		  puppeteer.connect({browserURL:"http://localhost:9000", defaultViewport: null})
			.then(chromeTools => chromeTools.pages())
			.then(pages => {
			  // console.log("In puppet");
			  var page = pages[0];
			  page.setRequestInterception(true);
			  page.on('request', request => {
					// console.log(request.url())
				if(request.url() == 'https://www.nykaa.com/app-api/index.php/cart/current'){
				  if(request.method() == 'POST'){
					unirest.post(request.url())
					  .headers(request.headers())
					  .send(request.postData())
					  .end(response => {
						var response_data = response.body;
					   // console.log(response_data);
						response_data=shoppingCartJson;
						// console.log(response_data);
						request.respond({
						  status: response.status,
						  headers:response.headers,
						  body: JSON.stringify(response_data)
						});
					  })
				  }else{
					// console.log("let it be puppet");
					request.continue();
				  }
				}else{
				  request.continue();
				}

			  });
			  resolve(true);
			});
		});
	  }


}
module.exports = HomePage;
