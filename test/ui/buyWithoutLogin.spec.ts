import { browser, ExpectedConditions } from 'protractor';
import { ProductsPage, CheckoutPage } from 'src/pages';
import * as chai from 'chai';
import dotenv = require('dotenv');
dotenv.config();
const { expect } = chai;

const dockerInternalURL = `${process.env.HOST_DOCKER_INTERNAL}`;

const products: ProductsPage = new ProductsPage();
const checkout: CheckoutPage = new CheckoutPage();


describe('Buying without login', () =>{
  const EC = ExpectedConditions;

  before(async () =>{
    await browser.get(dockerInternalURL);
  });

  it('should return an error message without buying anything', async () => {

    await browser.wait(EC.visibilityOf(await products.getCartDigit()), 10000);
    await browser.wait(EC.elementToBeClickable(await products.getCheckoutButton()), 10000);
    await products.addToCart(1);
    expect(await products.getCartDigit().getText()).to.equal("1");
    await products.clickCheckout();
    browser.sleep(10000);
    await browser.wait(EC.visibilityOf(await checkout.getForm()), 10000);
    await checkout.fillCheckoutForm('a', 'a','2','0','1','a','a','a','a');
    await checkout.clickCompleteOrder();
    await browser.wait(EC.visibilityOf(await checkout.getLoginErrorMessage()), 10000);
    expect(await checkout.getLoginErrorMessage().getText()).to.equal("Please login before completing order...");
    await checkout.clickContinueShopping();
    await browser.wait(EC.visibilityOf(await products.getCartDigit()), 10000);
    expect(await products.getCartDigit().getText()).to.equal("1");
  });

});